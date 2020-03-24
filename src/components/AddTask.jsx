import React, {Component, Fragment} from 'react';
import css from 'styled-jsx/css'

import axios from 'axios';

class AddTask extends Component {
  constructor() {
    super();
    this.handleTextChange = this.handleTextChange.bind(this)
    this.addTask = this.addTask.bind(this)

    this.state = {
      comment: ''
    }
  }
  
  async addTask() {
    await axios.post('http://localhost:8081/', {
      status: 'new',
      comment: this.state.comment
    })

    this.props.update()
    this.refs.form.value = ''
  }

  handleTextChange(event) {
    this.setState ({comment: event.target.value})
  }

  render() {
    return (
      <Fragment>
        <h2>add new task</h2>
        <div className="form">
          <input placeholder="task comment" onChange={this.handleTextChange} ref="form" />
          <button onClick={this.addTask}>add</button>
        </div>
        <style jsx>{styled}</style>
      </Fragment>
    )
  }
}

const styled = css`
h2
  font-size 16px
  margin-bottom 10px
.form
  display flex
  justify-content space-between
  width 100%
  input
    border 1px solid #ddd
    border-width 1px 0 1px 1px
    outline none
    font-size 14px
    line-height 40px
    padding 0 10px
    border-radius 5px 0 0 5px
    flex-grow 1
    &::placeholder
      color #ddd
    &:-ms-input-placeholder
      color #ddd
    &::-ms-input-placeholder
      color #ddd
  button
    font-size 14px
    border none
    border-radius 0 5px 5px 0
    line-height 40px
    padding 0 20px
    background #51B6FF
    border 1px solid #51B6FF
    border-width 1px 1px 1px 0
    color #fff
    cursor pointer
    outline none
`

export default AddTask;