import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
import xs from 'xstream'
import {App} from './app'
import {makeQiscusChatDriver} from './qiscus/driver'

const main = App

const drivers = {
  DOM: makeDOMDriver('#app'),
  Qiscus: makeQiscusChatDriver('apiep-sandbox-stag'),
  Users: () => xs.of([
    { email: 'user1@gg.com', username: 'user1', password: 'password' },
    { email: 'user2@gg.com', username: 'user2', password: 'password' },
    { email: 'user3@gg.com', username: 'user3', password: 'password' },
    { email: 'user4@gg.com', username: 'user4', password: 'password' },
    { email: 'user5@gg.com', username: 'user5', password: 'password' },
  ]),
  Self: () => xs.of({
    email: 'user0@gg.com', username: 'user0', password: 'password'
  }),
  Log: (sinks$) => sinks$.addListener({
    next: (...params) => console.log(...params),
    error: error => console.error('Error in log driver', error),
    complete: () => {}
  })
}

run(main, drivers)
