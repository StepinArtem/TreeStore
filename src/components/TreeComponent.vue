<script setup lang="ts">
import { computed } from 'vue'
import { TreeStore, type ITreeNode, type TId } from '@/components/model/TreeStore'

const props = defineProps<{
  msg: string
  items: ITreeNode[]
}>()

const tree = computed(() =>new TreeStore<ITreeNode>(props.items))

// function createChildren() {
//   tree.value.createChildren()
// }

function getAll() {
  return tree.value.getAll()
}

function getItem(id: TId): ITreeNode | undefined {
  return tree.value.getItem(id)
}

function getChildren(id: TId): ITreeNode[] {
  return tree.value.getChildren(id)
}

function getAllChildren(id: TId) {
  return tree.value.getAllChildren(id)
}

function getAllParents(id: TId) {
  return tree.value.getAllParents(id)
}

function addItem(item: ITreeNode) {
  tree.value.addItem(item)
}

function updateItem(item: ITreeNode) {
  tree.value.updateItem(item)
}

function removeItem(id: TId) {
  tree.value.removeItem(id)
}
</script>
<template>
  <div class="about">
    <div class="grid-container">
      <div>
        <h1>{{ msg }}</h1>
      </div>
      <div>
        <p>
          Для реализации класса и всех основых проходов, я использовал <code>Map</code> - коллекция
          ключ/значение.
        </p>
        <p>
          Для наиболее быстрого выполения метода <code>getAllChildren</code>, я использовал заранее
          созданную коллекцию <code>childrenMap</code> - карту потомков.
        </p>
        <p>
          После вызова <code>addItem({...})</code><code>updateItem({...})</code>
          <code>removeItem(id)</code> какрту потомков надо обновлять отдельным методом
          <code>createChildren()</code>
        </p>
      </div>
      <div class="wrapperComponent">
        <span class="separator"></span><span class="separator"></span>
        <div>Изначальный массив элемент - <code>getAll()</code></div>
        <div>
          {{ getAll() }}
        </div>
        <span class="separator"></span><span class="separator"></span>
        <div>Объект элемента - <code>getItem(id)</code></div>
        <div>
          <code>{{ getItem(8) }}</code>
        </div>
        <span class="separator"></span><span class="separator"></span>
        <div>Массив дочерних элементов - <code>getChildren(id)</code></div>
        <div>
          <code>{{ getChildren(1) }}</code>
        </div>
        <span class="separator"></span><span class="separator"></span>
        <div>Массив всех дочерних элементов - <code>getAllChildren(id)</code></div>
        <div>
          <code>{{ getAllChildren(4) }}</code>
        </div>
        <span class="separator"></span><span class="separator"></span>
        <div>Массив всех потомков элементов - <code>getAllParents(id)</code></div>
        <div>
          <code>{{ getAllParents(4) }}</code>
        </div>
        <span class="separator"></span><span class="separator"></span>
        <div>Добавляет элемент - <code>addItem({...})</code></div>
        <div>
          <code>
            {{ addItem({ id: 9, parent: 8, label: 'Айтем 9' }) }}
            {{ getItem(9) }}
          </code>
        </div>
        <span class="separator"></span><span class="separator"></span>
        <div>Обновляет элемент - <code>updateItem({...})</code></div>
        <div>
          <code>
            {{ updateItem({ id: 9, parent: 8, label: 'TEST' }) }}
            {{ getItem(9) }}
          </code>
        </div>
        <span class="separator"></span><span class="separator"></span>
        <div>Удаляет элемент - <code>removeItem(id = 9)</code></div>
        <div>
          <code>
            {{ removeItem(9) }}
            {{ `${getItem(9)} - item не найден` }}
          </code>
        </div>
        <span class="separator"></span><span class="separator"></span>
      </div>
    </div>
  </div>
</template>

<style>
.grid-container {
  padding: 20px;
  width: inherit;
}
.wrapperComponent {
  display: grid;
  grid-template-columns: 2fr 4fr;
}
code {
  background-color: #eee;
  border-radius: 3px;
  font-family: courier, monospace;
  padding: 0 3px;
}
.separator {
  display: block;
  width: 100%; /* Ширина линии (в процентах или пикселях) */
  height: 1px; /* Толщина линии */
  background-color: #ccc; /* Цвет линии */
  margin: 20px 0; /* Отступы сверху и снизу */
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
