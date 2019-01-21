import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import Search from './Search'


class Header extends Component {

  render() {
    return (
      <c-wiz className="xoqcGf YjWc5e">
        <div className="Esvmme">
          <div className="SmZ4Wd omBice">
            <div className="NRbSyd" />
            <div className="QtDoYb" role="menubar">
              <div className="PQyHOe fIEMif">
                <div className="mJ7Vpd">
                  <div className="BhpYt">
                    <div className="Aul2T m6aMje">
                      <div className="ZSB8G">
                        <svg width="24px" height="24px" className="v1262d JUQOtc" viewBox="0 0 24 24">
                          <path d="M20.49 19l-5.73-5.73C15.53 12.2 16 10.91 16 9.5A6.5 6.5 0 1 0 9.5 16c1.41 0 2.7-.47 3.77-1.24L19 20.49 20.49 19zM5 9.5C5 7.01 7.01 5 9.5 5S14 7.01 14 9.5 11.99 14 9.5 14 5 11.99 5 9.5z" />
                        </svg></div>
                      <div className="L6J0Pc VOEIyf LAL5ie cI2tlc" data-persist-on-navigation="true" data-close-on-blur="true">
                        <div className="d1dlne">
                          <Search />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div jsname="UMAzcc" className="yjD6mb">&nbsp;
                <button className="VfPpkd-LgbsSe ksBjEc" disabled><span>Moses Surumen's personal projects</span></button>
              </div>
            </div>
          </div>
        </div>
      </c-wiz>
    )
  }

}

export default withRouter(Header)