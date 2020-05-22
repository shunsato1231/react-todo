import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import EditForm from './EditForm'
Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    update: jest.fn(),
    delete: jest.fn(),
    task: {
      id: 1,
      comment: 'test1',
      status: 'new'
    },
    statusList: ['new', 'wip', 'done', 'pending'],
    changeStatus: jest.fn(),
    changeComment: jest.fn(),
  }

  const enzymeWrapper = mount(<EditForm {...props} />)

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

      // checkboxがステータスの数だけ生成されていること
      expect(enzymeWrapper.find(sel('statusItem')).length).toBe(props.statusList.length)

      // 現在のステータスが反映されていること
      const selectedCheckboxText = enzymeWrapper.find(sel('statusItem')).find('.checked').find('input')
      expect(selectedCheckboxText.props().checked).toEqual(true)

      // taskのcommentが正しく反映されていること
      const commentTextBox = enzymeWrapper.find(sel('task-comment'))
      expect(commentTextBox.props().value).toEqual(props.task.comment)

      // disabledが反映されていること
      enzymeWrapper.setProps({
        ...props,
        disabled: true
      })
      expect(enzymeWrapper.find(sel('updateButton')).hasClass('disabled')).toEqual(true)

      enzymeWrapper.setProps({
        ...props,
        disabled: false
      })
      expect(enzymeWrapper.find(sel('updateButton')).hasClass('disabled')).toEqual(false)
    })

    test('ラジオボタンの変更でprops.changeStatusが呼ばれること', () => {
      const { enzymeWrapper, props } = setup()
  
      // index = 2 の要素にチェックを入れる
      const changeIndex = 2
      const changeCheckbox = enzymeWrapper.find('input').at(changeIndex)
      changeCheckbox.instance().checked = true
      changeCheckbox.simulate('change')
      // チェックされたステータス名を引数にprops関数が呼び出されている
      expect(props.changeStatus).toHaveBeenCalledWith(props.statusList[changeIndex])
    })

    test('コメントの変更でprops.changeCommentが呼ばれること', () => {
      const { enzymeWrapper, props } = setup()
      const commentTextBox = enzymeWrapper.find(sel('task-comment'))
      const changeComment = 'hogehoge'

      commentTextBox.instance().value = changeComment
      commentTextBox.simulate('change')
      expect(props.changeComment).toHaveBeenCalledWith(changeComment)
    })

    test('deleteボタン押下でprops.deleteが呼ばれること', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find(sel('deleteButton')).simulate('click')
      expect(props.delete).toHaveBeenCalled()
    })

    test('updateボタン押下でprops.updateが呼ばれること', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find(sel('updateButton')).simulate('click')
      expect(props.update).toHaveBeenCalled()
    })
  });
});