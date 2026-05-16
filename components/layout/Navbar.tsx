import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Bookmark, LogOut } from 'lucide-react'

export function Navbar({ userEmail }: { userEmail?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-50">
          <Bookmark className="h-5 w-5" />
          <span>ReadLater</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500 hidden sm:inline-block dark:text-neutral-400">
            {userEmail}
          </span>
          <form action={logout}>
            <Button variant="ghost" size="icon" title="Cerrar sesión">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
