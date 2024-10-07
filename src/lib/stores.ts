import type { UserData } from './types';
import { writable, type Writable } from 'svelte/store';

export const user: Writable<UserData | null> = writable(null);
export const isLoggedIn = writable(false);
