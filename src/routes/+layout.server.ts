import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { UserData } from '$lib/types';

export const load: LayoutServerLoad = async ({ locals }) => {
    const firebaseUser = locals.user;

    if (!firebaseUser) {
        return { user: null };
    }

    // 사용자 데이터 가져오기
    const userDoc = doc(db, 'users', firebaseUser.uid);
    const userSnapshot = await getDoc(userDoc);
    
    if (!userSnapshot.exists()) {
        return { user: null };
    }

    const userData: UserData = {
        uid: userSnapshot.id,
        email: userSnapshot.data().email,
        displayName: userSnapshot.data().displayName,
        photoURL: userSnapshot.data().photoURL,
        createdAt: userSnapshot.data().createdAt,
        isAdmin: userSnapshot.data().isAdmin,
        userLevel: userSnapshot.data().userLevel,
        pinPos: userSnapshot.data().pinPos,
    }

    return { user: userData };
};