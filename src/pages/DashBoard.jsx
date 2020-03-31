import React, {Component, Fragment} from 'react'
import css from 'styled-jsx/css'
import axios from 'axios'

import StatusRadioButton from '../components/StatusRadioButton'
import TaskList from '../components/TaskList'
import AddTaskForm from '../components/AddTaskForm'

class DashBoard extends Component {
  constructor(props) {
    super(props)
    this.changeStatus = this.changeStatus.bind(this)
    this.getTask = this.getTask.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
    this.addTask = this.addTask.bind(this)
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
      addTaskDisabled: 'disabled'
    }
  }


  componentDidMount() {
    this.getTask()
  }

  async getTask() {
    const tasks = (await axios.get('http://localhost:8081/')).data
    this.setState({
      tasks: tasks,
      allTasks: tasks
    })
  }

  deleteTask (id) {
    axios
      .delete(`http://localhost:8081/${id}`)
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

    axios
    .post('http://localhost:8081/', {
      status: 'new',
      comment: comment
    })
    .then(() => {
      const getId = () => {
        if (this.state.allTasks.length === 0) return 1
        return this.state.allTasks[this.state.allTasks.length - 1].id + 1
      }
      const allTasks_copy = this.state.allTasks

      allTasks_copy.push({
        id: getId(),
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
      tasks: this.sortTask(name),
      statusList: statusList_copy,
      statusName: name
    })
  }

  sortTask(status) {
    if(status === 'all') {
      return this.state.allTasks
    } else {
      return this.state.allTasks.filter(task => { return task.status === status })
    }
  }

  validateInputText(text) {
    if(!text) {
      this.setState({
        addTaskDisabled: 'disabled'
      }) 
    } else {
      this.setState({
        addTaskDisabled: ''
      })
    }
  }

  render() {
    return (
      <Fragment>
        <div className="sort">
          <StatusRadioButton 
            list={this.state.statusList}
            change={this.changeStatus}
            taskNumber={this.state.tasks.length}/>
        </div>
        <div className="list">
          <TaskList tasks={this.state.tasks} delete={this.deleteTask} />
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
.sort
  margin 56px 0 24px 0
.add
  margin-top 24px
`

export default DashBoard