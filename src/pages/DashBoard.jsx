import React, {Component, Fragment} from 'react'
import css from 'styled-jsx/css'
import axios from 'axios'

import SortCheckbox from '../components/SortCheckbox'
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
      status: 'all',
      statusList: [
        {name: 'all', status: true},
        {name: 'new', status: false},
        {name: 'wip', status: false},
        {name: 'done', status: false},
        {name: 'pending', status: false}
      ],
      sortedStatusIndex: 0
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

    this.sortTask(this.state.statusList[this.state.sortedStatusIndex].name)
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

  changeStatus(index) {
    const statusList_copy = this.state.statusList.slice()
    statusList_copy[index].status = true
    statusList_copy[parseInt(this.state.sortedStatusIndex)].status = false

    this.setState({
      tasks: this.sortTask(this.state.statusList[index].name),
      statusList: statusList_copy,
      sortedStatusIndex: index
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
          <SortCheckbox list={this.state.statusList} change={this.changeStatus} taskNumber={this.state.tasks.length}/>
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