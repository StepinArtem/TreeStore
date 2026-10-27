<script setup lang="ts">
import TestReportViewer from '@/components/TestReportViewer.vue'
</script>

<template>
  <div class="container-fluid py-4">
    <h1 class="h3 mb-4">
      <i class="bi bi-clipboard-data me-2"></i>Test Report
    </h1>

    <TestReportViewer
      src="/test-report/index.html"
      title="Test Report"
    />

  </div>
</template>
