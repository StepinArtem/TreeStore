<script setup lang="ts">
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { AllCommunityModule, ModuleRegistry, type AutoGroupColumnDef } from 'ag-grid-community'
import { TreeDataModule } from 'ag-grid-enterprise'
import { TreeStore, iTreeStore } from '@/components/model/TreeStore'
import { RowNumbersModule } from 'ag-grid-enterprise'

// Register all core community grid packages
ModuleRegistry.registerModules([AllCommunityModule, TreeDataModule, RowNumbersModule])

const props = defineProps<{
  msg: string
  items: {
    type: Array<iTreeStore>
    default(): []
  }
}>()

const tree = new TreeStore(props.items)
const rowData = ref(tree.getAll())
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
    const itemId = params.data.id
    // Проверяем, есть ли элементы с parent === itemId (т.е. есть ли дети)
    const hasChildren = tree.getAll().some((item) => item.parent === itemId)
    return hasChildren ? 'Группа' : 'Элемент'
  },
})

function getDataPath(data: iTreeStore) {
  // Строим путь от корня до текущего элемента
  const path = []
  let current = data
  // Собираем путь вверх по иерархии
  while (current) {
    path.unshift(current.id)
    // Находим родителя текущего элемента
    current = tree.items.find((item) => item.id === current.parent)
  }
  return path
}
</script>
<template>
  <div class="about">
    <div class="grid-container">
      <ag-grid-vue
        style="width: 100%; height: 700px"
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :treeData="true"
        :rowNumbers="rowNumbersConfig"
        :getDataPath="getDataPath"
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
