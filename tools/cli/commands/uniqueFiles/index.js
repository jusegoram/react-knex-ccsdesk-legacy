//CCS_UNIQUE CZU1JLK95V
const path = require('path')
const fs = require('fs')
const child_process = require('child_process')

module.exports = async () => {
  const targetPath = child_process
  .execSync('git rev-parse --show-toplevel', { cwd: process.env.PWD })
  .toString()
  .trim()
  const files = child_process
  .execSync('git ls-files', {
    cwd: targetPath,
  })
  .toString()

  const prefix = '//CCS_UNIQUE'
  files
  .split('\n')
  .filter(f => f.match(/.jsx?$/))
  .forEach(f => {
    const file = path.resolve(targetPath, f)
    const text = fs.readFileSync(file) + ''
    const hasUniqueTag = text.split('\n').filter(l => /^\/\/CCS_UNIQUE/.test(l)).length
    if (!hasUniqueTag) {
      fs.writeFileSync(
        file,
        prefix +
            ' ' +
            Math.random()
            .toString(36)
            .slice(2)
            .toUpperCase() +
            '\n' +
            text
      )
    }
  })
}
