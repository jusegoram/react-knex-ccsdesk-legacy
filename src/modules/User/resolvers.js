//CCS_UNIQUE UNFWKUX0W7I
/*eslint-disable no-unused-vars*/
import { pick } from 'lodash'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import pug from 'pug'
import { refreshTokens, tryLogin } from './auth'
import { requiresAuth, requiresAdmin } from './permissions'
import FieldError from '../../common/FieldError'
import settings from '../../../settings'

const Promise = require('bluebird')
const nodemailer = require('nodemailer')
const sesTransport = require('nodemailer-ses-transport')
const AWS = require('aws-sdk')
const AwsCredentials = require('/root/credentials/aws.json') //eslint-disable-line import/no-absolute-path

AWS.config.accessKeyId = AwsCredentials.accessKeyId
AWS.config.secretAccessKey = AwsCredentials.secretAccessKey
AWS.config.region = 'us-east-1'
AWS.config.sslEnabled = true

const SES = new AWS.SES({ apiVersion: '2010-12-01' })
const NodeMailer = nodemailer.createTransport(sesTransport({ ses: SES, rateLimit: 14 }))
Promise.promisifyAll(NodeMailer)

const inviteTemplate = pug.compileFile(path.resolve(__dirname, 'invite.pug'))
const createInviteHtml = ({ name, token }) => inviteTemplate({ name, token })

export default pubsub => ({
  Query: {
    users: requiresAdmin.createResolver((obj, { orderBy, filter }, context) => {
      return context.User.getUsers(orderBy, filter)
    }),
    user: requiresAuth.createResolver((obj, { id }, context) => {
      return context.User.getUser(id)
    }),
    currentUser(obj, args, context) {
      if (context.user) {
        return context.User.getUser(context.user.id)
      } else {
        return null
      }
    },
  },
  Mutation: {
    invite: requiresAuth.createResolver(async (obj, { email, name, role }, context) => {
      if (context.user.role !== 'Admin' && context.user.role !== 'Manager')
        throw new Error('Only admins and managers can invite accounts')
      if (role === 'Admin' && context.user.role !== 'Admin') throw new Error('Only admins can invite admin accounts')
      const { hsp, company } = context.user
      const token = jwt.sign({ email, role, hsp, company }, process.env.REGISTER_TOKEN_SECRET)
      await NodeMailer.sendMailAsync({
        from: 'CCS Desk <info@ccsdesk.com>',
        to: email,
        subject: `${context.user.firstName} ${context.user.lastName} has invited you to CCS Desk`,
        html: createInviteHtml({ name, token }),
      })
      return {
        success: true,
      }
    }),
    async validateRegistrationToken(obj, { token }, context) {
      try {
        const { email } = jwt.verify(token, process.env.REGISTER_TOKEN_SECRET)
        return email
      } catch (e) {
        return false
      }
    },
    async register(obj, { input }, context) {
      try {
        const e = new FieldError()
        let jwtPayload
        try {
          jwtPayload = jwt.verify(input.token, process.env.REGISTER_TOKEN_SECRET)
        } catch (e) {
          e.setError('token', 'The provided token is not valid.')
        }
        const { email, role, hsp, company } = jwtPayload
        if (!email || !role || !hsp || !company) e.setError('token', 'The provided token is not valid.')

        e.throwIf()

        const emailExists = await context.User.getUserByEmail(email)
        if (emailExists) {
          e.setError('email', 'E-mail already exists.')
        }

        const { tech_id } = input
        const usernameExists = await context.User.getUserByTechId(tech_id)
        if (usernameExists) {
          e.setError('tech_id', 'This Siebel ID has already been claimed.')
        }

        const { password } = input
        if (password.length < 6) {
          e.setError('password', 'Password must be 6 characters long')
        }

        const { phone_number } = input
        if (phone_number.length !== 10) {
          e.setError('phone_number', 'Phone numbers must be 10 digits long')
        }

        e.throwIf()

        const { first_name, last_name } = input
        const userProps = { email, role, hsp, company, tech_id, first_name, last_name, password, phone_number }
        const user = await context.User.register(userProps)

        return { user }
      } catch (e) {
        return { errors: e }
      }
    },
    async login(obj, { input: { email, password } }, context) {
      try {
        const tokens = await tryLogin(email, password, context.User, context.SECRET)
        if (context.req) {
          context.req.universalCookies.set('x-token', tokens.token, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
          })
          context.req.universalCookies.set('x-refresh-token', tokens.refreshToken, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
          })

          context.req.universalCookies.set('r-token', tokens.token, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: false,
          })
          context.req.universalCookies.set('r-refresh-token', tokens.refreshToken, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: false,
          })
        }
        return { tokens }
      } catch (e) {
        return { errors: e }
      }
    },
    async logout(obj, args, context) {
      if (context.req) {
        context.req.universalCookies.remove('x-token')
        context.req.universalCookies.remove('x-refresh-token')

        context.req.universalCookies.remove('r-token')
        context.req.universalCookies.remove('r-refresh-token')
      }

      return true
    },
    refreshTokens(obj, { token, refreshToken }, context) {
      return refreshTokens(token, refreshToken, context.User, context.SECRET)
    },
    addUser: requiresAdmin.createResolver(async (obj, { input }, context) => {
      try {
        const e = new FieldError()

        const userExists = await context.User.getUserByUsername(input.username)
        if (userExists) {
          e.setError('username', 'Username already exists.')
        }

        const localAuth = pick(input, ['email', 'password'])
        const emailExists = await context.User.getUserByEmail(localAuth.email)
        if (emailExists) {
          e.setError('email', 'E-mail already exists.')
        }

        if (input.password.length < 5) {
          e.setError('password', 'Password must be 5 characters or more.')
        }

        e.throwIf()

        const [createdUserId] = await context.User.register({ ...input })

        await context.User.createLocalOuth({
          ...localAuth,
          userId: createdUserId,
        })

        const user = await context.User.getUser(createdUserId)

        return { user }
      } catch (e) {
        return { errors: e }
      }
    }),
    editUser: requiresAdmin.createResolver(async (obj, { input }, context) => {
      try {
        const e = new FieldError()

        const userExists = await context.User.getUserByUsername(input.username)
        if (userExists && userExists.id !== input.id) {
          e.setError('username', 'Username already exists.')
        }

        const localAuth = pick(input, ['email', 'password'])
        const emailExists = await context.User.getUserByEmail(localAuth.email)
        if (emailExists && emailExists.id !== input.id) {
          e.setError('email', 'E-mail already exists.')
        }

        if (input.password && input.password.length < 5) {
          e.setError('password', 'Password must be 5 characters or more.')
        }

        e.throwIf()

        await context.User.editUser(input)
        const user = await context.User.getUser(input.id)
        return { user }
      } catch (e) {
        return { errors: e }
      }
    }),
    deleteUser: requiresAdmin.createResolver(async (obj, { id }, context) => {
      try {
        const e = new FieldError()
        const user = await context.User.getUser(id)
        if (!user) {
          e.setError('delete', 'User does not exist.')
          e.throwIf()
        }

        if (user.id === context.user.id) {
          e.setError('delete', 'You can not delete your self.')
          e.throwIf()
        }

        const isDeleted = await context.User.deleteUser(id)
        if (isDeleted) {
          return { user }
        } else {
          e.setError('delete', 'Could not delete user. Please try again later.')
          e.throwIf()
        }
      } catch (e) {
        return { errors: e }
      }
    }),
    async forgotPassword(obj, { input }, context) {
      try {
        const localAuth = pick(input, 'email')
        const user = await context.User.getUserByEmail(localAuth.email)

        if (user && context.mailer) {
          // async email
          jwt.sign(
            { email: user.email, password: user.password },
            context.SECRET,
            { expiresIn: '1d' },
            (err, emailToken) => {
              // encoded token since react router does not match dots in params
              const encodedToken = Buffer.from(emailToken).toString('base64')
              const url = `${context.req.protocol}://${context.req.get('host')}/reset-password/${encodedToken}`
              context.mailer.sendMail({
                from: 'Apollo Universal Starter Kit <nxau5pr4uc2jtb6u@ethereal.email>',
                to: user.email,
                subject: 'Reset Password',
                html: `Please click this link to reset your password: <a href="${url}">${url}</a>`,
              })
            }
          )
        }
        return true
      } catch (e) {
        // always return true so you can't discover users this way
        return true
      }
    },
    async resetPassword(obj, { input }, context) {
      try {
        const e = new FieldError()
        const reset = pick(input, ['password', 'passwordConfirmation', 'token'])
        if (reset.password !== reset.passwordConfirmation) {
          e.setError('password', 'Passwords do not match.')
        }

        if (reset.password.length < 5) {
          e.setError('password', 'Password must be 5 characters or more.')
        }
        e.throwIf()

        const token = Buffer.from(reset.token, 'base64').toString()
        const { email, password } = jwt.verify(token, context.SECRET)
        const user = await context.User.getUserByEmail(email)
        if (user.password !== password) {
          e.setError('token', 'Invalid token')
          e.throwIf()
        }

        if (user) {
          await context.User.updatePassword(user.id, reset.password)
        }
        return { errors: null }
      } catch (e) {
        return { errors: e }
      }
    },
  },
  Subscription: {},
})
