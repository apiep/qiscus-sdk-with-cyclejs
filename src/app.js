import {div, h1, ul, li, a} from '@cycle/dom'
import xs from 'xstream'

import {Events} from './qiscus/driver'

export function App (sources) {
  const chatTarget$ = sources.DOM
    .select('.chat-target')
    .events('click')
    .map(event => event.target.dataset['email'])
    .map(email => ({
      type: Events.CHAT_TARGET,
      email: email
    }))
  const vtree$ = xs.combine(sources.Self, sources.Users)
    .map(([self, users]) => (
      div([
        h1(`Welcome, ${self.username}`),
        ul(users.map(user => li(
          a('.chat-target', {
            attrs: {
              href: 'javascript:void(0)',
              ['data-username']: user.username,
              ['data-email']: user.email
            }
          }, user.username)
        )))
      ])
    ))

  const qiscusLoginSuccess$ = sources.Qiscus
    .filter(event => event.type === Events.LOGIN_SUCCESS)

  const initialize$ = xs.combine(sources.Users, sources.Self)
    .map(([users, self]) => {
      return {
        type: Events.INITIALIZE,
        self: self,
        users: users
      }
    })

  const qiscus$ = xs.merge(
    sources.Qiscus,
    initialize$,
    chatTarget$
  )

  const sinks = {
    DOM: vtree$,
    Qiscus: qiscus$
  }
  return sinks
}
