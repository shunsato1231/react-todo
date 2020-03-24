import React from 'react';
import css from 'styled-jsx/css'
import { Link } from "react-router-dom"

const TaskList = (props) => {
  const listItemClass = (status) => {
    if (status === 'done' ||status === 'pending') return 'gray'
    else if (status === 'wip') return 'blue'
  }

  return (
    <div className="wrapper">
      <div className="heading">
        <div className="id">ID</div>
        <div className="comment">Comment</div>
        <div className="status">Status</div>
      </div>
      <ul>
        {props.tasks.map((task, index) => 
          <li key={index} className={listItemClass(task.status)}>
            <div className="id">{task.id}</div>
            <div className="comment">{task.comment}</div>
            <div className="status">
              <span className={"label " + task.status}>{task.status}</span>
            </div>
            <div className="edit">
              <Link to={String(task.id)}>
                <i className="fas fa-edit icon"></i>
              </Link>
            </div>
            <div className="trash">
              <button onClick={() => props.delete(task.id)}>
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </li>
        )}
      </ul>
      <style jsx>{styles}</style>
    </div>
  )
}

const styles = css`
.wrapper
  width 100%
  .heading
    display flex
    justify-content space-between
    width 100%
    border-bottom 2px solid #51b6ff
    .id
      color #51b6ff
      font-weight bold
      text-align center
      width 50px
    .comment
      color #51b6ff
      font-weight bold
      text-align center
      flex 1
    .status
      color #51b6ff
      font-weight bold
      text-align center
      width 120px
      margin-right 80px
  ul
    li
      display flex
      line-height 40px
      border-bottom 1px solid #eee
      &.gray
        background #f0f0f0
      &.blue
        background #E5F4FF
      .id
        font-weight bold
        text-align center
        width 50px
      .comment
        flex 1
      .status
        width 120px
        text-align center
        .label
          display inline-block
          margin 0 auto
          padding 0 10px
          font-size 14px
          border-radius 5px
          height 25px
          line-height 25px        
        .new
          background #B2DFFF
          color #fff
        .done
          background #ddd
          color #fff
        .wip
          background #7FC9FF
          color #fff
          font-weight bold
        .pending
          background #E5F4FF
          color #fff
      .edit
        width 40px
        text-align center
        .icon
          color #bbb
          font-size 14px
      .trash
        width 40px
        text-align center
        button
          outline none
          cursor pointer
          border none
          background none
          i
            color #bbb
            font-size 14px
`

export default TaskList;