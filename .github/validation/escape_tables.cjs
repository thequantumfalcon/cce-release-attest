// Keep upstream encoding-table values while making invisible literals explicit.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const { tokenizer } = require('acorn')

const filename = process.argv[2]
assert.equal(process.argv.length, 3)
const original = fs.readFileSync(filename, 'utf8')
const options = { ecmaVersion: 'latest', sourceType: 'script' }
const before = [...tokenizer(original, options)]
const hidden = /[\u00ad\u200b-\u200f\ufeff]/gu
const edits = []
for (const token of before) {
  const raw = original.slice(token.start, token.end)
  for (const match of raw.matchAll(hidden)) {
    assert.equal(token.type.label, 'string', 'Only string data may be escaped')
    const prefix = raw.slice(0, match.index).match(/\\*$/u)[0]
    assert.equal(prefix.length % 2, 0, 'Do not rewrite an existing escape')
    edits.push({ at: token.start + match.index, value: match[0] })
  }
}
assert.equal(edits.length, [...original.matchAll(hidden)].length)
let output = original
for (const edit of edits.reverse()) {
  const escaped = '\\u' + edit.value.codePointAt(0).toString(16).padStart(4, '0')
  output = output.slice(0, edit.at) + escaped + output.slice(edit.at + 1)
}
const meaning = tokens => tokens.map(token => [token.type.label, token.value])
assert.deepEqual(meaning([...tokenizer(output, options)]), meaning(before))
assert.equal([...output.matchAll(hidden)].length, 0)
fs.writeFileSync(filename, output)
console.log(JSON.stringify({ escaped: edits.length, tokens: before.length,
  token_stream_equal: true }))
