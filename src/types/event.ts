export type Vote = 'yes' | 'no'

export interface EventItem {
  id: string
  title: string
  description?: string
  startsAt?: string
  votes: Record<string, Vote>
  createdAt: string
}
