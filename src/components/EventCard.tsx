import React from 'react'
import type { EventItem } from '../types/event'
import VoteButtons from './VoteButtons'

export default function EventCard({ ev, userId, onVote, getCounts }: { ev: EventItem; userId: string | number; onVote: (id: string, userId: string | number, v: 'yes' | 'no') => void; getCounts: (e: EventItem) => { yes: number; no: number } }) {
  const counts = getCounts(ev)
  return (
    <div className="p-4 rounded border mb-3 bg-white/5">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-bold text-lg">{ev.title}</div>
          {ev.startsAt && <div className="text-sm text-gray-300">Starts: {ev.startsAt}</div>}
          {ev.description && <div className="mt-2 text-sm">{ev.description}</div>}
        </div>
        <div className="text-right">
          <div className="text-sm">Yes: <span className="font-semibold">{counts.yes}</span></div>
          <div className="text-sm">No: <span className="font-semibold">{counts.no}</span></div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <VoteButtons eventId={ev.id} userId={userId} votes={ev.votes} onVote={onVote} />
        <div className="text-xs text-gray-400">{new Date(ev.createdAt).toLocaleString()}</div>
      </div>
    </div>
  )
}
