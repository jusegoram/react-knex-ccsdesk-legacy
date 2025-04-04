//CCS_UNIQUE FZFX0ZA0OC8
const CERTIFICATE_DEVSERIAL = '00'

module.exports = {
  secret: process.env.AUTH_SECRET,
  auth: {
    password: {
      confirm: true,
      sendConfirmationEmail: true,
      enabled: true,
    },
    certificate: {
      devSerial: CERTIFICATE_DEVSERIAL,
      enabled: false,
    },
    facebook: {
      clientID: process.env.FACEBOOK_CLIENTID,
      clientSecret: process.env.FACEBOOK_CLIENTSECRET,
      enabled: false,
    },
  },
}
