import React, { Component } from 'react'

import ProjectList from '../components/ProjectList'
import MobileFilters from '../components/MobileFilters'

import '../styles/home/main.css';
import '../styles/home/blocks.css';
import '../styles/home/cards.css';
import '../styles/home/scroll.css';

class Home extends Component {
  render() {
    return (
      <div>
        <div>
          <div id="yDmH0d" className="WPaXkf EWZcud cjGgHb d8Etdd LcUz9d ecJEib">
            <ProjectList />
          </div>
        </div>
        <div className="yMuq9d">
          <div className="VfPpkd-LgbsSe ksBjEc">
            <div className="homepage">
              <span>Home Page</span>
              <a className="WpHeLc" href="https://surumen.com/" aria-label="Home Page" />
            </div>
            <MobileFilters />
          </div>
        </div>

      </div>
    )
  }
}

export default Home

