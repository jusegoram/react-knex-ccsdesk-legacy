//CCS_UNIQUE OL4D6PR174I
import moment from 'moment'

const defaultFetchParams = {
  scopeType: null,
  scopeName: null,
  groupType: 'division',
  dwelling: null,
  type: 'SDCR_Production',
}
const defaultHistoryRoot = { leaf: null, fetchParams: defaultFetchParams }

const defaultState = {
  history: [defaultHistoryRoot],
  dateRange: {
    start: moment()
    .add(-1, 'day')
    .format('YYYY-MM-DD'),
    end: moment()
    .add(-1, 'day')
    .format('YYYY-MM-DD'),
  },
  tlg: 'dma',
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
  case 'SDCR/SET_DATE_RANGE':
    return {
      ...state,
      dateRange: action.value,
    }
  case 'SDCR/SET_TLG':
    return {
      ...state,
      tlg: action.value,
    }
  default:
    return state
  }
}
