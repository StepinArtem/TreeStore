<script setup lang="ts">
import TreeComponent from '@/components/TreeComponent.vue'
import { getTimesOfDay } from '@/common/utils'
import { items } from '@/common/items'

const str = getTimesOfDay()
</script>

<template>
  <main>
    <TreeComponent :msg="str" :items="items" />
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
