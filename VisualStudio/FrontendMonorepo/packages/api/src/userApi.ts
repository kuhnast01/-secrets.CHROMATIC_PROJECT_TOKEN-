// userApi.ts
// Mock user management and SSO endpoints
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  provider: 'local' | 'google' | 'microsoft';
}

let users: User[] = [
  { id: '1', email: 'admin@example.com', name: 'Admin', role: 'admin', provider: 'local' },
  { id: '2', email: 'op@example.com', name: 'Operator', role: 'operator', provider: 'google' },
];

export function getUsersAPI(req: any, res: any) {
  res.json(users);
}

export function addUserAPI(req: any, res: any) {
  const user = req.body as User;
  users.push(user);
  res.json({ success: true });
}

export function loginSSOAPI(req: any, res: any) {
  // Mock SSO login
  res.json({ success: true, user: users[0] });
}
