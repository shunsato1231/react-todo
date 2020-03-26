import React, {Fragment} from 'react'
import css from 'styled-jsx/css'

const StatusRadioButton = (props) => {
  return (
    <Fragment>
        <div className="wrapper">
          {props.list.map((item, index) => 
              <label 
                key={index}
                className={item.status ? 'checked' : ''}
              >
                <input
                  type="radio"
                  name='status'
                  value={item.name}
                  checked={item.status}
                  onChange={() => props.change(item.name)}/> {item.name}
              </label>
          )}
        </div>
        <span>
          (show {props.taskNumber} tasks)
        </span>
      <style jsx>{styles}</style>
    </Fragment>
  )
}

const styles = css`
.wrapper
  display inline-block
  margin-right 20px
  input
    display none
  label
    position relative
    margin-right 5px
    padding-left 22px
    font-size 14px
    &:before
      display inline-block
      position absolute
      content ''
      width 18px
      height 18px
      border-radius 10px
      border 2px solid #ddd
      box-sizing border-box
      top 50%
      left 0
      transform translateY(-50%)
  label.checked
    &:before
      border-color #51B6FF
    &:after
      display inline-block
      position absolute
      left 5px
      top 50%
      transform translateY(-50%)
      content ''
      width 8px
      height 8px
      border-radius 4px
      background #51B6FF
`

export default StatusRadioButton