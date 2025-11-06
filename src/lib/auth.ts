// Simple authentication system using localStorage
// In production, replace with proper authentication (MongoDB, Auth0, etc.)

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'host' | 'viewer';
}

// Dummy users for demo purposes
const DUMMY_USERS: User[] = [
  { id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'host' },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'host' },
  { id: 'user-3', name: 'Viewer One', email: 'viewer1@example.com', role: 'viewer' },
];

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userId = localStorage.getItem('currentUserId');
  if (!userId) return null;
  
  const user = DUMMY_USERS.find(u => u.id === userId);
  return user || null;
}

// Set current user
export function setCurrentUser(userId: string): User | null {
  if (typeof window === 'undefined') return null;
  
  const user = DUMMY_USERS.find(u => u.id === userId);
  if (user) {
    localStorage.setItem('currentUserId', userId);
    return user;
  }
  return null;
}

// Login with email (for demo, just finds user by email)
export function login(email: string): User | null {
  if (typeof window === 'undefined') return null;
  
  const user = DUMMY_USERS.find(u => u.email === email);
  if (user) {
    localStorage.setItem('currentUserId', user.id);
    return user;
  }
  
  // If user doesn't exist, create a new viewer
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: email.split('@')[0],
    email,
    role: 'viewer',
  };
  DUMMY_USERS.push(newUser);
  localStorage.setItem('currentUserId', newUser.id);
  return newUser;
}

// Logout
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('currentUserId');
}

// Get all users (for demo)
export function getAllUsers(): User[] {
  return DUMMY_USERS;
}

// Get user by ID
export function getUserById(userId: string): User | null {
  return DUMMY_USERS.find(u => u.id === userId) || null;
}

