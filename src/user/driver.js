
export const Events = {
  LIST_USERS: 'User::event:list-user',
  GET_SELF: 'User::event:get-self'
}

export function makeUserDriver (sinks$) {
  const getSelf$ = sinks$.filter(event => event.type === Events.GET_SELF)
  return xs.create({
    start: (listener) => {},
    stop: () => {}
  })
}
