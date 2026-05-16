-- Eliminar tabla si existe
drop table if exists sitios_web;

-- Crear tabla sitios_web
create table sitios_web (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  nombre text not null,
  url text not null,
  descripcion text,
  categoria text,
  visitado boolean default false not null,
  fecha_visita timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS (Row Level Security)
alter table sitios_web enable row level security;

-- Políticas de RLS
create policy "Los usuarios pueden ver sus propios sitios"
  on sitios_web for select
  using ( auth.uid() = user_id );

create policy "Los usuarios pueden insertar sus propios sitios"
  on sitios_web for insert
  with check ( auth.uid() = user_id );

create policy "Los usuarios pueden actualizar sus propios sitios"
  on sitios_web for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

create policy "Los usuarios pueden eliminar sus propios sitios"
  on sitios_web for delete
  using ( auth.uid() = user_id );
