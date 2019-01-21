import React, { Component } from 'react'
import {BrowserRouter, Route} from 'react-router-dom'

import Home from './pages/Home'
import Mixtape from './pages/projects/Mixtape01'


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact={true} path='/' render={() => (
            <Home />
          )}/>
          <Route exact={true} path='/mixtape' render={() => (
            <Mixtape />
          )}/>
        </div>
      </BrowserRouter>
    )
  }
}

export default App