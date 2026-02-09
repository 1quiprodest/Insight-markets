import { useState } from 'react'

export default function CreateEvent({ onCreate }: { onCreate: (args: { title: string; description?: string; startsAt?: string }) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startsAt, setStartsAt] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    // include initData when calling onCreate (hook will post to API if available)
    onCreate({ title: title.trim(), description: description.trim() || undefined, startsAt: startsAt || undefined })
    setTitle('')
    setDescription('')
    setStartsAt('')
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" className="w-full p-2 rounded border" />
      <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Start (optional)" className="w-full p-2 rounded border" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="w-full p-2 rounded border" />
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Create</button>
      </div>
    </form>
  )
}
