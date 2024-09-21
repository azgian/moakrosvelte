<script lang="ts">
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;

    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

    onMount(() => {
        if (browser && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => console.log('Service Worker 등록 성공:', registration.scope))
                .catch((error) => console.log('Service Worker 등록 실패:', error));
        }
    });
</script>

<slot />