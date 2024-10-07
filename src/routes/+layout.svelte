<script lang="ts">
    import type { LayoutData } from './$types';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { writable } from 'svelte/store';
    import { user, isLoggedIn } from '$lib/stores';
    import type { UserData } from '$lib/types';
    import SideLeft from '$lib/components/SideLeft.svelte';
    import '../app.css';

    export let data: LayoutData;

    // let loading = true;
    let loading = false;
    let showInstallPrompt = false;
    const deferredPrompt = writable<any>(null);
    const drawerOpen = writable(false);
    let isDesktop = false;

    onMount(() => {

        user.set(data.user as UserData);
        isLoggedIn.set($user?.uid ? true : false);

        setTimeout(() => {
            loading = false;
            // checkInstallPrompt(); // PWA 설치 프롬프트 체크 비활성화
        }, 2000);

        if (browser) {
            window.addEventListener('beforeinstallprompt', (e: Event) => {
                e.preventDefault();
                // deferredPrompt.set(e); // PWA 설치 프롬프트 이벤트 비활성화
            });
        }

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    });

    const checkScreenSize = () => {
        isDesktop = window.innerWidth >= 768; // 768px를 데스크톱 기준으로 설정
        drawerOpen.set(isDesktop); // 데스크톱에서는 항상 열려있도록 설정
    }

    // function checkInstallPrompt() {
    //     if (browser && ('standalone' in navigator || window.matchMedia('(display-mode: standalone)').matches)) {
    //         return;
    //     }
    //     showInstallPrompt = true;
    // }

    const closeInstallPrompt = () => {
        showInstallPrompt = false;
    }

    const installPWA = () => {
        if ($deferredPrompt) {
            ($deferredPrompt as any).prompt();
            ($deferredPrompt as any).userChoice.then((choiceResult: { outcome: string }) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('사용자가 PWA 설치를 수락했습니다');
                }
                deferredPrompt.set(null);
            });
        }
    }
</script>

<div class="app-container">

    <SideLeft drawerOpen={$drawerOpen} {isDesktop} />

    <main>
        {#if loading}
            <div transition:fade="{{ duration: 300 }}" class="loading-screen">
                <img src="/images/logo300.png" alt="로고" />
                <p>앱 로딩 중...</p>
            </div>
        {:else}
            <slot />
        {/if}

        {#if showInstallPrompt}
            <div transition:fade="{{ duration: 300 }}" class="install-prompt">
                <p>홈 화면에 추가하여 앱처럼 사용해보세요!</p>
                <button on:click={installPWA}>설치하기</button>
                <button on:click={closeInstallPrompt}>닫기</button>
            </div>
        {/if}
    </main>
</div>

<style>
    .app-container {
        display: flex;
        height: 100vh;
    }

    main {
        flex-grow: 1;
        position: relative;
    }

    .loading-screen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .install-prompt {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #f0f0f0;
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
    }

    /* .menu-button {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
    }

    .hidden {
        display: none;
    }

    @media (min-width: 768px) {
        .menu-button {
            display: none;
        }
    } */
</style>