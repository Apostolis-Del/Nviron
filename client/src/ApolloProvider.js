import React from 'react';
import App from './App';
import {ApolloClient} from '@apollo/client';
import {InMemoryCache} from '@apollo/client';
import {createHttpLink } from 'apollo-link-http';
import {ApolloProvider} from '@apollo/react-hooks';
import { setContext } from "@apollo/client/link/context";
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

const httpLink = createHttpLink({
    uri: 'http://localhost:5000',
    headers: { authorization: `bearer [token]` }
})

const authLink = setContext(() => {
    const token = localStorage.getItem('jwtToken');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    };
  });

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

export default(
    <ApolloProvider client={client}>
        <App/>
        </ApolloProvider>
)