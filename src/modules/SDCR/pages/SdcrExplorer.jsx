//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { Card, Container, Row, Col } from 'reactstrap'
import moment from 'moment'
import _ from 'lodash'

import PageLayout from '../../util/components/PageLayout'
import SdcrTreemap from '../components/SdcrTreemap'
import Toggle from '../components/Toggle'
import DateRangePicker from '../components/DateRangePicker'

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
    let newGroup = null
    if (!nextGrouping[groupType]) {
      if (groupType !== 'division') return
      newGroup = this.props.tlg
    }
    const historyItem = {
      fetchParams: {
        scopeType: groupType,
        scopeName: leaf.name,
        groupType: newGroup || nextGrouping[groupType],
        date: moment().format('YYYY-MM-DD'),
      },
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
    const { sdcr, history, setDateRange, dateRange, tlg } = this.props
    const tlgOptions = [{ name: 'DMA', value: 'dma' }, { name: 'Office', value: 'office' }]
    const dwellingOptions = [{ name: 'All Dwellings', value: null }, { name: 'Residential', value: 'RESIDENTIAL' }]
    const typeOptions = [{ name: 'Production', value: 'SDCR_Production' }, { name: 'Repairs', value: 'SDCR_Repairs' }]
    const fetchParams = history[0].fetchParams
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
            <Container fluid>
              <Row>
                <Col xs="6" xl="3">
                  <Toggle
                    options={tlgOptions}
                    selected={tlg}
                    onChange={tlg => {
                      console.log(tlg)
                      this.props.setTlg(tlg)
                    }}
                  />
                </Col>
                <Col xs="6" xl="3">
                  <Toggle
                    options={dwellingOptions}
                    selected={fetchParams.dwelling}
                    onChange={dwelling => {
                      const defaultFetchParams = _.extend(_.clone(fetchParams), { dwelling })
                      const defaultHistoryRoot = { leaf: null, fetchParams: defaultFetchParams }
                      this.props.setHistory([defaultHistoryRoot])
                    }}
                  />
                </Col>
                <Col xs="6" xl="2">
                  <Toggle
                    options={typeOptions}
                    selected={fetchParams.type}
                    onChange={type => {
                      const defaultFetchParams = _.extend(_.clone(fetchParams), { type })
                      const defaultHistoryRoot = { leaf: null, fetchParams: defaultFetchParams }
                      this.props.setHistory([defaultHistoryRoot])
                    }}
                  />
                </Col>
                <Col xs="6" xl="4">
                  <DateRangePicker
                    defaultRange={dateRange}
                    onChange={dateRange => {
                      setDateRange(dateRange)
                    }}
                  />
                </Col>
              </Row>
            </Container>
          </Card>
          <ol className="breadcrumb">
            {history.map(historyItem => (
              <li className="breadcrumb-item" key={historyItem.leaf && historyItem.leaf.cid}>
                <a
                  href="#"
                  onClick={() => {
                    this.onRollback(historyItem)
                  }}
                >
                  {!historyItem.leaf ? 'All' : historyItem.leaf.name + ' (' + historyItem.leaf.value.toFixed(1) + '%)'}
                </a>
              </li>
            ))}
          </ol>
          {sdcr && sdcr.data.length === 0 && <Card style={{ padding: 20 }}>No results to display</Card>}
          {sdcr &&
            sdcr.data.length !== 0 && (
              <Card style={{ padding: 20, width: '100%', height: 'calc(100% - 100px)' }}>
                <SdcrTreemap data={sdcr.data} onClick={this.onLeafClicked} />
              </Card>
            )}
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
  setDateRange: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired,
  dateRange: PropTypes.object.isRequired,
  tlg: PropTypes.string.isRequired,
  setTlg: PropTypes.func.isRequired,
}

export default compose(
  connect(
    state => ({
      history: state.sdcr.history,
      dateRange: state.sdcr.dateRange,
      tlg: state.sdcr.tlg,
    }),
    dispatch => ({
      pushHistoryItem(historyItem) {
        dispatch({
          type: 'SDCR/PUSH_HISTORY_ITEM',
          value: historyItem,
        })
      },
      setHistory(history) {
        dispatch({
          type: 'SDCR/SET_HISTORY',
          value: history,
        })
      },
      setDateRange(dateRange) {
        dispatch({
          type: 'SDCR/SET_DATE_RANGE',
          value: dateRange,
        })
      },
      setTlg(tlg) {
        dispatch({
          type: 'SDCR/SET_TLG',
          value: tlg,
        })
      },
    })
  ),
  graphql(SDCR_QUERY, {
    options: props => ({
      fetchPolicy: 'network-only',
      variables: {
        ...props.history[props.history.length - 1].fetchParams,
        startDate: props.dateRange.start,
        endDate: props.dateRange.end,
      },
    }),
    props: ({ data: { loading, sdcr } }) => ({
      sdcr,
      loading,
    }),
  })
)(SdcrExplorer)
