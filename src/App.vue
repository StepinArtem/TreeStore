<script setup lang="ts">
import MainNavbar from '@/components/MainNavbar.vue'
</script>

<template>
  <div class="d-flex">
    <MainNavbar />
    <main class="flex-grow-1 bg-light">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
  main {
    height : 100vh;
    overflow-y:auto;
  }
</style>
