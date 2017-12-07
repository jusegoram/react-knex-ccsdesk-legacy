//CCS_UNIQUE OL4D6PR174I
const defaultState = {
  queryString: '',
  searchParams: {
    techId: '',
  },
}

export default function(state = defaultState, action) {
  switch (action.type) {
  case 'Techs/UPDATE_SEARCH_PARAMS':
    return {
      ...state,
      searchParams: {
        ...state.searchParams,
        ...action.value,
      },
    }
  case 'Techs/UPDATE_QUERY_STRING':
    return {
      ...state,
      queryString: action.value,
    }
  case 'Techs/UPDATE_SELECTED_TECH':
    return {
      ...state,
      selectedTechId: action.value,
    }
  default:
    return state
  }
}
