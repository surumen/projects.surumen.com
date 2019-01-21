import React, { Component } from 'react'

class Header extends Component {
    render() {
        return (
            <c-wiz className="xoqcGf YjWc5e sYWWkc" role="header">
              <div className="Esvmme">
                <div className="SmZ4Wd omBice">
                  <div className="QtDoYb" role="menubar">
                    <div className="PQyHOe fIEMif">
                      <div className="mJ7Vpd">
                        <div className="BhpYt">
                          <div className="Aul2T m6aMje">
                            <div className="L6J0Pc VOEIyf LAL5ie cI2tlc">
                              <div className="d1dlne" style={{position: 'relative'}}>
                                <input 
                                  className="yNVtPc ZAGvjd Ny5lGc" 
                                  placeholder="Search tool or framework ..." 
                                  dir="ltr" 
                                  onChange={e => this.setState({ filter: e.target.value })}/>
                              </div>
                            </div>
                            <button className="ZSB8G"  onClick={() => this._executeSearch()}>
                              <span className="NlWrkb snByac">
                                 Search
                              </span>
                            </button>
                          </div>
                        </div>
                        <div className="NmWShc" jsname="OrKVr">
                          <div className="LS6A8c">
                            <div className="slH9Vc">
                              <div role="button" className="U26fgb c7fp5b FS4hgd LcqyIb m6aMje xE5EF">
                                <content className="I3EnF oJeWuf">
                                  <span className="NlWrkb snByac">
                                    Moses Surumen's Personal Projects
                                  </span>
                                </content>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </c-wiz>
        )
    }
}

export default Header