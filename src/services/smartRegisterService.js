import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const buildSessionUrl = (template, sessionId) =>
  template.replace(':sessionId', sessionId);

const normalizeProgress = (payload = {}) => {
  const progress = payload.progress || {};

  const total =
    progress.totalQuestions ??
    payload.totalQuestions ??
    progress.total ??
    payload.total ??
    payload.questions?.length ??
    0;

  const currentStep =
    progress.currentStep ??
    payload.currentStep ??
    (progress.answered ? progress.answered + 1 : undefined);

  const answered =
    progress.answered ??
    (typeof currentStep === 'number' ? Math.max(currentStep - 1, 0) : undefined) ??
    payload.answers?.length ??
    0;

  const remaining = typeof total === 'number' && total > 0
    ? Math.max(total - Math.max(answered, 0), 0)
    : null;

  return {
    ...progress,
    answered,
    total,
    currentStep: currentStep ?? answered ?? 0,
    totalQuestions: total,
    remaining,
  };
};

// Normalize different backend response shapes to always expose a sessionId and progress
const normalizeSession = (payload = {}) => {
  const base = payload.data || payload.session || payload;
  const merged = { ...base, ...payload };
  merged.sessionId =
    merged.sessionId ||
    merged.id ||
    base?.sessionId ||
    base?.id ||
    merged.data?.sessionId ||
    merged.session?.id;

  merged.progress = normalizeProgress(merged);
  return merged;
};

const smartRegisterService = {
  /**
   * Start a new SetupIQ smart register session
   */
  async startSession() {
    const response = await api.post(API_ENDPOINTS.SMART_REGISTER_START);
    return normalizeSession(response);
  },

  /**
   * Submit an answer for the current question
   */
  async answerSession(sessionId, answer) {
    const response = await api.post(
      buildSessionUrl(API_ENDPOINTS.SMART_REGISTER_ANSWER, sessionId),
      { answer, sessionId }
    );
    return normalizeSession(response);
  },

  /**
   * Fetch a specific session
   */
  async getSession(sessionId) {
    const response = await api.get(
      buildSessionUrl(API_ENDPOINTS.SMART_REGISTER_SESSION, sessionId)
    );
    return normalizeSession(response);
  },

  /**
   * List recent sessions for the user
   */
  async listSessions() {
    return api.get(API_ENDPOINTS.SMART_REGISTER);
  },

  /**
   * Finish a smart register session (returns auth token/user)
   */
  async finishSession(sessionId, payload) {
    return api.post(
      buildSessionUrl(API_ENDPOINTS.SMART_REGISTER_FINISH, sessionId),
      { ...payload, sessionId }
    );
  },

  /**
   * Submit full form (single shot)
   */
  async submitForm(payload) {
    const response = await api.post(API_ENDPOINTS.SMART_REGISTER_FORM, payload);
    return normalizeSession(response);
  },
};

export default smartRegisterService;
