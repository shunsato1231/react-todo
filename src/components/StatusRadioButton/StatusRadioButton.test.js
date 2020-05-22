import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import StatusRadioButton from './StatusRadioButton'
Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    list: [
      {name: 'all', status: true},
      {name: 'new', status: false},
      {name: 'wip', status: false},
      {name: 'done', status: false},
      {name: 'pending', status: false}
    ],
    change: jest.fn(),
    taskNumber: 10
  }

  const enzymeWrapper = shallow(<StatusRadioButton {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

const sel = id => `[data-testid="${id}"]`

describe('Components',() => {
  describe('StatusRadioButton',() => {
    test('propsの内容が適切に表示されていること', () => {
      const { enzymeWrapper, props } = setup()

      // checkboxがステータスの数だけ生成されている
      expect(enzymeWrapper.find('label').length).toBe(props.list.length)

      // status:true のステータスが選択済みになっている
      let checkedIndex = props.list.findIndex((item) => item.status === true)
      let checkedBox = enzymeWrapper.find(sel(props.list[checkedIndex].name))
      expect(checkedBox.props().checked).toEqual(true)

      // タスクの数が正しく表示されている
      expect(enzymeWrapper.find(sel('task-number')).text()).toBe('(show ' + props.taskNumber + ' tasks)')
    })

    test('チェックボックスの変更でprops.changeが呼ばれること', () => {
      const { enzymeWrapper, props } = setup()
  
      // index = 2 の要素にチェックを入れる
      const changeIndex = 2
      enzymeWrapper.find('input').at(changeIndex).simulate('change', {target:{checked:true}})
      // チェックされたステータス名を引数にprops関数が呼び出されている
      expect(props.change).toHaveBeenCalledWith(props.list[changeIndex].name)
    })
  });
});