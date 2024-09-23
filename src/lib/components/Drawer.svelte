<script lang="ts">
  export let drawerOpen: boolean;
  export let isDesktop: boolean = false;

  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  function handleTouchStart(event: TouchEvent) {
    startX = event.touches[0].clientX;
    isSwiping = true;
  }

  function handleTouchMove(event: TouchEvent) {
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

  function handleTouchEnd() {
    isSwiping = false;
  }

  function toggleDrawer() {
    drawerOpen = !drawerOpen;
  }
</script>

{#if !isDesktop}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="overlay { drawerOpen ? 'open' : ''}" on:click={() => drawerOpen = false} role="button" aria-label="Close drawer" tabindex="0"></div>
{/if}
<nav class="drawer { drawerOpen || isDesktop ? 'open' : ''}">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="drag-handle" on:touchstart={handleTouchStart} on:touchmove={handleTouchMove} on:touchend={handleTouchEnd} on:click={toggleDrawer}>
    <span class="material-icons">{ drawerOpen ? 'chevron_left' : 'chevron_right' }</span>
  </div>
  <slot></slot>
</nav>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
    z-index: 1100;
  }
  .overlay.open {
    display: block;
  }
  .drawer {
    position: fixed;
    top: 0;
    left: -280px;
    width: 280px;
    height: 100%;
    background-color: var(--sidebar-color); /* 배경색에 --primary-color 적용 */
    transition: left 0.3s ease-in-out;
    z-index: 1200;
  }
  .drawer.open {
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
    border-radius: 0 20px 20px 0; /* 반원형 모양 */
  }

  .drag-handle .material-icons {
    font-size: 24px;
    color: #fff; /* 아이콘 색을 투명으로 설정 */
  }

  @media (min-width: 768px) {
    .drawer {
      position: relative;
      left: 0;
    }
    .drag-handle {
      display: none;
    }
  }
</style>
