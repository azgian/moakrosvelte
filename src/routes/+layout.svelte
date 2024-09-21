<script lang="ts">
    import type { LayoutData } from './$types';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { writable, type Writable } from 'svelte/store';

    export let data: LayoutData;

    let loading = true;
    let showInstallPrompt = false;
    const deferredPrompt: Writable<any> = writable(null);

    onMount(() => {
        setTimeout(() => {
            loading = false;
            checkInstallPrompt();
        }, 2000);

        if (browser) {
            window.addEventListener('beforeinstallprompt', (e: Event) => {
                e.preventDefault();
                deferredPrompt.set(e);
            });
        }
    });

    function checkInstallPrompt() {
        if (browser && ('standalone' in navigator || window.matchMedia('(display-mode: standalone)').matches)) {
            return;
        }
        showInstallPrompt = true;
    }

    function closeInstallPrompt() {
        showInstallPrompt = false;
    }

    function installPWA() {
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

<style>
  .loading-screen {
    position: fixed;
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
</style>