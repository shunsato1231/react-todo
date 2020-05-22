import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TaskList from './TaskList'
Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    tasks: [
      {id: 1, comment: 'task1', status: 'new'},
      {id: 2, comment: 'task2', status: 'wip'},
      {id: 3, comment: 'task3', status: 'done'},
      {id: 4, comment: 'task4', status: 'pending'}
    ],
    delete: jest.fn(),
  }

  const enzymeWrapper = shallow(<TaskList {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('Components',() => {
  describe('TaskList',() => {
    test('propsの内容が適切に表示されていること', () => {
      const { enzymeWrapper, props } = setup()

      // リストがタスクの数だけ生成されている
      expect(enzymeWrapper.find('li').length).toBe(props.tasks.length)

      // リストの文言がただしく表示されていること
      for(let index=0; index > props.tasks.length; index++) {
        let listItem = enzymeWrapper.find('li').at(index)
        // id
        expect(listItem.find('.id').text()).toBe(props.tasks[index].id)
        // comment
        expect(listItem.find('.comment').text()).toBe(props.tasks[index].comment)
        // status
        expect(listItem.find('.status').text()).toBe(props.tasks[index].status)
      }

    })

    test('ゴミ箱ボタン押下でprops関数が動作すること', () => {
      const { enzymeWrapper, props } = setup()
  
      // 2番目に見つかった要素を削除
      const deleteTask = enzymeWrapper.find('li').at(2)
      deleteTask.find('button').simulate('click')
      // taskのidを引数にprops関数が呼び出されている
      expect(props.delete).toHaveBeenCalledWith(Number(deleteTask.find('.id').text()))
    })
  });
});