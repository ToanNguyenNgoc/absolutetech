<template>
  <router-link :to="to" class="card-link">
    <div class="card">
      <div class="card-icon">{{ icon }}</div>
      <div class="card-title">{{ title }}</div>
    </div>
  </router-link>
</template>

<script setup>
// eslint-disable-next-line no-undef
defineProps({
  title: String,
  icon: String,
  to: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
}

.card {
  width: 260px;
  height: 130px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.card-title {
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
}
</style>
