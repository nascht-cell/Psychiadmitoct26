import { PsychiatricAssessment, initialAssessmentData, parseFullName } from '../types/assessment';

export interface AssessmentState {
  data: PsychiatricAssessment;
  errors: Record<string, string>;
}

export type AssessmentAction =
  | { type: 'UPDATE_FIELDS'; payload: Partial<PsychiatricAssessment> }
  | { type: 'BATCH_UPDATE_FIELDS'; payload: Partial<PsychiatricAssessment> }
  | { type: 'SET_FIELD_ERROR'; payload: { field: string; error: string } }
  | { type: 'CLEAR_FIELD_ERROR'; payload: { field: string } }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'RESET_FORM'; payload?: PsychiatricAssessment }
  | { type: 'LOAD_PATIENT'; payload: PsychiatricAssessment }
  | { type: 'APPLY_WNL_MSE' }
  | { type: 'APPLY_WNL_PHYSICAL' };

/**
 * High-performance equality comparator for clinical assessment data fields.
 * Handles primitives, empty/undefined normalization, and shallow array equivalence.
 */
function isFieldEqual(a: any, b: any): boolean {
  if (a === b) return true;
  // Normalize empty strings and undefined/null for clinical form inputs
  if ((a === undefined || a === null || a === '') && (b === undefined || b === null || b === '')) {
    return true;
  }
  // Fast array equality check
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  return false;
}

export const initialAssessmentState: AssessmentState = {
  data: initialAssessmentData,
  errors: {},
};

/**
 * Unified Reducer for Psychiatric Assessment Form State.
 * Ensures:
 * 1. Atomic state transitions combining data updates and validation error clearing.
 * 2. Bailout / No-Op short-circuiting: returns identical state reference if values have not changed.
 * 3. Batch field merging for high-frequency user interactions.
 */
export function assessmentReducer(state: AssessmentState, action: AssessmentAction): AssessmentState {
  switch (action.type) {
    case 'UPDATE_FIELDS':
    case 'BATCH_UPDATE_FIELDS': {
      const updates = action.payload;
      const updateKeys = Object.keys(updates) as (keyof PsychiatricAssessment)[];
      
      if (updateKeys.length === 0) {
        return state;
      }

      let hasDataChanged = false;
      for (let i = 0; i < updateKeys.length; i++) {
        const key = updateKeys[i];
        if (!isFieldEqual(state.data[key], updates[key])) {
          hasDataChanged = true;
          break;
        }
      }

      // Check if any error should be cleared for non-empty updated fields
      let nextErrors = state.errors;
      let hasErrorChanges = false;

      if (Object.keys(state.errors).length > 0) {
        for (let i = 0; i < updateKeys.length; i++) {
          const key = updateKeys[i] as string;
          if (state.errors[key]) {
            const val = updates[key as keyof PsychiatricAssessment];
            const isFilled = typeof val === 'string' ? val.trim().length > 0 : Boolean(val);
            if (isFilled) {
              if (!hasErrorChanges) {
                nextErrors = { ...state.errors };
                hasErrorChanges = true;
              }
              delete nextErrors[key];
            }
          }
        }
      }

      // BAILOUT: Return previous state reference if no real data or error changes occurred
      if (!hasDataChanged && !hasErrorChanges) {
        return state;
      }

      return {
        data: hasDataChanged ? { ...state.data, ...updates } : state.data,
        errors: nextErrors,
      };
    }

    case 'SET_FIELD_ERROR': {
      const { field, error } = action.payload;
      if (state.errors[field] === error) {
        return state;
      }
      return {
        ...state,
        errors: {
          ...state.errors,
          [field]: error,
        },
      };
    }

    case 'CLEAR_FIELD_ERROR': {
      const { field } = action.payload;
      if (!state.errors[field]) {
        return state;
      }
      const nextErrors = { ...state.errors };
      delete nextErrors[field];
      return {
        ...state,
        errors: nextErrors,
      };
    }

    case 'SET_ERRORS': {
      return {
        ...state,
        errors: action.payload,
      };
    }

    case 'RESET_FORM': {
      return {
        data: action.payload ? { ...action.payload } : { ...initialAssessmentData },
        errors: {},
      };
    }

    case 'LOAD_PATIENT': {
      const patient = { ...action.payload };
      if (patient.fullName && (!patient.firstName || !patient.lastName)) {
        const parsedName = parseFullName(patient.fullName);
        patient.titlePrefix = patient.titlePrefix || parsedName.titlePrefix;
        patient.firstName = patient.firstName || parsedName.firstName;
        patient.lastName = patient.lastName || parsedName.lastName;
      }
      return {
        data: patient,
        errors: {},
      };
    }

    case 'APPLY_WNL_MSE': {
      const wnlMseUpdates: Partial<PsychiatricAssessment> = {
        appearanceBehavior: ['Normal'],
        speech: ['Normal'],
        moodAffect: ['Euthymic'],
        thoughtProcess: ['Logical/Coherent'],
        thoughtContent: ['Normal'],
        delusionDetail: '',
        perception: ['Normal'],
        orientationTime: true,
        orientationPlace: true,
        orientationPerson: true,
        attentionMemory: 'Intact',
        insight: '6(True)',
        judgment: 'Intact',
      };
      return {
        data: {
          ...state.data,
          ...wnlMseUpdates,
        },
        errors: state.errors,
      };
    }

    case 'APPLY_WNL_PHYSICAL': {
      const wnlPhysicalUpdates: Partial<PsychiatricAssessment> = {
        generalAppearance: 'Normal',
        generalAppearanceDetail: '',
        heent: 'Normal',
        heentDetail: '',
        cvsRs: 'Normal',
        cvsRsDetail: '',
        abdomen: 'Normal',
        abdomenDetail: '',
        extremities: 'Normal',
        extremitiesDetail: '',
        cranialNerves: 'Grossly intact',
        cranialNervesDetail: '',
        motorPower: 'Grade V all',
        motorPowerDetail: '',
        tone: 'Normal',
        toneDetail: '',
        sensory: 'Intact',
        sensoryDetail: '',
        reflexes: 'Normal',
        reflexesDetail: '',
        cerebellar: 'Normal',
        cerebellarDetail: '',
        nutrition: 'Normal',
        adl: 'Independent',
      };
      return {
        data: {
          ...state.data,
          ...wnlPhysicalUpdates,
        },
        errors: state.errors,
      };
    }

    default:
      return state;
  }
}
