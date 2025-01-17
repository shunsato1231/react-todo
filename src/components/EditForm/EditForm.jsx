import React, {Fragment, useRef} from 'react'
import css from 'styled-jsx/css'

const EditForm = (props) => {
  const disabled = props.disabled ? 'disabled' : ''
  const inputRef = useRef()

  return (
    <Fragment>
      <div className="wrapper">
        <div className="status">
          {props.statusList.map((item, index) =>
            <label data-testid='statusItem' key={index} className={props.task.status === item ? 'checked' : ''}>
              <input type="radio" name="status" value={item.name} checked={props.task.status === item} onChange={() => props.changeStatus(item)}/> {item}
            </label>
          )}
        </div>
        <input
          data-testid="task-comment"
          className="text"
          placeholder="task comment"
          value={props.task.comment}
          ref={inputRef}
          onChange={() => props.changeComment(inputRef.current.value)} />
        <div className="button">
          <button data-testid="updateButton" className={"update " + disabled} onClick={props.update}>update task</button>
          <button data-testid="deleteButton" className="delete" onClick={props.delete}>
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  )
}

const styles = css`
.wrapper
  max-width 850px
  margin 0 auto
  .status
    display flex
    justify-content space-between
    input
      display none
    label
      flex 1
      display block
      height 40px
      line-height 40px
      text-align center
      border-style solid
      border-width 1px 1px 0 0
      border-color #ddd
      color #ccc
      font-size 14px
      cursor pointer
      &:first-child
        border-width 1px 1px 0 1px
        border-radius 5px 0 0 0
      &:last-child
        border-radius 0 5px 0 0
    .checked
      font-weight bold
      color #fff
      background #51b6ff

  .text
    height 60px
    width 100%
    border-style solid
    border-width 1px
    border-color #ddd
    outline none
    padding 20px
    font-size 18px
    &::placeholder
      color #ddd
    &:-ms-input-placeholder
      color #ddd
    &::-ms-input-placeholder
      color #ddd

  .button
    display flex
    height 35px
    .update
      flex 1
      outline none
      border-style solid
      border-color #ddd
      border-width 0 1px 1px 1px
      border-radius 0 0 0 5px
      background #f8f8f8
      color #888
      cursor pointer
      font-size 13px
      &.disabled
        background #fcfcfc
        color #eee
        pointer-events none
    .delete
      width 40px
      outline none
      cursor pointer
      border-style solid
      border-color #ddd
      border-width 0 1px 1px 0
      border-radius 0 0 5px 0
      background #fff
      i
        font-size 18px
        color #888
`

export default EditForm