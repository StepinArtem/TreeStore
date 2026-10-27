import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TreeComponent from '@/components/TreeComponent.vue'
import { getTimesOfDay } from '@/common/utils'
import { items } from '@/common/items'
import type { ITreeNode } from '@/components/model/TreeStore'

const tod = getTimesOfDay()

function createItems(): ITreeNode[] {
  return JSON.parse(JSON.stringify(items))
}

describe('TreeComponent', () => {
  let wrapper: any

  beforeEach(() => {
    const testItems = createItems()
    wrapper = mount(TreeComponent, { props: { msg: tod, items: testItems } })
  })

  it('renders properly', () => {
    expect(wrapper.text()).toContain(tod)
  })

  it('getAll', () => {
    const result = wrapper.vm.getAll()
    expect(result).toHaveLength(items.length)
  })

  it('getItem', () => {
    const result = wrapper.vm.getItem(8)
    expect(result?.id).toBe(8)
  })

  it('getChildren', () => {
    const result = wrapper.vm.getChildren(1)
    expect(result).toHaveLength(2)
  })

  it('getAllChildren', () => {
    const result = wrapper.vm.getAllChildren(4)
    expect(result).toHaveLength(4)
  })

  it('getAllParents', () => {
    const result = wrapper.vm.getAllParents(4)
    expect(result).toHaveLength(3)
  })

  it('addItem', () => {
    wrapper.vm.addItem({ id: 9, parent: 8, label: 'Айтем 9' })
    const result = wrapper.vm.getItem(9)
    expect(result?.id).toBe(9)
  })

  it('updateItem', () => {
    wrapper.vm.addItem({ id: 9, parent: 8, label: 'Айтем 9' })
    wrapper.vm.updateItem({ id: 9, parent: 8, label: 'TEST' })
    const result = wrapper.vm.getItem(9)
    expect(result?.label).toBe('TEST')
  })

  it('removeItem', () => {
    wrapper.vm.addItem({ id: 9, parent: 8, label: 'Айтем 9' })
    wrapper.vm.removeItem(9)
    const result = wrapper.vm.getItem(9)
    expect(result).toBeUndefined()
  })
})
