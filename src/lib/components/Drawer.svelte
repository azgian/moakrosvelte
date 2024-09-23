<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { createEventDispatcher } from 'svelte';

  export let open = false;
  const startX = writable(0);
  const currentX = writable(0);
  const isDragging = writable(false);

  let drawer: HTMLElement;

  const dispatch = createEventDispatcher();

  function handleTouchStart(event: TouchEvent) {
    startX.set(event.touches[0].clientX);
    currentX.set(event.touches[0].clientX);
    isDragging.set(true);
  }

  function handleTouchMove(event: TouchEvent) {
    if ($isDragging) {
      currentX.set(event.touches[0].clientX);
      const translateX = Math.min(0, $currentX - $startX);
      drawer.style.transform = `translateX(${translateX}px)`;
    }
  }

  function handleTouchEnd() {
    isDragging.set(false);
    const translateX = $currentX - $startX;
    if (translateX < -50) {
      open = false;
    } else {
      open = true;
    }
    drawer.style.transform = '';
  }

  function onClose() {
    dispatch('close');
  }

  onMount(() => {
    drawer.addEventListener('touchstart', handleTouchStart);
    drawer.addEventListener('touchmove', handleTouchMove);
    drawer.addEventListener('touchend', handleTouchEnd);
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="overlay {open ? 'open' : ''}" on:click={onClose} role="button" aria-label="Close drawer" tabindex="0"></div>
<div class="drawer {open ? 'open' : ''}">
  <slot></slot>
</div>

<style>
  .drawer {
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100%;
    background-color: #fff;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1500; /* z-index 설정 */
  }

  .drawer.open {
    transform: translateX(0);
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1100; /* z-index 설정 */
    display: none;
  }

  .overlay.open {
    display: block;
  }
</style>
