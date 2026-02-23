import * as Keychain from 'react-native-keychain';

// Store a token securely
export async function saveToken(token: string) {
  await Keychain.setGenericPassword('auth', token, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });
}

// Retrieve the token
export async function getToken(): Promise<string | null> {
  const creds = await Keychain.getGenericPassword();
  return creds ? creds.password : null;
}

// Delete the token (e.g., on logout)
export async function clearToken() {
  await Keychain.resetGenericPassword();
}
