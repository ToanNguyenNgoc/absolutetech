<template>
    <section class="shadow-container">
        <p>Powered by Absolutech-Auth</p>
        <slot></slot>
    </section>
</template>

<script>
export default {
    name: "AppFooter",
};
</script>

<style scoped>
.shadow-container {
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25);
    background-color: #f3f3f3;
    display: flex;
    min-height: 50px;
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    min-height: 50px;
}

p {
    padding-left: 30px;
}

@media (max-width: 640px) {
    .login-page .shadow-container {
        display: none;
    }
}
</style>