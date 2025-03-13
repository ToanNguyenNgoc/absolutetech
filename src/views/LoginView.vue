<template>
    <main class="login-page">
        <LoginForm @login="handleLogin" />
        <AppFooter />
    </main>
</template>

<script>
import AppFooter from '@/components/AppFooter.vue';
import LoginForm from '@/components/auth/LoginForm.vue';



export default {
    name: "LoginPage",
    components: {
        LoginForm,
        AppFooter
    },
    methods: {
        handleLogin(credentials) {
            console.log("Login attempted with:", credentials);
        },
    },
};
</script>

<style scoped>
</style>