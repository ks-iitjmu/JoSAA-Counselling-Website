// Utility functions for handling authentication and user data

export interface User {
  userID: number;
  username: string;
  role: 'Student' | 'Institute' | 'Administrator';
  email: string;
  candidateID?: number;
  instituteCode?: string;
  studentName?: string;
  studentEmail?: string;
  mobileNumber?: string;
  jeeMainsAIR?: number;
  instituteName?: string;
  institutePhone?: string;
  website?: string;
}

/**
 * Get the current logged-in user from localStorage
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true' && getCurrentUser() !== null;
};

/**
 * Check if the current user has a specific role
 */
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

/**
 * Check if the current user is a student
 */
export const isStudent = (): boolean => {
  return hasRole('Student');
};

/**
 * Check if the current user is an institute
 */
export const isInstitute = (): boolean => {
  return hasRole('Institute');
};

/**
 * Check if the current user is an administrator
 */
export const isAdmin = (): boolean => {
  return hasRole('Administrator');
};

/**
 * Clear user data and logout
 */
export const clearUserData = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
};

/**
 * Store user data in localStorage
 */
export const setUserData = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('isAuthenticated', 'true');
};
