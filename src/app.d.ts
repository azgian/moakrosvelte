// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { DecodedIdToken } from 'firebase-admin/auth';

declare global {
	namespace App
	{
		interface Locals {
			user?: DecodedIdToken;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
