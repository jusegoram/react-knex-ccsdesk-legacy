//CCS_UNIQUE 6A22ZBGVAGV
import jwt from 'jsonwebtoken'
import passport from 'passport'

import UserDAO from './sql'
import schema from './schema.graphqls'
import createResolvers from './resolvers'
import { refreshTokens, createTokens } from './auth'
import tokenMiddleware from './token'
import confirmMiddleware from './confirm'
import Feature from '../ServerFeature'
import settings from '../../../settings'

const SECRET = settings.user.secret

const User = new UserDAO()

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, connectionParams, webSocket) => {
    let tokenUser = null
    let serial = ''
    if (__DEV__) {
      // for local testing without client certificates
      serial = settings.user.auth.certificate.enabled
    }

    if (
      connectionParams &&
      connectionParams.token &&
      connectionParams.token !== 'null' &&
      connectionParams.token !== 'undefined'
    ) {
      try {
        const { user } = jwt.verify(connectionParams.token, SECRET)
        tokenUser = user
      } catch (err) {
        const newTokens = await refreshTokens(connectionParams.token, connectionParams.refreshToken, User, SECRET)
        tokenUser = newTokens.user
      }
    } else if (req) {
      if (req.user) {
        tokenUser = req.user
      } else if (settings.user.auth.certificate.enabled) {
        const user = await User.getUserWithSerial(serial)
        if (user) {
          tokenUser = user
        }
      }
    } else if (webSocket) {
      if (settings.user.auth.certificate.enabled) {
        // in case you need to access req headers
        if (webSocket.upgradeReq.headers['x-serial']) {
          serial = webSocket.upgradeReq.headers['x-serial']
        }

        const user = await User.getUserWithSerial(serial)
        if (user) {
          tokenUser = user
        }
      }
    }

    return {
      User,
      user: tokenUser,
      SECRET,
      req,
    }
  },
  middleware: app => {
    app.use(tokenMiddleware(SECRET, User, jwt))

    if (settings.user.auth.password.sendConfirmationEmail) {
      app.get('/confirmation/:token', confirmMiddleware(SECRET, User, jwt))
    }

    if (settings.user.auth.facebook.enabled) {
      app.use(passport.initialize())

      app.get('/auth/facebook', passport.authenticate('facebook'))

      app.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), async function(
        req,
        res
      ) {
        const user = await User.getUser(req.user.id)
        const refreshSecret = SECRET + user.password
        const [token, refreshToken] = await createTokens(req.user, SECRET, refreshSecret)

        req.universalCookies.set('x-token', token, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
        })
        req.universalCookies.set('x-refresh-token', refreshToken, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
        })

        req.universalCookies.set('r-token', token, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: false,
        })
        req.universalCookies.set('r-refresh-token', refreshToken, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: false,
        })

        res.redirect('/profile')
      })
    }
  },
})
