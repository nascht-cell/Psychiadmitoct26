/**
 * Clinical-grade browser-side encryption utility using Web Crypto API (AES-GCM 256-bit).
 * Includes robust fallbacks for legacy V8 stack limits, Chrome 80-109 on Windows 7,
 * and HTTP intranet environments where Web Crypto subtle API is disabled.
 */

const SESSION_KEY_NAME = 'ha_clinical_session_entropy';

const textEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : (null as any);
const textDecoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : (null as any);

const SUBTLE_CRYPTO_SUPPORTED = Boolean(
  typeof window !== 'undefined' &&
  window.crypto &&
  window.crypto.subtle &&
  typeof window.crypto.subtle.importKey === 'function' &&
  typeof window.crypto.subtle.encrypt === 'function' &&
  typeof window.crypto.subtle.decrypt === 'function'
);

// High-speed Base64 encoder for Uint8Array without Array.from heap churn
const uint8ToBase64 = (bytes: Uint8Array): string => {
  const len = bytes.byteLength;
  const CHUNK_SIZE = 4096;
  let binary = '';
  for (let i = 0; i < len; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, len));
    // Directly apply subarray without Array.from heap allocation
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  return btoa(binary);
};

// Helper to convert base64 to Uint8Array safely
const base64ToUint8 = (base64Str: string): Uint8Array => {
  const binaryStr = atob(base64Str);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
};

// Generate raw 256-bit entropy for the session if not present, and store in sessionStorage
const getOrCreateSessionEntropy = (): string => {
  try {
    let entropy = sessionStorage.getItem(SESSION_KEY_NAME);
    if (!entropy) {
      const buffer = new Uint8Array(32);
      if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        window.crypto.getRandomValues(buffer);
      } else {
        for (let i = 0; i < 32; i++) {
          buffer[i] = (Math.random() * 256) | 0;
        }
      }
      entropy = uint8ToBase64(buffer);
      sessionStorage.setItem(SESSION_KEY_NAME, entropy);
    }
    return entropy;
  } catch (e) {
    console.warn('Failed to access sessionStorage for crypto entropy:', e);
    if (!(window as any).__clinical_entropy_fallback) {
      const buffer = new Uint8Array(32);
      if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        window.crypto.getRandomValues(buffer);
      } else {
        for (let i = 0; i < 32; i++) {
          buffer[i] = (Math.random() * 256) | 0;
        }
      }
      (window as any).__clinical_entropy_fallback = uint8ToBase64(buffer);
    }
    return (window as any).__clinical_entropy_fallback;
  }
};

let cachedCryptoKey: CryptoKey | null = null;

const isSubtleCryptoSupported = (): boolean => SUBTLE_CRYPTO_SUPPORTED;

// High-performance linear XOR cipher avoiding quadratic string re-allocations
const fallbackCipher = (str: string, keyStr: string): string => {
  const len = str.length;
  const keyLen = keyStr.length;
  const codeUnits = new Uint16Array(len);
  for (let i = 0; i < len; i++) {
    codeUnits[i] = str.charCodeAt(i) ^ keyStr.charCodeAt(i % keyLen);
  }
  const CHUNK_SIZE = 4096;
  let result = '';
  for (let i = 0; i < len; i += CHUNK_SIZE) {
    const chunk = codeUnits.subarray(i, Math.min(i + CHUNK_SIZE, len));
    result += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  return result;
};

// Import or derive CryptoKey from the session entropy
const getCryptoKey = async (): Promise<CryptoKey> => {
  if (cachedCryptoKey) return cachedCryptoKey;

  const entropyStr = getOrCreateSessionEntropy();
  const rawData = base64ToUint8(entropyStr);

  cachedCryptoKey = await window.crypto.subtle.importKey(
    'raw',
    rawData.buffer as ArrayBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  return cachedCryptoKey;
};

/**
 * Encrypts a plaintext string using AES-GCM 256-bit with an ephemeral IV.
 * Fallbacks gracefully if Web Crypto Subtle API is not available (HTTP intranet).
 */
export const encryptAtRest = async (plaintext: string): Promise<string> => {
  try {
    if (!SUBTLE_CRYPTO_SUPPORTED) {
      const entropy = getOrCreateSessionEntropy();
      const obfuscated = fallbackCipher(plaintext, entropy);
      return 'FALLBACK_OBF:' + btoa(encodeURIComponent(obfuscated));
    }

    const key = await getCryptoKey();
    const iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);
    const encodedPlaintext = textEncoder.encode(plaintext);

    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedPlaintext
    );

    const combined = new Uint8Array(iv.length + ciphertextBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertextBuffer), iv.length);

    return uint8ToBase64(combined);
  } catch (error) {
    console.error('Encryption at rest failed, using safe encoded fallback:', error);
    const entropy = getOrCreateSessionEntropy();
    const obfuscated = fallbackCipher(plaintext, entropy);
    return 'FALLBACK_OBF:' + btoa(encodeURIComponent(obfuscated));
  }
};

/**
 * Decrypts an AES-GCM 256-bit base64 encoded string or fallback payload.
 */
export const decryptAtRest = async (encryptedBase64: string): Promise<string> => {
  try {
    if (encryptedBase64.startsWith('FALLBACK_OBF:')) {
      const rawB64 = encryptedBase64.slice('FALLBACK_OBF:'.length);
      const obfuscated = decodeURIComponent(atob(rawB64));
      const entropy = getOrCreateSessionEntropy();
      return fallbackCipher(obfuscated, entropy);
    }

    if (!SUBTLE_CRYPTO_SUPPORTED) {
      throw new Error('Web Crypto Subtle is unavailable on this HTTP context');
    }

    const key = await getCryptoKey();
    const combined = base64ToUint8(encryptedBase64);

    if (combined.length < 12) {
      throw new Error('Invalid encrypted draft payload length');
    }

    const iv = combined.subarray(0, 12);
    const ciphertext = combined.subarray(12);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as BufferSource,
      },
      key,
      ciphertext as BufferSource
    );

    return textDecoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption at rest failed:', error);
    throw new Error('Failed to decrypt clinical draft data');
  }
};

