'use client'

import { useState, useMemo, useTransition } from 'react'
import { createSite, toggleVisited, deleteSite, editSite } from '@/app/actions/sites'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SitioWeb } from '@/types'
import { Search, Plus, ExternalLink, Check, Trash2, Edit2, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default function ClientDashboard({ initialSites }: { initialSites: SitioWeb[] }) {
  const [sites, setSites] = useState<SitioWeb[]>(initialSites)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'visited'>('all')
  const [sort, setSort] = useState<'recent' | 'alpha' | 'visited'>('recent')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<SitioWeb | null>(null)
  const [isPending, startTransition] = useTransition()

  // Stats
  const total = sites.length
  const visitados = sites.filter(s => s.visitado).length
  const pendientes = total - visitados

  // Derived state
  const filteredAndSortedSites = useMemo(() => {
    let result = [...sites]

    // Filter by text
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s => 
        s.nombre.toLowerCase().includes(q) || 
        s.url.toLowerCase().includes(q)
      )
    }

    // Filter by status
    if (filter === 'pending') result = result.filter(s => !s.visitado)
    if (filter === 'visited') result = result.filter(s => s.visitado)

    // Sort
    result.sort((a, b) => {
      if (sort === 'alpha') return a.nombre.localeCompare(b.nombre)
      if (sort === 'visited') {
        if (a.visitado === b.visitado) return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        return a.visitado ? -1 : 1
      }
      // recent
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return result
  }, [sites, search, filter, sort])

  // Handlers
  const handleToggleVisited = async (site: SitioWeb) => {
    const optimisticSites = sites.map(s => 
      s.id === site.id ? { ...s, visitado: !s.visitado, fecha_visita: !s.visitado ? new Date().toISOString() : null } : s
    )
    setSites(optimisticSites)

    startTransition(async () => {
      const res = await toggleVisited(site.id, site.visitado)
      if (res.error) {
        // revert on error
        setSites(sites)
        alert('Error al actualizar: ' + res.error)
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este sitio?')) return
    
    const optimisticSites = sites.filter(s => s.id !== id)
    setSites(optimisticSites)

    startTransition(async () => {
      const res = await deleteSite(id)
      if (res.error) {
        setSites(sites)
        alert('Error al eliminar: ' + res.error)
      }
    })
  }

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Basic optimistic add is tricky since we don't have the ID, we'll just wait for the server action
    startTransition(async () => {
      const res = await createSite(formData)
      if (res.error) {
        alert('Error: ' + res.error)
      } else {
        setIsAddModalOpen(false)
        // A simple page reload to get fresh data (since server action revalidatePath reloads the page route)
        // Since it's a Client Component that receives initial data from Server Component, it will update automatically!
        window.location.reload() 
      }
    })
  }

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingSite) return
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const res = await editSite(editingSite.id, formData)
      if (res.error) {
        alert('Error: ' + res.error)
      } else {
        setEditingSite(null)
        window.location.reload()
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total guardados</h3>
          <p className="mt-2 text-3xl font-bold">{total}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Pendientes</h3>
          <p className="mt-2 text-3xl font-bold">{pendientes}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Visitados</h3>
          <p className="mt-2 text-3xl font-bold">{visitados}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Buscar por nombre o URL..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="h-10 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="visited">Visitados</option>
          </select>
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value as any)}
            className="h-10 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
          >
            <option value="recent">Más recientes</option>
            <option value="alpha">Alfabético</option>
            <option value="visited">Visitados primero</option>
          </select>
          <Button onClick={() => setIsAddModalOpen(true)} className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Agregar sitio
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedSites.length === 0 ? (
          <div className="col-span-full py-12 text-center text-neutral-500">
            No se encontraron sitios.
          </div>
        ) : (
          filteredAndSortedSites.map(site => (
            <div 
              key={site.id} 
              className={`group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 ${site.visitado ? 'opacity-70' : ''}`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex-1 truncate pr-4">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 truncate" title={site.nombre}>
                      {site.nombre}
                    </h3>
                    <a 
                      href={site.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-500 hover:underline flex items-center gap-1 truncate"
                    >
                      {site.url}
                      <ExternalLink className="h-3 w-3 inline" />
                    </a>
                  </div>
                  {site.categoria && (
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                      {site.categoria}
                    </span>
                  )}
                </div>
                {site.descripcion && (
                  <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {site.descripcion}
                  </p>
                )}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <div className="text-xs text-neutral-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(site.created_at), { addSuffix: true, locale: es })}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant={site.visitado ? "secondary" : "default"} 
                    size="sm"
                    onClick={() => handleToggleVisited(site)}
                  >
                    {site.visitado ? (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5" /> Visitado
                      </>
                    ) : (
                      'Marcar visitado'
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
                    onClick={() => setEditingSite(site)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => handleDelete(site.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Agregar nuevo sitio"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" name="nombre" placeholder="Ej. Documentación de Next.js" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" name="url" type="url" placeholder="https://..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Input id="descripcion" name="descripcion" placeholder="Breve descripción" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría (opcional)</Label>
            <Input id="categoria" name="categoria" placeholder="Ej. Programación" />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>Guardar</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={!!editingSite} 
        onClose={() => setEditingSite(null)} 
        title="Editar sitio"
      >
        {editingSite && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre</Label>
              <Input id="edit-nombre" name="nombre" defaultValue={editingSite.nombre} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input id="edit-url" name="url" type="url" defaultValue={editingSite.url} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-descripcion">Descripción (opcional)</Label>
              <Input id="edit-descripcion" name="descripcion" defaultValue={editingSite.descripcion || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-categoria">Categoría (opcional)</Label>
              <Input id="edit-categoria" name="categoria" defaultValue={editingSite.categoria || ''} />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setEditingSite(null)}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>Actualizar</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
