//CCS_UNIQUE RMXNRWBWBXR
/* eslint-disable no-console */
const path = require('path')

const Promise = require('bluebird')
const moment = require('moment-timezone')
const puppeteer = require('puppeteer')
const fs = require('fs')

Promise.promisifyAll(fs)

const timeout = 20 * 60 * 1000
moment.tz.setDefault('America/Chicago')

const availableReports = {
  TechProfile: 'Tech Profile',
  Routelog: 'Route Log - Time - Zones',
  BBE: 'BBE+BBR',
  Sclosed: 'Sclosed',
  Pending: 'Pending',
  AIQNum: 'Closed_AiQ-Num',
  AIQDen: 'Closed_AiQ-Den',
}

class SiebelReportFetcher {
  constructor(credentials, company) {
    this.company = company
    this.credentials = credentials
  }
  close() {
    this.browser.close()
  }
  async goToDashboard() {
    const userDataDir = path.resolve(__dirname, 'user_data', this.company)
    this.browser = await puppeteer.launch({ userDataDir, headless: true, slowMo: true })
    this.page = await this.browser.newPage()
    const dashboardUrl = 'https://sesar.directv.com/analytics/saw.dll?Dashboard'
    const loginUrl = 'https://sso.directv.com/idp/SSO.saml2'
    await this.page.goto(dashboardUrl, { timeout })
    await this.page.waitForFunction(`window.location == "${dashboardUrl}" || window.location == "${loginUrl}"`)
    await this.page.waitFor(5000)
    try {
      await this.page.type('#username', this.credentials.username)
      await this.page.waitFor(1000)
      await this.page.type('#password', this.credentials.password)
      await this.page.waitFor(1000)
      await this.page.click('.ping-button.normal.allow')
      await this.page.waitForFunction(`window.location == "${dashboardUrl}"`)
    } catch (e) {} // eslint-disable-line no-empty
    const downloadPath = path.resolve(__dirname, 'downloaded_reports', this.company)
    await this.page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath,
    })
  }
  getDownloadUrl({ reportName }) {
    const reportPath = `/shared/FSS HSP Objects - Transfer/STL/${reportName}`
    const encodedReportPath = encodeURIComponent(reportPath)
    return `https://sesar.directv.com/analytics/saw.dll?Go&path=${encodedReportPath}&Format=csv&Extension=.csv`
  }
  async fetchReport(reportLocalName) {
    const reportName = availableReports[reportLocalName]
    console.log('fetching ' + reportName)
    await this.goToDashboard()
    console.log('logged in')
    const downloadUrl = this.getDownloadUrl({ reportName })
    const downloadPath = path.resolve(__dirname, 'downloaded_reports', this.company)
    const filePath = path.resolve(downloadPath, `${reportName}.csv`)
    if (fs.existsSync(filePath)) {
      await fs.renameAsync(filePath, `${filePath}.bk`)
    }
    console.log('downloading...')
    this.page.goto(downloadUrl, { timeout }).catch(() => {})
    console.log('waiting for file to download...')
    let fileWatchInterval = null
    return new Promise(resolve => {
      fileWatchInterval = setInterval(async () => {
        if (fs.existsSync(filePath)) {
          console.log('downloaded.')
          clearInterval(fileWatchInterval)
          return resolve('' + (await fs.readFileAsync(filePath)))
        }
      }, 1000)
    })
    .timeout(20 * 60 * 1000)
    .finally(async () => {
      clearInterval(fileWatchInterval)
    })
  }
}

module.exports = SiebelReportFetcher
