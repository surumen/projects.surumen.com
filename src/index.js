import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { BrowserRouter } from 'react-router-dom'

const httpLink = createHttpLink({
  uri: 'https://u41qxdwif5.execute-api.us-east-1.amazonaws.com/dev/graphql'
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

ReactDOM.render(
	<BrowserRouter>
		<ApolloProvider client={client}>
			<App />, 
		</ApolloProvider>
	</BrowserRouter>,
	document.getElementById('root')
)
serviceWorker.unregister()
