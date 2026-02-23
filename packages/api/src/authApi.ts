// Example Auth API functions
export type AuthResponse = {
  token: string;
  refreshToken: string;
  userId: string;
};

export async function login(username: string, password: string): Promise<AuthResponse> {
  // Replace with real API call
  if (username === 'demo' && password === 'demo') {
    return {
      token: 'mock-token',
      refreshToken: 'mock-refresh',
      userId: '1',
    };
  }
  throw new Error('Invalid credentials');
}

export async function register(username: string, password: string): Promise<AuthResponse> {
  // Replace with real API call
  return {
    token: 'mock-token',
    refreshToken: 'mock-refresh',
    userId: '1',
  };
}
