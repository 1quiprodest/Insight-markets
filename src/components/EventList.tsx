import type { EventItem } from '../types/event'
import EventCard from './EventCard'

export default function EventList({ events, userId, onVote, getCounts }: { events: EventItem[]; userId: string | number; onVote: (id: string, userId: string | number, v: 'yes' | 'no') => void; getCounts: (e: EventItem) => { yes: number; no: number } }) {
  if (events.length === 0) return <div className="text-center text-gray-400">No events yet</div>
  return (
    <div>
      {events.map((ev) => (
        <EventCard key={ev.id} ev={ev} userId={userId} onVote={onVote} getCounts={getCounts} />
      ))}
    </div>
  )
}
