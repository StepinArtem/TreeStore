<script setup lang="ts">
import { ref, computed, shallowRef, watch, onMounted, triggerRef } from 'vue'
import { AgGridVue, type GridReadyEvent } from 'ag-grid-vue3'
import { AllCommunityModule, ModuleRegistry, type AutoGroupColumnDef } from 'ag-grid-community'
import { TreeDataModule } from 'ag-grid-enterprise'
import { TreeStore, type ITreeNode, type TId } from '@/components/model/TreeStore'
import { RowNumbersModule } from 'ag-grid-enterprise'
import TreeNodeForm from './TreeNodeForm.vue'

// Register all core community grid packages
ModuleRegistry.registerModules([AllCommunityModule, TreeDataModule, RowNumbersModule])

const props = withDefaults(
  defineProps<{
    msg?: string
    items?: ITreeNode[]
  }>(),
  {
    msg: 'TreeGrid',
    items: () => [],
  }
)

const tree = shallowRef({treestore: new TreeStore<ITreeNode>(props.items ?? [])})
const searchQuery = ref('')
const showModal = ref(false)
const deleteConfirmId = ref<TId | null>(null)


const isSearchActive = computed(() => searchQuery.value.trim().length > 0)

const rowData = computed(() => {
  const allItems = tree.value.treestore.getAll()
  if (!searchQuery.value.trim()) {
    return allItems
  }
  const query = searchQuery.value.toLowerCase().trim()
  const filteredIds = allItems.filter((item) => item.label.toLowerCase().includes(query))
  return filteredIds
})
// наименование первого столбца нумератора
const rowNumbersConfig = ref({
  width: 80,
  headerComponentParams: {
    displayName: '№ п/п',
  },
})
// список колонок
const columnDefs = ref([
  {
    headerName: 'ID',
    field: 'id',
    width: 120,
    cellRenderer: (params: { value: TId }) => String(params.value),
  },
  {
    headerName: 'Наименование',
    field: 'label',
    flex: 2,
  },
  {
    headerName: '',
    field: 'id',
    width: 80,
    cellRenderer: (params: { value: TId; data: ITreeNode }) => {
      return `<button class="btn btn-sm btn-danger" onclick="window.handleGridDelete('${params.value}')">
        <i class="bi bi-trash"></i>
      </button>`
    },
  },
])

// Глобальная функция для вызова из cellRenderer
;(window as any).handleGridDelete = (id: TId) => {
  handleDelete(id)
}
// конфиги
const defaultColDef = ref({
  sortable: true,
  resizable: true,
})
// поле группировки
const autoGroupColumnDef = ref<AutoGroupColumnDef>({
  headerName: 'Категория',
  minWidth: 280,
  cellRendererParams: {
    suppressCount: true,
  },
  valueGetter: (params) => {
    if (!params.data) {
      return ''
    }
    const itemId = params.data.id
    // Проверяем, есть ли элементы с parent === itemId (т.е. есть ли дети)
    const hasChildren = tree.value.treestore.getAll().some((item) => item.parent === itemId)
    return hasChildren ? 'Группа' : 'Элемент'
  },
})

function getDataPath(data: ITreeNode): string[] {
  // Строим путь от корня до текущего элемента
  const path: TId[] = []
  let current: ITreeNode | undefined = data
  // Собираем путь вверх по иерархии
  while (current) {
    path.unshift(current.id)
    // Находим родителя текущего элемента
    if (current.parent !== null) {
      current = tree.value.treestore.items.find((item) => item.id === current!.parent)
    } else {
      current = undefined
    }
  }
  return path.map(String)
}

function handleDelete(id: TId) {
  deleteConfirmId.value = id
}

function confirmDelete() {
  if (deleteConfirmId.value !== null) {
    tree.value.treestore.removeItem(deleteConfirmId.value)
    triggerRef(tree)
    deleteConfirmId.value = null
  }
}

function cancelDelete() {
  deleteConfirmId.value = null
}

function handleCloseModal() {
  triggerRef(tree)
  showModal.value = false
}
</script>
<template>
  <div class="about">
    <div class="grid-container">
      <!-- Панель поиска и добавления -->
      <div class="row mb-3">
        <div class="col-12 col-md-6">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Поиск по наименованию..."
            />
            <button
              v-if="searchQuery"
              class="btn btn-outline-secondary"
              type="button"
              @click="searchQuery = ''"
            >
              <i class="bi bi-x-lg"></i>
            </button>
            <button
              class="btn btn-success"
              type="button"
              @click="showModal = true"
              title="Добавить узел"
            >
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Модальное окно -->
      <div
        v-if="showModal"
        class="modal fade"
        :class="{ show: showModal }"
        style="display: block; background-color: rgba(0, 0, 0, 0.5)"
        @keyup.escape="handleCloseModal"
        @click.self="handleCloseModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-plus-circle me-2"></i>Добавить узел
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="handleCloseModal"
              ></button>
            </div>
            <div class="modal-body">
              <TreeNodeForm :tree-store="tree.treestore" @added="handleCloseModal" />
            </div>
          </div>
        </div>
      </div>

      <!-- Модальное окно удаления -->
      <div
        v-if="deleteConfirmId !== null"
        class="modal fade"
        :class="{ show: deleteConfirmId !== null }"
        style="display: block; background-color: rgba(0, 0, 0, 0.5)"
        @keyup.escape="cancelDelete"
        @click.self="cancelDelete"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title">
                <i class="bi bi-exclamation-triangle me-2"></i>Подтверждение удаления
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                @click="cancelDelete"
              ></button>
            </div>
            <div class="modal-body">
              <p class="mb-0">
                Вы действительно хотите удалить этот узел и все его дочерние элементы?
              </p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="cancelDelete"
              >
                Отмена
              </button>
              <button
                type="button"
                class="btn btn-danger"
                @click="confirmDelete"
              >
                <i class="bi bi-trash me-1"></i>Удалить
              </button>
            </div>
          </div>
        </div>
      </div>

      <ag-grid-vue
        style="width: 100%; height: 700px"
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :treeData="true"
        :rowNumbers="rowNumbersConfig"
        :getDataPath="!isSearchActive ? getDataPath : undefined"
        :autoGroupColumnDef="autoGroupColumnDef"
        :animateRows="true"
        :defaultColDef="defaultColDef"
      />
    </div>
  </div>
</template>

<style>
.grid-container {
  padding: 20px;
  width: inherit;
}
@media (min-width: 1024px) {
  .about {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
