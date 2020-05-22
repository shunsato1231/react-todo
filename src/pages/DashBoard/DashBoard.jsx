import React, {Component, Fragment} from 'react'
import css from 'styled-jsx/css'
import Storage from '../../storage/Storage'

import StatusRadioButton from '../../components/StatusRadioButton/StatusRadioButton'
import TaskList from '../../components/TaskList/TaskList'
import AddTaskForm from '../../components/AddTaskForm/AddTaskForm'

class DashBoard extends Component {
  constructor(props) {
    super(props)
    this.changeStatus = this.changeStatus.bind(this)
    this.getTask = this.getTask.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
    this.addTask = this.addTask.bind(this)
    this.resetTasks = this.resetTasks.bind(this)
    this.validateInputText = this.validateInputText.bind(this)

    this.state = {
      tasks: [],
      allTasks: [],
      statusName: 'all',
      statusList: [
        {name: 'all', status: true},
        {name: 'new', status: false},
        {name: 'wip', status: false},
        {name: 'done', status: false},
        {name: 'pending', status: false}
      ],
      addTaskDisabled: true
    }
  }


  async componentDidMount() {
    await this.getTask()
  }

  async getTask() {
    const tasks = await Storage.get()
    this.setState({
      tasks: tasks,
      allTasks: tasks
    })
  }

  deleteTask (id) {
    Storage
      .delete(id)
      .then(() => {
        const index = this.state.allTasks.findIndex((v) => v.id === id)
        const allTasks_copy = this.state.allTasks

        allTasks_copy.splice(index, 1)

        this.setState({
          allTasks: allTasks_copy
        })
      })
  }

  addTask(comment) {
    if(!comment) return

    Storage
      .post({
        status: 'new',
        comment
      })
      .then(id => {
        const allTasks_copy = this.state.allTasks

        allTasks_copy.push({
          id,
          comment,
          status: 'new'
        })

      this.setState({
        allTasks: allTasks_copy
      })

      this.changeStatus('all')
    })
  }

  changeStatus(name) {
    const prevSelectedIndex = this.state.statusList.findIndex(item => {return item.name === this.state.statusName})
    const nextSelectIndex = this.state.statusList.findIndex(item => {return item.name === name} )

    const statusList_copy = this.state.statusList.slice()
    statusList_copy[prevSelectedIndex].status = false
    statusList_copy[nextSelectIndex].status = true

    this.setState({
      tasks: this.filterTask(name),
      statusList: statusList_copy,
      statusName: name
    })
  }

  filterTask(status) {
    if(status === 'all') {
      return this.state.allTasks
    } else {
      return this.state.allTasks.filter(task => { return task.status === status })
    }
  }

  async resetTasks() {
    await Storage.dispose()
    await Storage.open()
    await this.getTask()
  }

  validateInputText(text) {
    if(!text) {
      this.setState({
        addTaskDisabled: true
      }) 
    } else {
      this.setState({
        addTaskDisabled: false
      })
    }
  }

  render() {
    const resetButtonVisible = this.state.allTasks.length === 0 ? 'hidden' : ''
    return (
      <Fragment>
        <div className="filter">
          <StatusRadioButton 
            list={this.state.statusList}
            change={this.changeStatus}
            taskNumber={this.state.tasks.length}/>
        </div>
        <div className="list">
          <TaskList tasks={this.state.tasks} delete={this.deleteTask} />
          <p
            className = {resetButtonVisible + ' resetButton'}
            onClick = {this.resetTasks}
          >
            reset tasks
            <i className="fas fa-redo"></i>
          </p>
        </div>
        <div className="add">
          <AddTaskForm
            add={this.addTask}
            change={this.validateInputText}
            disabled={this.state.addTaskDisabled}
            />
        </div>
        <style jsx>{styles}</style>
      </Fragment>
    )
  }
}

const styles = css`
.filter
  margin 56px 0 24px 0
.add
  margin-top 24px
.resetButton
  font-size 12px
  margin-top 5px
  color #999
  i
    margin-left 3px
    color #bbb
  &.hidden
    display none
  &:hover
    cursor pointer
`

export default DashBoard