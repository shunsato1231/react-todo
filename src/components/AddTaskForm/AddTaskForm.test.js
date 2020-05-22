import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AddTaskForm from './AddTaskForm'
Enzyme.configure({ adapter: new Adapter() })

/**
 *
 *
 * @returns
 */
function setup() {
  const props = {
    add: jest.fn(),
    change: jest.fn()
  }

  const enzymeWrapper = mount(<AddTaskForm {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

const sel = id => `[data-testid="${id}"]`

describe('Components',() => {
  describe('AddTaskForm',() => {
    test('propsの内容が適切に反映されていること', () => {
      const { enzymeWrapper, props } = setup()

      /** disabled の場合 
       * 追加ボタン非活性
       */
      // input空の時 propsの disabled = true
      enzymeWrapper.setProps({
        ...props,
        disabled: true
      })
      // buttonにdisabledクラスが追加されていること
      expect(enzymeWrapper.find('button').hasClass('disabled')).toEqual(true)

      /**  not disabled の場合
       * 追加ボタン活性
       */
      enzymeWrapper.setProps({
        ...props,
        disabled: false
      })
      // buttonにdisabledクラスが存在しないこと
      expect(enzymeWrapper.find('button').hasClass('disabled')).toEqual(false)
    })

    test('addボタン押下時にprops.addが正しく呼ばれること', () => {
      const { enzymeWrapper, props } = setup()

      // 入力時はaddが呼ばれること
      enzymeWrapper.find('input').instance().value = 'test'
      enzymeWrapper.find('input').simulate('change')
      enzymeWrapper.find('button').simulate('click')
      expect(props.add).toHaveBeenCalledWith('test')
      props.add.mockClear()

      // 未入力時はaddが呼ばれないこと
      enzymeWrapper.find('input').instance().value = ''
      enzymeWrapper.find('input').simulate('change')
      enzymeWrapper.find('button').simulate('click')
      expect(props.add).not.toHaveBeenCalled()
    })

    test('テキスト変更時にpropsのchangeメソッドが正しく呼ばれること', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('input').instance().value = 'test'
      enzymeWrapper.find('input').simulate('change')
      expect(props.change).toHaveBeenCalledWith('test')
    })

    test('enterKey押下でinstance.addが呼ばれること', () => {
      const { enzymeWrapper, props } = setup()

      // enter keyの時はaddが呼ばれること
      enzymeWrapper.find('input').instance().value = 'test'
      enzymeWrapper.find('input').simulate('change')
      enzymeWrapper.find('input').simulate('keyDown', {keyCode: 13})
      expect(props.add).toHaveBeenCalled()
      props.add.mockClear()

      // 他のkeyの時はaddが呼ばれないこと
      enzymeWrapper.find('input').instance().value = 'test'
      enzymeWrapper.find('input').simulate('change')
      enzymeWrapper.find('input').simulate('keyDown', {keyCode: 12})
      expect(props.add).not.toHaveBeenCalled()
    })
  })
})