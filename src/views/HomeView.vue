<script setup lang="ts">
import { reactive } from 'vue'
import TreeComponent from '@/components/TreeComponent.vue'
import { getTimesOfDay } from '@/common/utils'
import { items } from '@/common/items'

// Создаём глубокую копию, чтобы мутации не влияли на оригинал
const treeItems = reactive(JSON.parse(JSON.stringify(items)))
const str = getTimesOfDay()
</script>

<template>
  <main>
    <TreeComponent :msg="str" :items="treeItems" />
  </main>
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
