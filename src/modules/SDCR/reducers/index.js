//CCS_UNIQUE OL4D6PR174I
const defaultFetchParams = { scopeType: null, scopeName: null, groupType: 'dma' }
const defaultHistoryRoot = { leaf: null, fetchParams: defaultFetchParams }

const defaultState = {
  history: [defaultHistoryRoot],
}

export default function(state = defaultState, action) {
  switch (action.type) {
  case 'SDCR/PUSH_HISTORY_ITEM':
    return {
      ...state,
      history: [...state.history, action.value],
    }
  case 'SDCR/SET_HISTORY':
    return {
      ...state,
      history: [...action.value],
    }
  default:
    return state
  }
}
