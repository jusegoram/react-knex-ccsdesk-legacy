//CCS_UNIQUE VZ6YPJ9B6CC
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'

import TechList from './TechList'

class TechBrowser extends React.Component {
  constructor(props) {
    super(props)
    this.state = { currentPage: 0 }
  }
  render() {
    const { techPage, techsPerPage, numPaginationItems } = this.props
    const { techs } = techPage
    const numPages = Math.floor(techPage.totalCount / techsPerPage)
    const numPagesPerPaginationItem = Math.max(1, Math.floor(numPages / (numPaginationItems + 1)))
    const startingPage = Math.floor(numPagesPerPaginationItem / 2)
    const endingPage = Math.min(numPages, startingPage + numPagesPerPaginationItem * numPaginationItems)
    const paginationPages = _.range(startingPage, endingPage + 1, numPagesPerPaginationItem)

    const { onPageSelected } = this.props
    return (
      <div style={{ marginTop: 20 }}>
        <TechList techs={techs} />
        <div className="text-right">
          <small>
            (Page {this.state.currentPage + 1} / {numPages + 1})
          </small>
        </div>
        <Pagination style={{ display: 'flex', justifyContent: 'center' }}>
          <PaginationItem disabled={!techPage.hasPrevPage}>
            <PaginationLink
              href="#"
              previous
              onClick={() => {
                this.setState({ currentPage: this.state.currentPage - 1 })
                onPageSelected(this.state.currentPage - 1)
              }}
            />
          </PaginationItem>
          {paginationPages.map(pageNum => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                onClick={() => {
                  this.setState({ currentPage: pageNum })
                  onPageSelected(pageNum)
                }}
              >
                {pageNum + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem disabled={!techPage.hasNextPage}>
            <PaginationLink
              href="#"
              next
              onClick={() => {
                this.setState({ currentPage: this.state.currentPage + 1 })
                onPageSelected(this.state.currentPage + 1)
              }}
            />
          </PaginationItem>
        </Pagination>
      </div>
    )
  }
}

TechBrowser.propTypes = {
  currentPage: PropTypes.number,
  techPage: PropTypes.object,
  techsPerPage: PropTypes.number,
  numPaginationItems: PropTypes.number,
  onPageSelected: PropTypes.func.isRequired,
}

export default TechBrowser
