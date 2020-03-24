import React, { Component, Fragment } from 'react';
import css from 'styled-jsx/css'
import {BrowserRouter, Switch, Route, Link, Redirect} from 'react-router-dom';
import DashBoard from './pages/DashBoard'
import TaskDetail from './pages/TaskDetail'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <header>
          <h1>React Todo</h1>
        </header>
        <div className="wrapper">
          <Switch>
            <Route exact path='/' component={DashBoard} />
            <Route path='/:id' component={TaskDetail}/>
          </Switch>
        </div>
        <footer>
          <small>© 2014 Copyright Text</small>
        </footer>
        <style jsx>{styles}</style>
      </BrowserRouter>
    );
  }
}

const styles = css`
/* ヘッダ */
header
  background #20A0FF
  position fixed
  top 0
  left 0
  width 100%
  height 56px
  line-height 56px
  h1
    width 90%
    max-width 1200px
    margin 0 auto
    font-size 16px
    color #fff

/*Wrapper*/
.wrapper
  width 90%
  max-width 1200px
  min-height calc(100vh - 105px) /** margin-top 56px + margin-bottom 24px + footer 25px **/
  margin 56px auto 24px
  overflow hidden /* marginが突き抜けるのを回避 */
  &:before /* marginの相殺回避 */
    display block
    content ''

/*Footer*/
footer
  width 100%
  height 25px
  background #20A0FF
  margin 0
  small
    display block
    margin 0 auto
    width 90%
    max-width 1200px
    font-size 12px
    line-height 25px
    color #fff
`;

export default App;