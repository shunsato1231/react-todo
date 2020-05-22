import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TaskDetail from './TaskDetail';
import EditForm from '../../components/EditForm/EditForm'

import Storage from '../../storage/Storage'

Enzyme.configure({ adapter: new Adapter() });

describe('Pages',() => {
  describe('TaskDetail',() => {
    let taskDetail
    // ダミーデータ
    const dummyData = {
      status: 'new',
      comment: 'test1'
    }
    // 遷移発生時に起こるmock関数
    const historyMock = { push: jest.fn() }

    beforeEach(async() => {
      // dbに初期値登録
      const id  = await Storage.post(dummyData)
      dummyData.id = id

      // idを指定してshallow
      taskDetail = shallow(<TaskDetail
        match={{params: {id: dummyData.id}}}
        history={historyMock}
      />)
      await taskDetail.instance().componentDidMount()
    })

    afterEach(async () => {
      await Storage.dispose()
      await Storage.open()
      historyMock.push.mockClear()
    })

    test('子コンポーネントが存在すること', () => {
      expect(taskDetail.find(EditForm).length).toBe(1);
    })

    test('読み込み後、タスクを取得できていること', () => {
      const task = taskDetail.state().task
      expect(task).toEqual(dummyData)
    })

    describe('バリデーションが正しく実行されること', () => {
      test('変更がない場合 --> disabledになること', () => {
        taskDetail.instance().validate()
        expect(taskDetail.state().disabled).toEqual(true)
      })

      test('コメントが空欄の場合 --> disabledになること', () => {
        taskDetail.instance().changeComment()
        expect(taskDetail.state().disabled).toEqual(true)
      })

      test('ステータスに変更がある場合 --> enabledになること', () => {
        taskDetail.instance().changeStatus(dummyData.status + 'test')
        expect(taskDetail.state().disabled).toEqual(false)
      })

      test('コメントに変更がある場合 --> enabledになること', () => {
        taskDetail.instance().changeComment(dummyData.comment + 'test')
        expect(taskDetail.state().disabled).toEqual(false)
      })

      test('ステータス、コメント共に変更 --> enableになること', () => {
        taskDetail.instance().changeStatus(dummyData.status + 'test')
        taskDetail.instance().changeComment(dummyData.comment + 'test')

        expect(taskDetail.state().disabled).toEqual(false)
      })
    })

    test('taskの削除が正しくできること', async () => {
      // タスク削除
      await taskDetail.instance().deleteTask()

      // ホームへの遷移関数が呼ばれていること
      expect(historyMock.push).toHaveBeenCalledWith('/')
      // ストアに対象のタスクが存在しないこと
      const deletedTask = await Storage.get(dummyData.id)
      expect(deletedTask).toEqual(undefined)
    })

    test('taskの更新が正しくできること', async () => {
      // タスク変更
      const updateTaskData = {
        id: dummyData.id,
        status: dummyData.status + 'test',
        comment: dummyData.comment + 'test',
      }
      taskDetail.setState({task: updateTaskData})
      await taskDetail.instance().updateTask()

      // ホームへの遷移関数が呼ばれていること
      expect(historyMock.push).toHaveBeenCalledWith('/')
      // ストアのタスクが更新されていること
      const storeTaskData = await Storage.get(updateTaskData.id)
      expect(storeTaskData).toEqual(updateTaskData)
    })

    test('バリデーションに成功しなかった場合taskの更新ができないこと', async () => {
      // タスクの変更なしでdisabledになること
      taskDetail.instance().validate()
      expect(taskDetail.state().disabled).toEqual(true)

      const updateFunc = await taskDetail.instance().updateTask()
      // expect(updateFunc).toBe('return')
      // ホームへの遷移関数が呼ばれていないこと
      expect(historyMock.push).not.toHaveBeenCalled()
    })

    test('backボタン押下時にホームに遷移すること', () => {
      taskDetail.find('a').simulate('click')
      // ホームへの遷移関数が呼ばれていること
      expect(historyMock.push).toHaveBeenCalledWith('/')
    })
  })
})