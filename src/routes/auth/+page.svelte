<script lang="ts">
	import { stylesheets } from './../../../.svelte-kit/output/server/nodes/2.js';
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

<div class="auth-container">
    <div class="auth-form">
        <h1>로그인</h1>
        <form>
            <input type="email" placeholder="이메일" required />
            <input type="password" placeholder="비밀번호" required />
            <button type="submit">로그인</button>
        </form>
    </div>
</div>

<style>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

</style>
