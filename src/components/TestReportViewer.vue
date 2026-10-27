<script setup lang="ts">
defineProps<{
  src: string
  title?: string
  height?: string
}>()
</script>

<template>
  <div class="card border-0 shadow-sm">
    <div class="card-body p-0">
      <iframe
        :src="src"
        class="w-100"
        :style="{ height: height || '800px' }"
        :title="title || 'Report'"
      ></iframe>
    </div>
  </div>
</template>
