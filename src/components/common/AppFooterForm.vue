<template>
  <section class="container">
    <div class="children">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: "AppFooterForm",
};
</script>

<style scoped>
.container {
  background-color: #f3f3f3;
  display: flex;
  min-height: 50px;
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  right: 0;
  width: fit-content;
  min-height: 50px;
  z-index: 10;
  padding-right: 48px;
}

.children{
  display: flex;
  align-items: center;
  justify-content: flex-end;
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