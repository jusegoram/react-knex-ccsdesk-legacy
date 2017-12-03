//CCS_UNIQUE 5RFQCUKMYXU
import React from 'react'
import { Route } from 'react-router-dom'

import PageNotFound from './containers/PageNotFound'
import Feature from '../../modules/ClientFeature'

export default new Feature({
  route: <Route component={PageNotFound} />,
})
