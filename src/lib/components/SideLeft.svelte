<script lang="ts">
  import SideLeftNav from './SideLeftNav.svelte';
  export let drawerOpen: boolean;
  export let isDesktop: boolean = false;

  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  const handleTouchStart = (event: TouchEvent) => {
    startX = event.touches[0].clientX;
    isSwiping = true;
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!isSwiping) return;
    currentX = event.touches[0].clientX;
    const diffX = currentX - startX;
    if (diffX > 50) {
      drawerOpen = true;
      isSwiping = false;
    } else if (diffX < -50) {
      drawerOpen = false;
      isSwiping = false;
    }
  }

  const handleTouchEnd = () => {
    isSwiping = false;
  }

  const toggleDrawer = () => {
    drawerOpen = !drawerOpen;
  }
</script>

{#if !isDesktop}
  <button class="overlay { drawerOpen ? 'open' : ''}" on:click={() => drawerOpen = false} aria-label="Close drawer" tabindex="0"></button>
{/if}
<nav class="side-left { drawerOpen || isDesktop ? 'open' : ''}">
  <button class="drag-handle" on:touchstart={handleTouchStart} on:touchmove={handleTouchMove} on:touchend={handleTouchEnd} on:click={toggleDrawer}>
    <span class="material-icons">{ drawerOpen ? 'chevron_left' : 'chevron_right' }</span>
  </button>
  <SideLeftNav />
</nav>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    border: none;
    display: none;
    z-index: 1100;
  }
  .overlay.open {
    display: block;
  }
  .side-left {
    position: fixed;
    top: 0;
    left: -280px;
    width: 280px;
    height: 100%;
    background-color: var(--sidebar-color);
    transition: left 0.3s ease-in-out;
    z-index: 1200;
  }
  .side-left.open {
    left: 0;
  }

  .drag-handle {
    position: absolute;
    top: 50%;
    right: -30px;
    width: 30px;
    height: 60px;
    background-color: var(--sidebar-color);
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-50%);
    cursor: pointer;
    border-radius: 0 20px 20px 0;
    border: none;
  }

  .drag-handle .material-icons {
    font-size: 24px;
    color: #fff;
  }

  @media (min-width: 768px) {
    .side-left {
      position: relative;
      left: 0;
    }
    .drag-handle {
      display: none;
    }
  }
</style>
