<script lang="ts">
    import type { PageData } from './$types';
    import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
    import { auth } from '$lib/firebase'; // Firebase 인증 객체를 가져옵니다.
    import { goto } from '$app/navigation';

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // 로그인 성공 후 처리
            goto('/'); // 로그인 후 메인 페이지로 이동
        } catch (error) {
            console.error('Google 로그인 실패:', error);
            // 에러 처리
        }
    };

    export let data: PageData;
</script>

<div class="auth-container">
    <button on:click={handleGoogleSignIn} class="google-button">
        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
        </svg>
        <span>Google로 로그인</span>
    </button>
    <button on:click={()=>goto('/')} class="google-button">
        <span class="material-icons">home</span> 홈으로 가기
    </button>
</div>

<style>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    gap: 150px;
}

.google-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: #666;
    padding: 12px 16px;
    border: 1px solid #92b9f8;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.3s;
}

.google-button:hover {
    background-color: #92b9f8;
    color: white;
}

.google-button svg {
    margin-right: 8px;
}

.google-button span {
    margin-left: 8px;
}
</style>
