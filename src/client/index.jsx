//CCS_UNIQUE VHECIC0L8M
import React from 'react'
import { render as reactRender, hydrate } from 'react-dom'
// Virtual module, see webpack-virtual-modules usage in webpack.run.js
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
import 'backend_reload'

import Main from './Main'
import log from '../common/log'
import './favicon'
import './static'

const root = document.getElementById('content')

const render = __SSR__ ? hydrate : reactRender

if (__DEV__) {
  let frontendReloadCount = 0

  render(<Main key={frontendReloadCount} />, root)

  if (module.hot) {
    module.hot.accept()

    module.hot.accept('backend_reload', () => {
      log.debug('Reloading front-end')
      window.location.reload()
    })

    module.hot.accept('./Main', () => {
      try {
        log.debug('Updating front-end')
        frontendReloadCount = (frontendReloadCount || 0) + 1

        render(<Main key={frontendReloadCount} />, root)
      } catch (err) {
        log(err.stack)
      }
    })
  }
} else {
  render(<Main />, root)
}
