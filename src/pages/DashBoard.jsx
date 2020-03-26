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
    this.updateTask = this.updateTask.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
    this.addTask = this.addTask.bind(this)

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
      ]
    }
  }


  async componentDidMount() {
    const tasks = (await axios.get('http://localhost:8081/')).data
    this.setState({
      tasks: tasks,
      allTasks: tasks
    })
  }

  async updateTask() {
    const tasks = (await axios.get('http://localhost:8081/')).data
    this.setState({
      tasks: tasks,
      allTasks: tasks
    })
  }

  async deleteTask (id) {
    await axios.delete('http://localhost:8081/' + id)
    this.updateTask()
  }

  async addTask(comment) {
    if(!comment) return

    await axios.post('http://localhost:8081/', {
      status: 'new',
      comment: comment
    })

    this.updateTask()
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

  render() {
    return (
      <Fragment>
        <div className="sort">
          <StatusRadioButton list={this.state.statusList} change={this.changeStatus} taskNumber={this.state.tasks.length}/>
        </div>
        <div className="list">
          <TaskList tasks={this.state.tasks} delete={this.deleteTask} />
        </div>
        <div className="add">
          <AddTaskForm add={this.addTask} />
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