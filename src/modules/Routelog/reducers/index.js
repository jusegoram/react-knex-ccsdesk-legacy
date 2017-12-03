//CCS_UNIQUE OL4D6PR174I
const defaultState = {
  queryString: '',
}

export default function(state = defaultState, action) {
  switch (action.type) {
  case 'Routelogs/UPDATE_QUERY_STRING':
    return {
      ...state,
      queryString: action.value,
    }
  case 'Routelogs/UPDATE_SELECTED_ROUTELOG':
    return {
      ...state,
      selectedRoutelog: action.value,
    }
  default:
    return state
  }
}
