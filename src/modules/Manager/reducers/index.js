//CCS_UNIQUE 391CUQYDP1M
const defaultState = {
  queryString: '',
}

export default function(state = defaultState, action) {
  switch (action.type) {
  case 'Managers/UPDATE_QUERY_STRING':
    return {
      ...state,
      queryString: action.value,
    }
  case 'Managers/UPDATE_SELECTED_MANAGER':
    return {
      ...state,
      selectedManagerId: action.value,
    }
  default:
    return state
  }
}
