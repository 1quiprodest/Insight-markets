const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const EVENTS_FILE = path.join(__dirname, 'events.json')

function readEvents() {
  try {
    return JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'))
  } catch (e) {
    return []
  }
}

function writeEvents(events) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2))
}

const OWNER_ID = process.env.OWNER_ID || '' // set this to your Telegram user id
const BOT_TOKEN = process.env.BOT_TOKEN || ''

function parseInitData(initData) {
  // initData is a query-string like: key1=value1&key2=value2
  const params = {}
  initData.split('&').forEach((pair) => {
    const [k, v] = pair.split('=')
    if (k) params[k] = decodeURIComponent(v || '')
  })
  return params
}

function checkTelegramInitData(initData) {
  if (!BOT_TOKEN) return null
  const params = parseInitData(initData)
  const hash = params.hash
  if (!hash) return null
  const entries = Object.keys(params)
    .filter((k) => k !== 'hash')
    .sort()
    .map((k) => `${k}=${params[k]}`)
  const data_check_string = entries.join('\n')

  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest()
  const hmac = crypto.createHmac('sha256', secret).update(data_check_string).digest('hex')

  if (hmac !== hash) return null
  return params
}

app.get('/api/config', (req, res) => {
  res.json({ ownerId: OWNER_ID })
})

app.get('/api/events', (req, res) => {
  const events = readEvents()
  res.json(events)
})

app.post('/api/events', (req, res) => {
  const { initData, event } = req.body || {}
  if (!initData || !event) return res.status(400).json({ error: 'missing' })
  const params = checkTelegramInitData(initData)
  if (!params) return res.status(403).json({ error: 'invalid initData' })
  const userId = params.user?.id || params.user_id || params.id || params.user_id
  if (String(userId) !== String(OWNER_ID)) return res.status(403).json({ error: 'not authorized' })

  const events = readEvents()
  events.unshift(event)
  writeEvents(events)
  res.json({ ok: true, event })
})

app.post('/api/vote', (req, res) => {
  const { initData, eventId, vote } = req.body || {}
  if (!initData || !eventId || !vote) return res.status(400).json({ error: 'missing' })
  const params = checkTelegramInitData(initData)
  if (!params) return res.status(403).json({ error: 'invalid initData' })
  const userId = params.user?.id || params.user_id || params.id || params.user_id

  const events = readEvents()
  const ev = events.find((e) => e.id === eventId)
  if (!ev) return res.status(404).json({ error: 'not found' })
  ev.votes = ev.votes || {}
  ev.votes[String(userId)] = vote
  writeEvents(events)
  res.json({ ok: true })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Server listening on', port))
