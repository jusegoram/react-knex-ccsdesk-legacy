//CCS_UNIQUE 1U1PRE23AQW
import jwt from 'jsonwebtoken'
import { pick } from 'lodash'
import bcrypt from 'bcryptjs'
import FieldError from '../../common/FieldError'

export const createTokens = async (user, secret, refreshSecret) => {
  const createToken = jwt.sign(
    {
      user: pick(user, ['id', 'role', 'company', 'hsp', 'firstName', 'lastName']),
    },
    secret,
    {
      expiresIn: '1m',
    }
  )

  const createRefreshToken = jwt.sign(
    {
      user: user.id,
    },
    refreshSecret,
    {
      expiresIn: '7d',
    }
  )

  return Promise.all([createToken, createRefreshToken])
}

export const refreshTokens = async (token, refreshToken, User, SECRET) => {
  let userId = -1
  try {
    const { user } = jwt.decode(refreshToken)
    userId = user
  } catch (err) {
    return {}
  }

  const user = await User.getUser(userId)
  if (!user) {
    return {}
  }
  const refreshSecret = SECRET + user.password

  try {
    jwt.verify(refreshToken, refreshSecret)
  } catch (err) {
    return {}
  }

  const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret)

  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user: pick(user, ['id', 'role', 'company', 'hsp', 'firstName', 'lastName']),
  }
}

export const tryLogin = async (email, password, User, SECRET) => {
  const e = new FieldError()
  const user = await User.getUserByEmail(email)

  // check if email and password exist in db
  if (!user || user.password == null) {
    // user with provided email not found
    e.setError('email', 'Please enter a valid e-mail.')
    e.throwIf()
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    // bad password
    e.setError('password', 'Please enter a valid password.')
    e.throwIf()
  }

  const refreshSecret = SECRET + user.password
  const [token, refreshToken] = await createTokens(user, SECRET, refreshSecret)

  return {
    token,
    refreshToken,
  }
}

export const tryLoginSerial = async (serial, User, SECRET) => {
  try {
    const certAuth = await User.getUserWithSerial(serial)

    const user = await User.getUser(certAuth.id)

    const refreshSecret = SECRET + user.password
    const [token, refreshToken] = await createTokens(user, SECRET, refreshSecret)

    return {
      user,
      token,
      refreshToken,
    }
  } catch (err) {
    console.error(err) //eslint-disable-line no-console
    return {}
  }
}
