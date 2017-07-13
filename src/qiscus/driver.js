/** globals qiscus */
import {adapt} from '@cycle/run/lib/adapt'
import xs from 'xstream'

export const Events = {
  INITIALIZE: 'Qiscus::event:initialize',
  LOGIN_SUCCESS: 'Qiscus::event:login-success',
  LOGIN_FAILURE: 'Qiscus::event:login-failure',
  NEW_MESSAGE: 'Qiscus::event:new-message',
  CHAT_ROOM_CREATED: 'Qiscus::event:chat-room-created',
  GROUP_ROOM_CREATED: 'Qiscus::event:group-room-created',
  HEADER_CLICKED: 'Qiscus::event:header-clicked',

  CHAT_TARGET: 'Qiscus::event:chat-target',
  SET_USER: 'Qiscus::event:set-user'
}

export function makeQiscusChatDriver (appID) {
  const source = xs.create({
    start: (listener) => {
      qiscus.init({
        AppId: appID,
        loginSuccessCallback: data => listener.next({
          type: Events.LOGIN_SUCCESS,
          payload: data
        }),
        loginErrorCallback: data => listener.next({
          type: Events.LOGIN_FAILURE,
          payload: data
        }),
        newMessagesCallback: data => listener.next({
          type: Events.NEW_MESSAGE,
          payload: data
        }),
        chatRoomCreatedCallback: data => listener.next({
          type: Events.CHAT_ROOM_CREATED,
          payload: data
        }),
        groupRoomCreatedCallback: data => listener.next({
          type: Events.GROUP_ROOM_CREATED,
          payload: data
        }),
        headerClickedCallback: data => listener.next({
          type: Events.HEADER_CLICKED,
          payload: data
        })
      })
      qiscus.setUser('apiep@qiscus.com', 'password', 'apiep')
    },
    stop: () => {}
  })
  return function QiscusChatDriver (sinks$) {
    sinks$.filter(event => event.type === Events.CHAT_TARGET)
      .addListener({
        next: (event) => {
          qiscus.UI.chatTarget(event.email)
        },
        error: (error) => {
          console.error('Error when chatTarget', error)
        },
        complete: () => {}
      })
    sinks$.filter(event => event.type === Events.SET_USER)
      .addListener({
        next: (event) => {
          qiscus.setUser(
            event.user.email,
            event.user.password,
            event.user.username
          )
        },
        error: error => console.error('Error when set user', error),
        complete: () => {}
      })
    sinks$.filter(event => event.type === Events.INITIALIZE)
      .addListener({
        next: (event) => {
          for (let user of event.users) {
            qiscus.setUser(user.email, user.password, user.username)
          }
          qiscus.setUser(event.self.email, event.self.password, event.self.username)
        }
      })
    return adapt(source)
  }
}
