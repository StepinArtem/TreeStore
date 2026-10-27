export type TId<T = string | number> = T//TId = number | string

export interface ITreeNode {
  id: TId
  parent: TId | null
  label: string
}

export class TreeStore<T extends ITreeNode> {
  items: T[]
  childrenMap: Map<T['id'], T[]>
  itemMap: Map<T['id'], T>

  constructor(items: T[]) {
    this.items = items
    this.childrenMap = new Map()
    this.itemMap = new Map(items.map((item) => [item.id, item]))
    this.createChildren()
  }

  getAll(): T[] {
    return [...this.itemMap.values()]
  }

  getItem(id: T['id']): T | undefined {
    return this.itemMap.get(id)
  }

  getChildren(id: T['id']): T[] {
    return this.getAll().filter((item) => item.parent === id)
  }

  /**
   * инициализируем карту потомков
   */
  createChildren() {
    this.childrenMap = new Map()
    for (const item of this.getAll()) {
      const parentId = item.parent
      if (parentId !== null) {
        if (!this.childrenMap.has(parentId)) {
          this.childrenMap.set(parentId, [])
        }
        this.childrenMap.get(parentId)!.push(item)
      }
    }
  }

  getAllChildren(id: T['id']): T[] {
    const result: T[] = []
    const stack: T['id'][] = [id] // Используем стек вместо рекурсии

    while (stack.length > 0) {
      const currentId = stack.pop()!
      const children = this.childrenMap.get(currentId) || []

      result.push(...children)
      // Добавляем ID всех детей в стек для дальнейшей обработки
      children.forEach((child) => stack.push(child.id))
    }

    return result
  }

  getAllParents(id: T['id']): T[] {
    const result: T[] = []
    let currentItem: T | undefined = this.itemMap.get(id)

    if (!currentItem) {
      return result
    }
    result.push(currentItem)

    while (currentItem.parent !== null) {
      currentItem = this.itemMap.get(currentItem.parent)
      if (!currentItem) {
        break
      }
      result.push(currentItem)
    }

    return result
  }

  addItem(item: T) {
    this.items.push(item)
    this.itemMap.set(item.id, item)

    const parentId = item.parent
    if (parentId !== null) {
      if (!this.childrenMap.has(parentId)) {
        this.childrenMap.set(parentId, [])
      }
      this.childrenMap.get(parentId)!.push(item)
    }
  }

  removeItem(id: T['id']) {
    const toRemove = new Set<T['id']>()
    const stack: T['id'][] = [id] // Используем стек для итеративного обхода

    // Собираем все ID для удаления
    while (stack.length > 0) {
      const currentId = stack.pop()!
      toRemove.add(currentId)

      // Получаем детей через индекс (O(1) вместо O(n))
      const children = this.childrenMap.get(currentId) || []
      children.forEach((child) => stack.push(child.id))
    }

    // Удаляем из itemMap
    for (const id of toRemove) {
      this.itemMap.delete(id)
    }

    // Удаляем из childrenMap
    for (const id of toRemove) {
      this.childrenMap.delete(id)
    }

    // Удаляем из items
    this.items = this.items.filter((item) => !toRemove.has(item.id))
  }

  updateItem(elem: T) {
    const { id, parent } = elem

    if (id === undefined) {
      throw new Error('Поле "id" обязательно для обновления элемента')
    }

    const existingItem = this.itemMap.get(id)
    if (!existingItem) {
      throw new Error(`Элемент с ID ${id} не найден в хранилище`)
    }

    this.itemMap.set(id, {
      ...existingItem,
      ...elem,
    })

    // Обновляем items массив
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items[index] = this.itemMap.get(id)!
    }

    // Перестраиваем childrenMap если изменился parent
    if (parent !== undefined && parent !== existingItem.parent) {
      this.createChildren()
    }
  }
}
