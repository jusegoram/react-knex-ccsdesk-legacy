//CCS_UNIQUE OL4D6PR174I
const defaultState = {
  activityNumber: null,
}

export default function(state = defaultState, action) {
  switch (action.type) {
  case 'ROUTING/SET_ACTIVITY_NUMBER':
    return {
      ...state,
      activityNumber: action.value,
    }
  default:
    return state
  }
}
