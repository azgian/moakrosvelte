<script lang="ts">
    import { user, isLoggedIn } from '$lib/stores';
</script>
<div class="profile-container">
    {#if $isLoggedIn}
    <img src="{$user?.photoURL}" alt="프로필 이미지" class="profile-image" />
    {:else}
    <a href="/">
        <img src="/images/logo300.png" alt="로고" class="logo" />
    </a>
    {/if}
</div>
<div class="menu-container">
</div>

<style>
    .profile-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 15px;
    }
    .menu-container {
        padding:15px;
    }
    .logo {
        width: 100px;
    }
    .profile-image {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
</style>