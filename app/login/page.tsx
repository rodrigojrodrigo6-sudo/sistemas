import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { LogIn } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <LogIn className="h-6 w-6 text-neutral-900 dark:text-neutral-50" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}
        
        <form className="space-y-4" action={login}>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
            />
          </div>
          <Button className="w-full" type="submit">
            Iniciar Sesión
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">¿No tienes una cuenta? </span>
          <Link href="/register" className="font-medium underline underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-50">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  )
}
