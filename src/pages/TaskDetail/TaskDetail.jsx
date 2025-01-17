import React, {Component, Fragment} from 'react'
import css from 'styled-jsx/css'
import storage from '../../storage/Storage'

import EditForm from '../../components/EditForm/EditForm'

class TaskDetail extends Component {
  constructor(props) {
    super(props)
    this.changeStatus = this.changeStatus.bind(this)
    this.changeComment = this.changeComment.bind(this)
    this.updateTask = this.updateTask.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
    this.validate = this.validate.bind(this)

    this.state = {
      task: {
        id: '',
        comment: '',
        status: ''
      },
      beforeChangeTask: {
        id: '',
        comment: '',
        status: ''
      },
      disabled: 'disabled',
      statusList: ['new', 'wip', 'done', 'pending']
    }
  }

  async componentDidMount() {
    await this.getTask()
  }

  async getTask() {
    const task = await storage.get(this.props.match.params.id)

    this.setState({
      task: JSON.parse(JSON.stringify(task)),
      beforeChangeTask: JSON.parse(JSON.stringify(task))
    })
  }

  async updateTask() {
    this.validate()
    if(this.state.disabled) return

    await storage.put(this.state.task)
    this.props.history.push('/')
  }

  async deleteTask() {
    await storage.delete(this.props.match.params.id)
    this.props.history.push('/')
  }

  changeStatus(status) {
    const task_copy = this.state.task
    task_copy.status = status
    this.setState({
      task: task_copy
    })

    this.validate()
  }

  changeComment(comment) {
    const task_copy = this.state.task
    task_copy.comment = comment
    this.setState({
      task: task_copy
    })

    this.validate()
  }

  validate() {
    const validate = () => {
      if (!this.state.task.comment) {
        return true
      } else if(this.state.beforeChangeTask.status === this.state.task.status && 
          this.state.beforeChangeTask.comment === this.state.task.comment) {
        return true
      } else return false
    }
    this.setState({
      disabled: validate()
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
            statusList = {this.state.statusList}
            changeStatus={this.changeStatus}
            changeComment={this.changeComment}
            disabled={this.state.disabled}
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
  .back
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