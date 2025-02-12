export interface Note{
  id: string
  title: string
  description: string
  cat: 'Trabajo' | 'Personal' | 'Urgente'
  createdAt: Date
}
