import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import debounce from 'lodash/debounce'


import Project from './Project'


const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      projects {
        id
        name
        description
        url
        tools
        repo
        buttonBg
        color
        category
      }
    }
  }
`

class ProjectList extends Component {
  state = {
    projects: [
        {
          id: '01',
          name: 'Mixtape Generator',
          description: 'A music playlist generator based on community detection, collaborative filtering, and personalized pagerank',
          tools: 'React, Redux, Express, YouTubeAPI',
          category: 'Full-Stack',
          repo: 'https://github.com/surumen/music-networks',
          url: '/mixtape',
          buttonBg: 'rgba(232, 240, 254, 1)',
          color: 'rgba(66, 133, 244, 1)'
        },
        {
          id: '2',
          name: 'News Library',
          description: 'Easily search for articles on popular credible news websites based on topic and date to ascertain their credibility',
          tools: 'React, Redux, Several News APIs',
          category: 'Front-End',
          repo: 'https://github.com/surumen/news-library',
          url: 'https://surumen.github.io/news-library/',
          buttonBg: 'rgba(252, 232, 230, 1)',
          color: 'rgba(234, 67, 53, 1)'
        },
        {
          id: '3',
          name: 'FAQs Reimagined',
          description: 'Improve customer experience on your website by embedding a lightweight chat bot with realtime and offline capabilities',
          tools: 'Angular, GraphQL, AWS AppSync',
          category: 'Research',
          repo: 'https://github.com/surumen/faqs/',
          url: 'https://surumen.github.io/faqs/',
          buttonBg: 'rgba(230, 244, 234, 1)',
          color: 'rgba(52, 168, 83, 1)'
        },
        {
          id: '4',
          name: 'Face Swap',
          description: 'Swap out faces in different images using OpenCV and a python powered web interface',
          tools: 'OpenCV, DLib, Python, Django',
          category: 'Mobile',
          repo: 'https://github.com/surumen/face-swap/',
          url: 'https://surumen.github.io/face-swap/',
          buttonBg: 'rgba(254, 247, 224, 1)',
          color: 'rgba(251, 188, 4, 1)'
        },
        {
          id: '5',
          name: 'SomaLab',
          description: 'A web-based coding platform with offline capabilities used by learners in areas with slow connectivity',
          tools: 'React, Redux, GraphQL, Django',
          category: 'Machine Learning',
          repo: 'https://github.com/surumen/somalab/',
          url: 'https://surumen.github.io/somalab/',
          buttonBg: 'rgba(243, 232, 253, 1)',
          color: 'rgba(161, 66, 244, 1)'
        },
        {
          id: '6',
          name: 'LinkedIn Search',
          description: 'A web-based coding platform with offline capabilities used by learners in areas with slow connectivity',
          tools: 'React, Redux, GraphQL, Django',
          category: 'Full-Stack',
          repo: 'https://github.com/surumen/somalab/',
          url: 'https://surumen.github.io/somalab/',
          buttonBg: 'rgba(232, 240, 254, 1)',
          color: 'rgba(66, 133, 244, 1)'
        }
      ],
    filter: ''
  }


  render() {
    return (
      <div className='WPaXkf EWZcud cjGgHb d8Etdd LcUz9d ecJEib'>
      <c-wiz className='iK0UKe mCyoK'>
              <c-wiz className='xoqcGf YjWc5e sYWWkc'>
              <div className='Esvmme'>
                <div className='SmZ4Wd omBice'>
                  <div className='QtDoYb'>
                    <div className='PQyHOe fIEMif'>
                      <div className='mJ7Vpd'>
                        <div className='BhpYt'>
                          <div className='Aul2T m6aMje'>
                            <div className='L6J0Pc VOEIyf LAL5ie cI2tlc'>
                              <div className='d1dlne' style={{position: 'relative'}}>
                                <input 
                                  className='yNVtPc ZAGvjd Ny5lGc' 
                                  placeholder='Search tool or framework ...' 
                                  dir='ltr' 
                                  onChange={e => this.setState({ filter: e.target.value })}/>
                              </div>
                            </div>
                            <button className='ZSB8G'  onClick={() => this._executeSearch()}>
                              <span className='NlWrkb snByac'>
                                 Search
                              </span>
                            </button>
                          </div>
                        </div>
                        <div className='NmWShc' jsname='OrKVr'>
                          <div className='LS6A8c'>
                            <div className='slH9Vc'>
                              <div role='button' className='U26fgb c7fp5b FS4hgd LcqyIb m6aMje xE5EF'>
                                <content className='I3EnF oJeWuf'>
                                  <span className='NlWrkb snByac'>
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
              <div className='h8plyb Hnzzid'>
                <c-wiz className='uGCjIb yDSiEe zcLWac eejsDc ZMOaid'>
                  <div className='fv5Tgd'>
                    <c-wiz>
                      <div className='Dfn0Z'>
                        <div className='QUPHr'>
                            <div className='z4bHUc eO2Zfd'>
                              {this.state.projects.map((project, index) => (
                                <Project key={project.id} project={project} index={index} />
                              ))}
                            </div>
                        </div>
                      </div>
                    </c-wiz>
                  </div>
                </c-wiz>
              </div>
            </c-wiz>
      </div>
    )
  }

  _executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter }
    })
    const projects = result.data.feed.projects
    this.setState({ projects })
  }

}

export default withApollo(ProjectList)