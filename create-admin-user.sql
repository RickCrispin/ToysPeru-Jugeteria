-- Script para crear un usuario ADMINISTRADOR de prueba
-- Ejecutar en Supabase SQL Editor

-- Nota: Primero debes tener creado un usuario en auth.users
-- Este script actualiza su perfil para darle rol de admin

-- Reemplaza el email según sea necesario
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@example.com';

-- Verificar que se actualizó correctamente
SELECT email, role, nombre FROM public.profiles WHERE email = 'admin@example.com';

-- Alternativamente, si necesitas crear el admin desde cero con la función RPC:
SELECT public.create_profile_on_signup(
  'admin-uuid-aqui',  -- Reemplazar con el UUID real del usuario
  'admin@example.com',
  'Admin',
  'Usuario',
  'Perú',
  'Lima',
  '+51900000000'
);

-- Luego actualizar el rol a admin:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@example.com';
