import React, { Component } from 'react'
import {BrowserRouter, Route} from 'react-router-dom'

import Home from './pages/Home'
import Mixtape from './pages/projects/Mixtape01'


class App extends Component {
  render() {
    return (
      <BrowserRouter
          basename='/'
          >
        <Home />
      </BrowserRouter>
    )
  }
}

export default App