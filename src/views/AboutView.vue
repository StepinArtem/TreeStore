<script setup lang="ts">
import { reactive } from 'vue'
import TreeGrid from '@/components/TreeGrid.vue'
import { items } from '@/common/items'

// Создаём глубокую копию, чтобы мутации не влияли на оригинал
const treeItems = reactive(JSON.parse(JSON.stringify(items)))
</script>
<template>
  <div class="about">
    <TreeGrid :items="treeItems" />
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
