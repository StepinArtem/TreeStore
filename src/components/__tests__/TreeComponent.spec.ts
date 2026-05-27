import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TreeComponent from '@/components/TreeComponent.vue'
import { getTimesOfDay } from '@/common/utils'
import { items } from '@/common/items'

const tod = getTimesOfDay()
describe('TreeComponent', () => {
  // для тестирования на болльши данных добавить соотвествующий mock
  const wrapper = mount(TreeComponent, { props: { msg: tod, items: items } })
  it('renders properly', () => {
    expect(wrapper.text()).toContain(tod)
  })

  it('getAll', () => {
    const result = wrapper.vm.getAll()
    const len1 = items.length
    expect(result).toHaveLength(len1)
  })

  it('getItem', () => {
    const result = wrapper.vm.getItem(8)
    expect(result.id).toBe(8)
  })

  it('getChildren', () => {
    const result = wrapper.vm.getChildren(1)
    expect(result).toHaveLength(2)
  })

  it('getAllChildren', () => {
    const result = wrapper.vm.getAllChildren(4)
    expect(result).toHaveLength(2)
  })

  it('getAllParents', () => {
    const result = wrapper.vm.getAllParents(4)
    expect(result).toHaveLength(3)
  })

  it('addItem', () => {
    wrapper.vm.addItem({ id: 9, parent: 8, label: 'Айтем 9' })
    const result = wrapper.vm.getItem(9)
    expect(result.id).toBe(9)
  })

  it('updateItem', () => {
    wrapper.vm.updateItem({ id: 9, parent: 8, label: 'TEST' })
    const result = wrapper.vm.getItem(9)
    expect(result.label).toBe('TEST')
  })

  it('removeItem', () => {
    wrapper.vm.removeItem(9)
    const result = wrapper.vm.getItem(9)
    expect(result).toBeUndefined()
  })

  it('createChildren', () => {
    wrapper.vm.createChildren()
  })
})
