import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to login page by default
  // In a real app, check auth status and redirect accordingly
  redirect('/login')
}
