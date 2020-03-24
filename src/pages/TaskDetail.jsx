import React, {Component, Fragment} from 'react'
import css from 'styled-jsx/css'
import axios from 'axios'

import EditForm from '../components/EditForm'

class TaskDetail extends Component {
  constructor(props) {
    super(props)
    this.changeStatus = this.changeStatus.bind(this)
    this.changeComment = this.changeComment.bind(this)
    this.updateTask = this.updateTask.bind(this)
    this.deleteTask = this.deleteTask.bind(this)

    this.state = {
      task: {
        id: this.props.match.params.id,
        comment: '',
        status: ''
      }
    }

    this.getTask()
  }

  async getTask() {
    const task = (await axios.get('http://localhost:8081/' + this.props.match.params.id)).data

    this.setState({
      task: task
    })
  }

  async updateTask() {
    if(!this.state.task.comment) return

    await axios.put('http://localhost:8081/' + this.props.match.params.id, this.state.task)
    this.props.history.push('/')
  }

  async deleteTask() {
    await axios.delete('http://localhost:8081/' + this.props.match.params.id)
    this.props.history.push('/')
  }

  changeStatus(status) {
    const task_copy = this.state.task
    task_copy.status = status
    this.setState({
      task: task_copy
    })
  }

  changeComment(event) {
    const task_copy = this.state.task
    task_copy.comment = event.target.value
    this.setState({
      task: task_copy
    })
  }

  render() {
    return (
      <Fragment>
        <h2>
          Edit Task
          <span>ID:{this.props.match.params.id}</span>
        </h2>
        <div className="editor">
          <EditForm
            update={this.updateTask}
            delete={this.deleteTask}
            task={this.state.task}
            changeStatus={this.changeStatus}
            changeComment={this.changeComment}
          />
        </div>
        <a onClick={()=>this.props.history.push('/')} className="back">
          <i className="fas fa-chevron-left"></i>
          <span>back</span>
        </a>
        <style jsx>{styles}</style>
      </Fragment>
    )
  }
}

const styles = css`
  h2
    font-size 16px
    margin-top 56px
    span
      font-size 14px
      margin-left 10px
      color #aaa
      font-weight normal
  .editor
    margin 56px auto
  a
    cursor pointer
    display flex
    margin 24px 0
    text-decoration none
    align-items center
    i
      font-size 40px
      margin-right 10px
      color #f0f0f0
    span
      font-size 14px
      color #bbb
`

export default TaskDetail