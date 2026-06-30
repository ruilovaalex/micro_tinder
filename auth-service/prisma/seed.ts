import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from './generated/client';

const connectionString = process.env.AUTH_DATABASE_URL;
if (!connectionString) {
  throw new Error('AUTH_DATABASE_URL is not defined');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const permissionsByRole: Record<UserRole, string[]> = {
  ADMIN: [
    'auth:me',
    'auth:logout',
    'user:list',
    'user:view',
    'profile:create',
    'profile:view',
    'profile:update',
    'interaction:create',
    'interaction:view',
    'match:view',
    'message:create',
    'message:view',
    'subscription:view',
    'subscription:update',
  ],
  USER: [
    'auth:me',
    'auth:logout',
    'user:view',
    'profile:create',
    'profile:view',
    'profile:update',
    'interaction:create',
    'interaction:view',
    'match:view',
    'message:create',
    'message:view',
    'subscription:view',
    'subscription:update',
  ],
};

const permissionDescriptions: Record<string, string> = {
  'auth:me': 'Ver la sesion actual',
  'auth:logout': 'Cerrar la sesion actual',
  'user:list': 'Listar todos los usuarios',
  'user:view': 'Ver un usuario por id',
  'profile:create': 'Crear perfil',
  'profile:view': 'Ver perfiles',
  'profile:update': 'Actualizar perfil',
  'interaction:create': 'Crear likes, dislikes o superlikes',
  'interaction:view': 'Ver interacciones propias',
  'match:view': 'Ver matches',
  'message:create': 'Enviar mensajes',
  'message:view': 'Ver mensajes',
  'subscription:view': 'Ver suscripcion',
  'subscription:update': 'Actualizar suscripcion',
};

async function main() {
  const uniquePermissions = Array.from(
    new Set(Object.values(permissionsByRole).flat()),
  );

  for (const name of uniquePermissions) {
    await prisma.permission.upsert({
      where: { name },
      update: {
        description: permissionDescriptions[name],
      },
      create: {
        name,
        description: permissionDescriptions[name],
      },
    });
  }

  for (const role of Object.values(UserRole)) {
    const rolePermissions = permissionsByRole[role];
    const permissions = await prisma.permission.findMany({
      where: {
        name: { in: rolePermissions },
      },
      select: { id: true, name: true },
    });

    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          role_permissionId: {
            role,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          role,
          permissionId: permission.id,
        },
      });
    }

    await prisma.rolePermission.deleteMany({
      where: {
        role,
        permission: {
          name: {
            notIn: rolePermissions,
          },
        },
      },
    });
  }
}

main()
  .catch((error) => {
    console.error('RBAC seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
