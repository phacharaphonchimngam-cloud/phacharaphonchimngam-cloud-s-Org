import { QuizResultRecord, UserAccount, Question } from '../types/quiz';
import { QUESTION_BANK } from '../data/questionBank';

const USERS_STORAGE_KEY = 'mlp_quiz_users_v2';
const SESSION_STORAGE_KEY = 'mlp_quiz_session_v2';
const HISTORY_STORAGE_KEY = 'mlp_quiz_history_v2';
const QUESTIONS_STORAGE_KEY = 'mlp_custom_questions_v2';

/**
 * Generates a cryptographic SHA-256 hash using Web Crypto API
 * Safe, modern, and never stores plaintext passwords!
 */
async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading users from storage', err);
    return [];
  }
}

function saveStoredUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users to storage', err);
  }
}

function getStoredHistory(): QuizResultRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading history from storage', err);
    return [];
  }
}

function saveStoredHistory(history: QuizResultRecord[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Error saving history to storage', err);
  }
}

export interface AuthSession {
  user: {
    userId: string;
    displayName: string;
    email: string;
    birthday?: string;
    createdAt: string;
  } | null;
  token: string | null;
}

export const StorageService = {
  /**
   * Register a new user with hashed password & salt
   */
  async register(data: {
    displayName: string;
    email: string;
    password: string;
    birthday?: string;
  }): Promise<{ success: boolean; error?: string; user?: UserAccount }> {
    const emailNormalized = data.email.trim().toLowerCase();
    const displayNameClean = data.displayName.trim();

    if (!emailNormalized || !displayNameClean || !data.password) {
      return { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
    }

    if (data.password.length < 6) {
      return { success: false, error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' };
    }

    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === emailNormalized)) {
      return { success: false, error: 'อีเมลนี้ถูกใช้งานในระบบแล้ว กรุณาเข้าสู่ระบบ' };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(data.password, salt);

    const newUser: UserAccount = {
      userId: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      displayName: displayNameClean,
      email: emailNormalized,
      passwordHash,
      salt,
      birthday: data.birthday || undefined,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveStoredUsers(users);

    // Auto-login upon registration
    StorageService.setCurrentSession(newUser);

    return { success: true, user: newUser };
  },

  /**
   * Secure login verification
   */
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: UserAccount }> {
    const emailNormalized = email.trim().toLowerCase();
    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === emailNormalized);

    if (!user) {
      return { success: false, error: 'ไม่พบอีเมลนี้ในระบบ หรือรหัสผ่านไม่ถูกต้อง' };
    }

    const computedHash = await hashPassword(password, user.salt);
    if (computedHash !== user.passwordHash) {
      return { success: false, error: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' };
    }

    StorageService.setCurrentSession(user);
    return { success: true, user };
  },

  /**
   * Log out active user
   */
  logout(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
  },

  /**
   * Set active session
   */
  setCurrentSession(user: UserAccount): void {
    try {
      const sessionData = {
        userId: user.userId,
        displayName: user.displayName,
        email: user.email,
        birthday: user.birthday,
        createdAt: user.createdAt,
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    } catch (err) {
      console.error('Error saving session', err);
    }
  },

  /**
   * Get active user session
   */
  getCurrentUser(): {
    userId: string;
    displayName: string;
    email: string;
    birthday?: string;
    createdAt: string;
  } | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Update profile info
   */
  updateProfile(
    userId: string,
    updates: { displayName?: string; birthday?: string }
  ): boolean {
    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.userId === userId);
    if (userIndex === -1) return false;

    if (updates.displayName) {
      users[userIndex].displayName = updates.displayName.trim();
    }
    if (updates.birthday !== undefined) {
      users[userIndex].birthday = updates.birthday;
    }

    saveStoredUsers(users);

    // Update active session
    const current = StorageService.getCurrentUser();
    if (current && current.userId === userId) {
      StorageService.setCurrentSession(users[userIndex]);
    }

    return true;
  },

  /**
   * Save a completed quiz result linked strictly to userId
   */
  saveQuizResult(result: QuizResultRecord): void {
    const allHistory = getStoredHistory();
    // Add to beginning of array so newest is first
    allHistory.unshift(result);
    saveStoredHistory(allHistory);
  },

  /**
   * Get user quiz history (strict isolation: only returns records belonging to userId)
   */
  getUserHistory(userId: string): QuizResultRecord[] {
    if (!userId) return [];
    const allHistory = getStoredHistory();
    return allHistory.filter((item) => item.userId === userId);
  },

  /**
   * Retrieve a specific quiz result by id (for viewing past result without recalculation)
   */
  getQuizResultById(resultId: string): QuizResultRecord | null {
    const allHistory = getStoredHistory();
    return allHistory.find((item) => item.id === resultId) || null;
  },

  /**
   * Initialize default demo user if storage is empty, for instant testing
   */
  async ensureDemoUser(): Promise<void> {
    const users = getStoredUsers();
    if (users.length === 0) {
      await StorageService.register({
        displayName: 'โพนี่เทรนเนอร์ (Demo)',
        email: 'demo@ponyquiz.com',
        password: 'password123',
        birthday: '2000-10-10',
      });
    }
  },

  /**
   * Get all questions (from custom storage if exists, otherwise from QUESTION_BANK)
   */
  getQuestions(): Question[] {
    try {
      const raw = localStorage.getItem(QUESTIONS_STORAGE_KEY);
      if (raw) {
        const parsed: Question[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error reading questions from storage', err);
    }
    // Return cloned default question bank
    return JSON.parse(JSON.stringify(QUESTION_BANK));
  },

  /**
   * Save questions array to localStorage
   */
  saveQuestions(questions: Question[]): void {
    try {
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
    } catch (err) {
      console.error('Error saving questions to storage', err);
    }
  },

  /**
   * Update a specific question by ID and persist
   */
  updateQuestion(updated: Question): Question[] {
    const questions = StorageService.getQuestions();
    const index = questions.findIndex((q) => q.id === updated.id);
    if (index !== -1) {
      questions[index] = updated;
    } else {
      questions.push(updated);
    }
    StorageService.saveQuestions(questions);
    return questions;
  },

  /**
   * Quick toggle whether a question counts towards the score calculation
   */
  toggleQuestionScoring(questionId: number, isScored: boolean): Question[] {
    const questions = StorageService.getQuestions();
    const index = questions.findIndex((q) => q.id === questionId);
    if (index !== -1) {
      questions[index].isScored = isScored;
      StorageService.saveQuestions(questions);
    }
    return questions;
  },

  /**
   * Reset questions back to default QUESTION_BANK
   */
  resetQuestionsToDefault(): Question[] {
    try {
      localStorage.removeItem(QUESTIONS_STORAGE_KEY);
    } catch (err) {
      console.error('Error resetting questions', err);
    }
    return JSON.parse(JSON.stringify(QUESTION_BANK));
  },
};
