<script setup lang="ts">
import { ref, computed } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
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

const tree = computed(() => new TreeStore<ITreeNode>(props.items ?? []))
const searchQuery = ref('')

const isSearchActive = computed(() => searchQuery.value.trim().length > 0)

const rowData = computed(() => {
  const allItems = tree.value.getAll()
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
])
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
    const hasChildren = tree.value.getAll().some((item) => item.parent === itemId)
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
      current = tree.value.items.find((item) => item.id === current!.parent)
    } else {
      current = undefined
    }
  }
  return path.map(String)
}
</script>
<template>
  <div class="about">
    <div class="grid-container">
      <!-- Поиск -->
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
          </div>
        </div>
      </div>

      <!-- Форма добавления -->
      <div class="row mb-3">
        <div class="col-12 col-md-6">
          <TreeNodeForm :tree-store="tree" @added="(item) => console.log('Added:', item)" />
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
