import React from 'react'

export default function VoteButtons({
  eventId,
  userId,
  votes,
  onVote,
}: {
  eventId: string
  userId: string | number
  votes: Record<string, 'yes' | 'no'>
  onVote: (eventId: string, userId: string | number, v: 'yes' | 'no') => void
}) {
  const uid = String(userId)
  const myVote = votes[uid]

  return (
    <div className="flex gap-2">
      <button
        onClick={() => onVote(eventId, userId, 'yes')}
        className={`px-3 py-1 rounded ${myVote === 'yes' ? 'bg-green-600 text-white' : 'bg-green-200'}`}
      >
        👍 Да
      </button>
      <button
        onClick={() => onVote(eventId, userId, 'no')}
        className={`px-3 py-1 rounded ${myVote === 'no' ? 'bg-red-600 text-white' : 'bg-red-200'}`}
      >
        👎 Нет
      </button>
    </div>
  )
}
