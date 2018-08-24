import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './components/Router';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import registerServiceWorker from './registerServiceWorker';

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjl5h50yv4ufs0116k644tfp4' });

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router/>
  </ApolloProvider>,
  document.getElementById('root')
);

registerServiceWorker();
