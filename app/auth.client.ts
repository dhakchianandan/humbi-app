import { createAuthClient } from 'better-auth/react';

const client = createAuthClient({
  baseURL: 'http://localhost:5173',
});

export const { signUp, signIn, signOut, useSession, user } = client;
