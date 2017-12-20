//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { Card } from 'reactstrap'
import sizeMe from 'react-sizeme'

import PageLayout from '../../util/components/PageLayout'
import SdcrTreemap from '../components/SdcrTreemap'
import Toggle from '../components/Toggle'

import SDCR_QUERY from '../queries/sdcr.graphql'

const nextGrouping = {
  dma: 'service_region',
  office: 'service_region',
  service_region: 'tech_team',
  tech_team: 'tech_id',
}

class SdcrExplorer extends React.Component {
  constructor(props) {
    super(props)
    this.onLeafClicked = this.onLeafClicked.bind(this)
    this.onRollback = this.onRollback.bind(this)
  }
  onLeafClicked(leaf) {
    const { groupType } = this.props.sdcr
    if (!nextGrouping[groupType]) return
    const historyItem = {
      fetchParams: { scopeType: groupType, scopeName: leaf.name, groupType: nextGrouping[groupType] },
      leaf,
    }
    this.props.pushHistoryItem(historyItem)
  }
  onRollback(historyItem) {
    const { history } = this.props
    const indexOfItem = history.indexOf(historyItem)
    this.props.setHistory(history.slice(0, indexOfItem + 1))
  }
  render() {
    const { sdcr, history } = this.props
    const tlgOptions = [{ name: 'DMA', value: 'dma' }, { name: 'Office', value: 'office' }]
    return (
      <PageLayout>
        <Helmet title="CCS Desk - Techs" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Card style={{ backgroundColor: '#2d3446', padding: 5, marginBottom: 10 }}>
            <Toggle
              options={tlgOptions}
              selected={history[0].fetchParams.groupType}
              onChange={tlg => {
                const defaultFetchParams = { scopeType: null, scopeName: null, groupType: tlg }
                const defaultHistoryRoot = { leaf: null, fetchParams: defaultFetchParams }
                this.props.setHistory([defaultHistoryRoot])
              }}
            />
          </Card>
          <ol className="breadcrumb">
            {history.map(historyItem => (
              <li className="breadcrumb-item">
                <a
                  href="#"
                  onClick={() => {
                    this.onRollback(historyItem)
                  }}
                >
                  {!historyItem.leaf
                    ? 'All'
                    : historyItem.leaf.name + ' ' + (historyItem.leaf.color * 100).toFixed(1) + '%'}
                </a>
              </li>
            ))}
          </ol>
          {sdcr && <SdcrTreemap data={sdcr.data} onClick={this.onLeafClicked} />}
        </div>
      </PageLayout>
    )
  }
}

SdcrExplorer.propTypes = {
  sdcr: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  pushHistoryItem: PropTypes.func.isRequired,
  setHistory: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired,
}

export default compose(
  connect(
    state => ({
      history: state.sdcr.history,
    }),
    dispatch => ({
      pushHistoryItem(historyItem) {
        dispatch({
          type: 'SDCR/PUSH_HISTORY_ITEM',
          value: historyItem,
        })
      },
      setHistory(history) {
        console.log(history)
        dispatch({
          type: 'SDCR/SET_HISTORY',
          value: history,
        })
      },
    })
  ),
  graphql(SDCR_QUERY, {
    options: props => ({
      fetchPolicy: 'network-only',
      variables: props.history[props.history.length - 1].fetchParams,
    }),
    props: ({ data: { loading, sdcr } }) => ({
      sdcr,
      loading,
    }),
  })
)(SdcrExplorer)
