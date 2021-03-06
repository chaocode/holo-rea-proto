/**
 * UI wiring for GraphQL API via Redux
 *
 * (minimal functionality for "Good First Demo")
 *
 * @package: HoloREA
 * @author:  pospi <pospi@spadgos.com>
 * @since:   2019-01-15
 */

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { parse } from 'graphql'
import { ApolloLink, execute } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
// :NOTE: `SchemaLink` means including GraphQL on the client, which will increase bundle size significantly!
// Exact impact unknown (tree shaking), for max expected overhead see https://www.apollographql.com/docs/link/links/schema.html
import { SchemaLink } from 'apollo-link-schema'
import { onError } from 'apollo-link-error'
// import { ReduxCache, apolloReducer } from 'apollo-cache-redux'
import { InMemoryCache } from 'apollo-cache-inmemory'
import thunk from 'redux-thunk'
// import { composeWithDevTools } from 'remote-redux-devtools'

import schema from '@holorea/graphql-adapter/src' // eslint-disable-line no-unused-vars

// :TODO implement additional reducers if necessary
import * as reducers from './reducers'

const initialState = {}

// const composeEnhancers = composeWithDevTools({ realtime: true, hostname: 'localhost', port: 7999 })

const store = createStore(
  combineReducers({
    // apollo: apolloReducer
    ...reducers
  }),
  initialState,
  // composeEnhancers(
    applyMiddleware(
      thunk
    )
  // )
)

// const cache = new ReduxCache({ store })
const cache = new InMemoryCache()

const link = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map((e) =>
        console.error(e)
      )
    }
    if (networkError) console.error(networkError)
  }),
  new SchemaLink({ schema })
])

// @ts-ignore
export const graphQLFetcher = (operation) => {
  operation.query = parse(operation.query)
  return execute(link, operation)
}

export const client = new ApolloClient({
  link,
  cache
})
// Fix issue with devtools
// @see https://github.com/apollographql/apollo-client-devtools/issues/104
client.initQueryManager()

export default store
