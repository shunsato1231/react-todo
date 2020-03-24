import React, {Component, Fragment} from 'react';
import css from 'styled-jsx/css'
import SortTask from '../components/SortTask';
import AddTask from '../components/AddTask';
import TaskList from '../components/TaskList';


import axios from 'axios';

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.changeStatus = this.changeStatus.bind(this)
    this.updateTask = this.updateTask.bind(this)

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
    };
  }


  async componentDidMount() {
    const tasks = (await axios.get('http://localhost:8081/')).data;
    this.setState({
      tasks: tasks,
      allTasks: tasks
    });
  }

  async updateTask() {
    const tasks = (await axios.get('http://localhost:8081/')).data;
    this.setState({
      tasks: tasks,
      allTasks: tasks
    })

    this.sortTask(this.state.statusList[this.state.sortedStatusIndex].name)
  }

  changeStatus(index) {
    const statusList_copy = this.state.statusList.slice();
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
          <SortTask item={this.state.statusList} change={this.changeStatus}/>
        </div>
        <div className="list">
          <TaskList tasks={this.state.tasks} update={this.updateTask} />
        </div>
        <div className="add">
          <AddTask update={this.updateTask} />
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
`;

export default DashBoard;