<script setup lang="ts">
import { ref, computed } from 'vue'
import { TreeStore, type ITreeNode, type TId } from './model/TreeStore'

const props = defineProps<{
  treeStore: TreeStore<ITreeNode>
}>()

const emit = defineEmits<{
  added: [item: ITreeNode]
}>()

const id = ref<TId | ''>('')
const label = ref('')
const selectedParentId = ref<TId | null>(null)

const allItems = computed(() => {
  return props.treeStore.getAll()
})

const existingIds = computed(() => {
  return allItems.value.map((item) => item.id)
})

const hasIdError = computed(() => {
  if (!id.value) return false
  const existingStrIds = existingIds.value.map(String)
  return existingStrIds.includes(String(id.value))
})

function handleSubmit() {
  if (!id.value || !label.value.trim()) return
  if (hasIdError.value) return

  const newItem: ITreeNode = {
    id: id.value as unknown as TId,
    parent: selectedParentId.value,
    label: label.value.trim(),
  }

  props.treeStore.addItem(newItem)
  emit('added', newItem)

  id.value = ''
  label.value = ''
  selectedParentId.value = null
}
</script>

<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-primary text-white">
      <h5 class="mb-0">
        <i class="bi bi-plus-circle me-2"></i>Добавить узел
      </h5>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="nodeId" class="form-label">ID</label>
          <input
            id="nodeId"
            v-model="id"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasIdError }"
            placeholder="Введите ID..."
            required
          />
          <div v-if="hasIdError" class="invalid-feedback">
            Элемент с таким ID уже существует
          </div>
        </div>

        <div class="mb-3">
          <label for="nodeLabel" class="form-label">Наименование</label>
          <input
            id="nodeLabel"
            v-model="label"
            type="text"
            class="form-control"
            placeholder="Введите наименование..."
            required
          />
        </div>
        <div class="mb-3">
          <label for="parentNodeId" class="form-label">Родительский узел</label>
          <select
            id="parentNodeId"
            v-model="selectedParentId"
            class="form-select"
          >
            <option :value="null">Корень (без родителя)</option>
            <option
              v-for="item in allItems"
              :key="item.id"
              :value="item.id"
            >
              {{ item.label }}
            </option>
          </select>
        </div>

        <button
          type="submit"
          class="btn btn-success w-100"
        >
          <i class="bi bi-check-lg me-1"></i>Добавить
        </button>
      </form>
    </div>
  </div>
</template>
