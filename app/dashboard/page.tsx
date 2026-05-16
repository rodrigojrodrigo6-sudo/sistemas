import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import ClientDashboard from './ClientDashboard'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: sitios, error } = await supabase
    .from('sitios_web')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching data:', error)
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Navbar userEmail={user.email} />
      <main className="container mx-auto p-4 md:p-8">
        <ClientDashboard initialSites={sitios || []} />
      </main>
    </div>
  )
}
