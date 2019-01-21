import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Project from './Project'

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      projects {
        id
        name
        description
        tools
        category
      }
    }
  }
`

class Search extends Component {

  state = {
    projects: [],
    filter: ''
  }

  render() {
    return (
      <div>
          <input 
            className="Ax4B8 ZAGvjd"
            type='text' 
            placeholder="Search tool or framework ..."
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <button onClick={() => this._executeSearch()}>OK</button>
        {this.state.projects.map((project, index) => (
          <Project key={project.id} project={project} index={index} />
        ))}
      </div>
    )
  }

  _executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    })
    const projects = result.data.feed.projects
    this.setState({ projects })
  }
}

export default withApollo(Search)