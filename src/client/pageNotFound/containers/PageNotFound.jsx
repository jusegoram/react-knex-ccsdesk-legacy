//CCS_UNIQUE WVC04LSUX7L
import React from 'react'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'
import { Button } from 'reactstrap'
import PageLayout from '../../../modules/util/components/PageLayout'

const PageNotFound = () => (
  <PageLayout>
    <section className="text-center mt-4 mb-4">
      <Helmet title="CCS Desk - Page not found" />
      <h2>Page not found - 404</h2>
      <Link to="/">
        <Button className="home-link" color="primary">
          Go to Homepage
        </Button>
      </Link>
    </section>
  </PageLayout>
)

export default PageNotFound
