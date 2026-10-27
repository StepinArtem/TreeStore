<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { to: '/', label: 'Главная', icon: 'bi-house-fill' },
  { to: '/about', label: 'Таблица', icon: 'bi-table' },
  { to: '/tree-tests', label: 'Тесты', icon: 'bi-clipboard-data-fill' },
]

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <nav class="navbar navbar-dark bg-primary shadow-sm">
    <div class="container-fluid flex-column py-3">
      <div class="d-flex justify-content-between align-items-center">
        <RouterLink to="/" class="navbar-brand d-flex align-items-center gap-2">
          <i class="bi bi-diagram-3-fill fs-4"></i>
          <span class="fw-bold fs-5 mb-0">TreeStore</span>
        </RouterLink>
      </div>

      <ul class="navbar-nav mt-3 gap-2 flex-column">
        <li
          v-for="item in navItems"
          :key="item.to"
          class="nav-item w-100"
        >
          <RouterLink
            :to="item.to"
            class="nav-link d-flex align-items-center gap-3"
            :class="{ active: isActive(item.to) }"
          >
            <i :class="item.icon" class="fs-5"></i>
            <span class="fw-medium">{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  border-radius: 8px;
  transition: all 0.2s ease;
  padding: 0.75rem 1rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}
</style>
