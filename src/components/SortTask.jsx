import React, {Component, Fragment} from 'react';
import css from 'styled-jsx/css'

class SortTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      radio: [
        {name: 'all', status: true},
        {name: 'new', status: false},
        {name: 'wip', status: false},
        {name: 'done', status: false},
        {name: 'pending', status: false}
      ]
    };
  }

  render() {

    return (
      <Fragment>
          <div className="wrapper">
            {this.props.item.map((r, index) => 
                <label 
                  key={index}
                  className={r.status ? 'checked' : ''}
                >
                  <input
                    type="radio"
                    name='status'
                    value={r.name}
                    checked={r.status}
                    onChange={() => this.props.change(index)}/> {r.name}
                </label>
            )}
          </div>
          <span>
            (show {this.state.tasks.length} tasks)
          </span>
        <style jsx>{styles}</style>
      </Fragment>
    )
  }
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
`;

export default SortTask;