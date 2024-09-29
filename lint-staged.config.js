const escape = require('shell-quote').quote

/* eslint-disable */
module.exports = {
  '*.ts': (filenames) => {
    const escapedFileNames = filenames.map((filename) => `${escape([filename])}`).join(' ')
    return [
      `prettier --write ${escapedFileNames}`,
      `eslint --no-ignore --max-warnings=0 --fix ${filenames.map((f) => `"${f}"`).join(' ')}`,
      `git add ${escapedFileNames}`
    ]
  }
}
