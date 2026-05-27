export interface iTreeStore {
  id: number | string
  parent: number | string | null
  label: string
}

export class TreeStore {
  items: Array<iTreeStore>
  childrenMap: Map<number | string, iTreeStore>
  itemMap: Map<string | number, iTreeStore>
  constructor(items: Array<iTreeStore>) {
    this.items = items
    this.childrenMap = new Map()
    this.itemMap = new Map(this.items.map((item) => [item.id, item]))
    this.createChildren()
  }

  getAll() {
    return [...this.itemMap.values()]
  }

  getItem(id: number | string): iTreeStore | undefined {
    return this.itemMap.get(id)
  }

  getChildren(id: number | string) {
    return this.getAll().filter((item) => item.parent === id)
  }

  /**
   * инициализируем карту потомков
   */
  createChildren() {
    this.childrenMap = new Map()
    for (const item of this.getAll()) {
      const parentId = item.parent
      if (parentId !== null && !this.childrenMap.has(parentId)) {
        this.childrenMap.set(parentId, [])
      }
      this.childrenMap.get(parentId)?.push(item)
    }
  }

  getAllChildren(id: number | string) {
    const result = []
    const stack = [id] // Используем стек вместо рекурсии

    while (stack.length > 0) {
      const currentId = stack.pop()
      const children = this.childrenMap.get(currentId) || []

      result.push(...children)
      // Добавляем ID всех детей в стек для дальнейшей обработки
      children.forEach((child) => stack.push(child.id))
    }

    return result
  }

  getAllParents(id: number | string) {
    const result = []
    let currentItem = this.itemMap.get(id)

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

  addItem(item: iTreeStore) {
    //this.items.push(item)
    this.itemMap.set(item.id, item)
    // const parentId = item.parent
    // if (parentId !== null && !this.childrenMap.has(parentId)) {
    //   this.childrenMap.set(parentId, [])
    // }
    // this.childrenMap.get(parentId)?.push(item)

    // Перестраиваем индекс после удаления
    // this.createChildren()
  }

  removeItem(id: number | string) {
    const toRemove = new Set()
    const stack = [id] // Используем стек для итеративного обхода

    // Собираем все ID для удаления
    while (stack.length > 0) {
      const currentId = stack.pop()
      toRemove.add(currentId)

      // Получаем детей через индекс (O(1) вместо O(n))
      const children = this.childrenMap.get(currentId) || []
      children.forEach((child) => stack.push(child.id))
    }
    const index = this.getAll().findIndex((user) => user.id === id)

    if (index !== -1) {
      this.getAll().splice(index, 1) // Удаляет 1 элемент начиная с найденного индекса
    }
    // удаляем исходный элемент
    this.itemMap.delete(id)
  }

  updateItem(elem: iTreeStore) {
    const { id, parent } = elem

    if (id === undefined) {
      throw new Error('Поле "id" обязательно для обновления элемента')
    }

    const index = this.getAll().findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error(`Элемент с ID ${id} не найден в хранилище`)
    }

    // this.getAll()[index] = {
    //   // Сохраняем обязательные поля, если они не переданы
    //   id: this.getAll()[index].id,
    //   parent: parent !== undefined ? parent : this.getAll()[index].parent,
    //   // Остальные поля перезаписываем или добавляем
    //   ...elem,
    // }

    const existingItem = this.itemMap.get(id)
    this.itemMap.set(id, {
      ...existingItem,
      ...elem,
    })

    // Перестраиваем индекс после удаления
    // this.createChildren()
  }
}
