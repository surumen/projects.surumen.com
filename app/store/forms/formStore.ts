import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FormTemplate, FormDraft, FormSubmission } from '@/types/forms/advanced';

// ========================
// FORM STORE INTERFACES
// ========================

interface FormStore {
  // Templates
  templates: FormTemplate[];
  
  // Drafts
  drafts: Record<string, FormDraft>;
  
  // Submissions
  submissions: FormSubmission[];
  
  // Template Actions
  createTemplate: (template: Omit<FormTemplate, 'id' | 'metadata'>) => FormTemplate;
  updateTemplate: (id: string, updates: Partial<FormTemplate>) => boolean;
  deleteTemplate: (id: string) => boolean;
  getTemplate: (id: string) => FormTemplate | null;
  
  // Draft Actions
  saveDraft: (formId: string, values: Record<string, any>) => FormDraft;
  loadDraft: (formId: string) => FormDraft | null;
  deleteDraft: (formId: string) => boolean;
  cleanExpiredDrafts: () => void;
  
  // Submission Actions
  addSubmission: (submission: Omit<FormSubmission, 'id'>) => FormSubmission;
  getSubmissions: (formId?: string) => FormSubmission[];
  deleteSubmission: (id: string) => boolean;
  
  // Utility Actions
  clearAll: () => void;
}

// ========================
// FORM STORE IMPLEMENTATION
// ========================

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      // Initial State
      templates: [],
      drafts: {},
      submissions: [],

      // Template Actions
      createTemplate: (templateData) => {
        const template: FormTemplate = {
          ...templateData,
          id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          metadata: {
            created: new Date(),
            updated: new Date(),
            version: '1.0.0',
            author: 'user'
          }
        };

        set(state => ({
          templates: [...state.templates, template]
        }));

        return template;
      },

      updateTemplate: (id, updates) => {
        set(state => ({
          templates: state.templates.map(template =>
            template.id === id
              ? {
                  ...template,
                  ...updates,
                  metadata: {
                    created: template.metadata?.created || new Date(),
                    updated: new Date(),
                    version: template.metadata?.version || '1.0.0',
                    author: template.metadata?.author || 'user',
                    ...updates.metadata
                  }
                } as FormTemplate
              : template
          )
        }));
        return true;
      },

      deleteTemplate: (id) => {
        set(state => ({
          templates: state.templates.filter(template => template.id !== id)
        }));
        return true;
      },

      getTemplate: (id) => {
        return get().templates.find(template => template.id === id) || null;
      },

      // Draft Actions
      saveDraft: (formId, values) => {
        const draft: FormDraft = {
          id: `draft_${formId}_${Date.now()}`,
          formId,
          values,
          savedAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        };

        set(state => ({
          drafts: {
            ...state.drafts,
            [formId]: draft
          }
        }));

        return draft;
      },

      loadDraft: (formId) => {
        const draft = get().drafts[formId];
        if (draft && (!draft.expiresAt || draft.expiresAt > new Date())) {
          return draft;
        }
        return null;
      },

      deleteDraft: (formId) => {
        set(state => {
          const { [formId]: removed, ...remainingDrafts } = state.drafts;
          return { drafts: remainingDrafts };
        });
        return true;
      },

      cleanExpiredDrafts: () => {
        const now = new Date();
        set(state => ({
          drafts: Object.fromEntries(
            Object.entries(state.drafts).filter(([_, draft]) =>
              !draft.expiresAt || draft.expiresAt > now
            )
          )
        }));
      },

      // Submission Actions
      addSubmission: (submissionData) => {
        const submission: FormSubmission = {
          ...submissionData,
          id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        set(state => ({
          submissions: [...state.submissions, submission]
        }));

        return submission;
      },

      getSubmissions: (formId) => {
        const submissions = get().submissions;
        return formId
          ? submissions.filter(submission => submission.formId === formId)
          : submissions;
      },

      deleteSubmission: (id) => {
        set(state => ({
          submissions: state.submissions.filter(submission => submission.id !== id)
        }));
        return true;
      },

      // Utility Actions
      clearAll: () => {
        set({
          templates: [],
          drafts: {},
          submissions: []
        });
      }
    }),
    {
      name: 'form-store',
      partialize: (state) => ({
        drafts: state.drafts,
        submissions: state.submissions
        // Note: Removed templates from persistence to start fresh
      })
    }
  )
);

// ========================
// CONVENIENCE HOOKS
// ========================

export const useFormDrafts = () => {
  const drafts = useFormStore(state => state.drafts);
  const saveDraft = useFormStore(state => state.saveDraft);
  const loadDraft = useFormStore(state => state.loadDraft);
  const deleteDraft = useFormStore(state => state.deleteDraft);
  const cleanExpiredDrafts = useFormStore(state => state.cleanExpiredDrafts);

  return {
    drafts,
    saveDraft,
    loadDraft,
    deleteDraft,
    cleanExpiredDrafts
  };
};
