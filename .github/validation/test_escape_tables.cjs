const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const test = require('node:test')

const script = path.join(__dirname, 'escape_tables.cjs')
for (const [name, input, expected] of [
  ['table data', 'const table = "a\u00adb\u200ec";\n',
    'const table = "a\\u00adb\\u200ec";\n'],
  ['already explicit', 'const table = "a\\u00adb";\n',
    'const table = "a\\u00adb";\n'],
  ['comment is not data', '// a\u00adb\nconst value = 1;\n', null],
  ['regular expression is not data', 'const value = /a\u00adb/;\n', null],
  ['existing identity escape', 'const value = "a\\\u00adb";\n', null]
]) {
  test(name, () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'table-escape-'))
    const file = path.join(directory, 'fixture.js')
    try {
      fs.writeFileSync(file, input)
      const result = spawnSync(process.execPath, [script, file])
      assert.equal(result.error, undefined)
      if (expected === null) {
        assert.notEqual(result.status, 0)
        assert.equal(fs.readFileSync(file, 'utf8'), input)
      } else {
        assert.equal(result.status, 0, result.stderr.toString())
        assert.equal(fs.readFileSync(file, 'utf8'), expected)
      }
    } finally {
      fs.unlinkSync(file)
      fs.rmdirSync(directory)
    }
  })
}
