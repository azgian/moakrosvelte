import { Timestamp } from 'firebase/firestore';
// import type { User } from 'firebase/auth';

export interface UserData
{
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    createdAt: Timestamp;
    isAdmin: boolean;
    userLevel: number;
    pinPos: {
        lat: number;
        lng: number;
        zoom: number;
    };
}
