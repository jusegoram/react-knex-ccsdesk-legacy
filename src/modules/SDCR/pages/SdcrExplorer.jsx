//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { Card, Container, Row, Col } from 'reactstrap'
import moment from 'moment'
import _ from 'lodash'
import querystring from 'query-string'

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
    this.reset = this.reset.bind(this)
    this.download = this.download.bind(this)
  }
  reset() {
    this.props.setHistory()
  }
  onLeafClicked(leaf) {
    const { groupType } = this.props.sdcr
    let newGroup = null
    if (!nextGrouping[groupType]) {
      if (groupType !== 'division') return
      newGroup = this.props.tlg
    } else {
      newGroup = nextGrouping[groupType]
    }
    this.props.pushHistoryItem({
      ...leaf,
      scopeType: groupType,
      scopeName: leaf.name,
      groupType: newGroup,
    })
  }
  download() {
    const props = this.props
    const latestLeaf = props.history[props.history.length - 1]
    const urlParams = {
      groupType: (latestLeaf && latestLeaf.groupType) || 'division',
      scopeType: latestLeaf && latestLeaf.scopeType,
      scopeName: latestLeaf && latestLeaf.scopeName,
      type: props.type,
      dwelling: props.dwelling,
      startDate: props.dateRange.start,
      endDate: props.dateRange.end,
    }
    const query = querystring.stringify(urlParams)
    let baseUrl = __DEV__ ? 'http://localhost:3000' : 'https://ccsdesk.com'
    window.open(`${baseUrl}/sdcr/download?${query}`)
  }
  render() {
    const { sdcr, history, setDateRange, dateRange, tlg, dwelling, type } = this.props
    const tlgOptions = [{ name: 'DMA', value: 'dma' }, { name: 'Office', value: 'office' }]
    const dwellingOptions = [{ name: 'All Dwellings', value: null }, { name: 'Residential', value: 'RESIDENTIAL' }]
    const typeOptions = [{ name: 'Production', value: 'SDCR_Production' }, { name: 'Repairs', value: 'SDCR_Repairs' }]
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
                    selected={dwelling}
                    onChange={newDwelling => {
                      this.props.setDwelling(newDwelling)
                    }}
                  />
                </Col>
                <Col xs="6" xl="2">
                  <Toggle
                    options={typeOptions}
                    selected={type}
                    onChange={newType => {
                      this.props.setType(newType)
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
            <li className="breadcrumb-item">
              <a href="#" onClick={this.reset}>
                All
              </a>
            </li>
            {history.map(leaf => (
              <li className="breadcrumb-item" key={leaf && leaf.cid}>
                {leaf.name}
              </li>
            ))}
            <a href="#" className="btn btn-sm btn-primary float-right" onClick={this.download}>
              Download
            </a>
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
  setDwelling: PropTypes.func.isRequired,
  setType: PropTypes.func.isRequired,
  setDateRange: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired,
  dateRange: PropTypes.object.isRequired,
  tlg: PropTypes.string.isRequired,
  dwelling: PropTypes.string,
  type: PropTypes.string.isRequired,
  setTlg: PropTypes.func.isRequired,
}

export default compose(
  connect(
    state => ({
      history: state.sdcr.history,
      dateRange: state.sdcr.dateRange,
      tlg: state.sdcr.tlg,
      dwelling: state.sdcr.dwelling,
      type: state.sdcr.type,
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
      setDwelling(dwelling) {
        dispatch({
          type: 'SDCR/SET_DWELLING',
          value: dwelling,
        })
      },
      setType(type) {
        dispatch({
          type: 'SDCR/SET_TYPE',
          value: type,
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
    options: props => {
      const latestLeaf = props.history[props.history.length - 1]
      return {
        fetchPolicy: 'network-only',
        variables: {
          groupType: (latestLeaf && latestLeaf.groupType) || 'division',
          scopeType: latestLeaf && latestLeaf.scopeType,
          scopeName: latestLeaf && latestLeaf.scopeName,
          type: props.type,
          dwelling: props.dwelling,
          startDate: props.dateRange.start,
          endDate: props.dateRange.end,
        },
      }
    },
    props: ({ data: { loading, sdcr } }) => ({
      sdcr,
      loading,
    }),
  })
)(SdcrExplorer)
