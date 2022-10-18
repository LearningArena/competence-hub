import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import {setContext} from '@apollo/client/link/context'

const uri = (process.env.REACT_APP_GQL_URL ? process.env.REACT_APP_GQL_URL : 'https://afll-lab.testbed.se/graphql')
console.log(uri)
const link = createHttpLink({
  uri,
  credentials: 'include'
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  
  return token ? {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : null,
    }
  } : {
    headers: {
      ...headers,
    }
  }
});

export const client = new ApolloClient({
  //uri: 'https://afll-lab.testbed.se/graphql',
  link,
  //link: authLink.concat(link),
  cache: new InMemoryCache(),
});