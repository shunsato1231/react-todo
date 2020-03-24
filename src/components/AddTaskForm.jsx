import React, {Fragment, useRef} from 'react';
import css from 'styled-jsx/css'

const AddTask = (props) => {

  const inputRef = useRef()
  
  const add = () => {
    if(!inputRef.current.value) return

    props.add(inputRef.current.value)
    inputRef.current.value = ''
  }

  return (
    <Fragment>
      <h2>add new task</h2>
      <div className="form">
        <input placeholder="task comment" ref={inputRef} />
        <button onClick={() => add()}>add</button>
      </div>
      <style jsx>{styled}</style>
    </Fragment>
  )
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