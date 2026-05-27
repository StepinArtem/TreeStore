<script setup lang="ts">
import TreeGrid from '@/components/TreeGrid.vue'
import { items } from '@/common/items'
</script>
<template>
  <div class="about">
    <TreeGrid :items="items" />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
