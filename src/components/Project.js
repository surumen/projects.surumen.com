import React, { Component } from 'react'

class Project extends Component {
  render() {
    return (
      <div className="VfPpkd-WsjYwc VfPpkd-WsjYwc-OWXEXe-INsAgc KC1dQ Usd1Ac  HTXz8">
          <div className="tVYxKc">
            <div className="C96I0d">
              <div className="z8SUje" aria-hidden="true">
                <button className="VfPpkd-BIzmGd SaBhMc EYrTVd" style={{backgroundColor: this.props.project.buttonBg}}>
                  <span className="VfPpkd-Q0XOV">
                    <svg width="24px" height="24px" style={{fill: this.props.project.color}} viewBox="0 0 24 24">
                      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
                    </svg>
                  </span>
                </button>
              </div>{this.props.project.category}
            </div>
          </div>
          <div className="GDGBoc">
            <a href={this.props.project.url}>
              <div>
                <div className="BpKFdf" />
                <div className="zh9Tbe">
                  <div className="mSbCD">{this.props.project.name}</div>
                  <div className="Ecvatc">{this.props.project.description}</div>
                </div>
              </div>
            </a>
            <div className="V3UZb ajfOOe">
              <div className="hEcW3 TjP4pf">
                <button className="VfPpkd-LgbsSe ksBjEc">
                  <span className="language">{this.props.project.tools}</span>
                </button>
              </div>
              <div className="hEcW3 U9bOZe">
                <a href={this.props.project.repo}>
                  <button className="VfPpkd-Bz112c-LgbsSe material-icons-extended">
                    <svg width="16px" height="16px" className="v1262d JUQOtc" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                  </button>
                </a>
              </div>
            </div>
          </div>
      </div>
    )
  }
}


export default Project