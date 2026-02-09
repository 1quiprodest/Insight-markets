import { useEffect, useState } from 'react'
import type { EventItem, Vote } from '../types/event'

const STORAGE_KEY = 'tgapp_events_v1'

async function fetchEventsFromApi() {
  try {
    const res = await fetch('/api/events')
    if (!res.ok) return null
    return (await res.json()) as EventItem[]
  } catch {
    return null
  }
}

export default function useEvents() {
  const [events, setEvents] = useState<EventItem[]>([])

  useEffect(() => {
    let mounted = true

    ;(async () => {
      const api = await fetchEventsFromApi()
      if (mounted && api) {
        setEvents(api)
        return
      }

      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) setEvents(JSON.parse(raw) as EventItem[])
      } catch {}
    })()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch {}
  }, [events])

  async function createEvent({ title, description, startsAt }: { title: string; description?: string; startsAt?: string }) {
    const e: EventItem = {
      id: Date.now().toString(),
      title,
      description,
      startsAt,
      votes: {},
      createdAt: new Date().toISOString(),
    }

    // try API
    try {
      const initData = window.Telegram?.WebApp?.initData
      if (initData) {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData, event: e }),
        })
        if (res.ok) {
          const eventsFromServer = await fetchEventsFromApi()
          if (eventsFromServer) return setEvents(eventsFromServer)
        }
      }
    } catch (err) {}

    setEvents((p) => [e, ...p])
  }

  async function vote(eventId: string, userId: string | number, v: Vote) {
    const uid = String(userId)
    // optimistic update
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev
        return { ...ev, votes: { ...ev.votes, [uid]: v } }
      }),
    )

    try {
      const initData = window.Telegram?.WebApp?.initData
      if (initData) {
        await fetch('/api/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData, eventId, vote: v }),
        })
        const eventsFromServer = await fetchEventsFromApi()
        if (eventsFromServer) setEvents(eventsFromServer)
      }
    } catch {}
  }

  function getCounts(ev: EventItem) {
    let yes = 0
    let no = 0
    Object.values(ev.votes || {}).forEach((x) => {
      if (x === 'yes') yes++
      else no++
    })
    return { yes, no }
  }

  return { events, createEvent, vote, getCounts }
}
