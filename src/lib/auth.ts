// frontend/src/lib/auth.ts

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Store the JWT token in localStorage
export const setToken = (token: string): void => {
  if (isBrowser) {
    localStorage.setItem('access_token', token);
  }
};

// Retrieve the JWT token from localStorage
export const getToken = (): string | null => {
  if (isBrowser) {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Remove the JWT token from localStorage
export const removeToken = (): void => {
  if (isBrowser) {
    localStorage.removeItem('access_token');
  }
};

// Check if the user is authenticated (has a valid token)
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null && token !== undefined && token.length > 0;
};

// Decode JWT token to get user info (without verification)
export const decodeToken = (token: string): any | null => {
  try {
    // Split token to get the payload part
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Get user ID from token
export const getUserIdFromToken = (): number | null => {
  const token = getToken();
  if (!token) {
    return null;
  }

  const decoded = decodeToken(token);
  if (decoded && decoded.sub) {
    return parseInt(decoded.sub, 10);
  }

  return null;
};