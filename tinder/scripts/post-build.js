const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

// Copy Prisma generated clients to dist
const prismaConfigs = [
  {
    src: path.resolve(projectRoot, '../auth-service/src/prisma/generated'),
    dst: path.resolve(projectRoot, 'dist/apps/auth-service/prisma/generated'),
  },
  {
    src: path.resolve(projectRoot, '../users-service/src/prisma/generated'),
    dst: path.resolve(projectRoot, 'dist/apps/users-service/prisma/generated'),
  },
  {
    src: path.resolve(projectRoot, '../profiles-service/src/prisma/generated'),
    dst: path.resolve(projectRoot, 'dist/apps/profiles-service/prisma/generated'),
  },
  {
    src: path.resolve(projectRoot, '../interactions-service/src/prisma/generated'),
    dst: path.resolve(projectRoot, 'dist/apps/interactions-service/prisma/generated'),
  },
  {
    src: path.resolve(projectRoot, '../matches-service/src/prisma/generated'),
    dst: path.resolve(projectRoot, 'dist/apps/matches-service/prisma/generated'),
  },
  {
    src: path.resolve(projectRoot, '../messages-service/src/prisma/generated'),
    dst: path.resolve(projectRoot, 'dist/apps/messages-service/prisma/generated'),
  },
  {
    src: path.resolve(projectRoot, '../subscriptions-service/src/prisma/generated'),
    dst: path.resolve(projectRoot, 'dist/apps/subscriptions-service/prisma/generated'),
  },
];

prismaConfigs.forEach(({ src, dst }) => {
  try {
    if (fs.existsSync(src)) {
      const parent = path.dirname(dst);
      if (!fs.existsSync(parent)) {
        fs.mkdirSync(parent, { recursive: true });
      }
      
      // Remove existing destination if it exists
      if (fs.existsSync(dst)) {
        fs.rmSync(dst, { recursive: true, force: true });
      }
      
      // Copy the generated folder
      fs.cpSync(src, dst, { recursive: true, force: true });
      console.log(`✓ Copied Prisma: ${src.split('\\').pop()} -> ${dst.split('\\').pop()}`);
    } else {
      console.warn(`⚠ Prisma source not found: ${src}`);
    }
  } catch (err) {
    console.error(`✗ Failed to copy Prisma ${src}:`, err.message);
  }
});

// Copy contracts to each app for module resolution
const contractsSrc = path.resolve(projectRoot, 'dist/libs/contracts');
const appsToLink = [
  path.resolve(projectRoot, 'dist/apps/auth-service'),
  path.resolve(projectRoot, 'dist/apps/api-gateway'),
  path.resolve(projectRoot, 'dist/apps/users-service'),
  path.resolve(projectRoot, 'dist/apps/profiles-service'),
  path.resolve(projectRoot, 'dist/apps/interactions-service'),
  path.resolve(projectRoot, 'dist/apps/matches-service'),
  path.resolve(projectRoot, 'dist/apps/messages-service'),
  path.resolve(projectRoot, 'dist/apps/subscriptions-service'),
];

appsToLink.forEach(appPath => {
  try {
    const contractsDst = path.join(appPath, '@app');
    if (!fs.existsSync(contractsDst)) {
      fs.mkdirSync(contractsDst, { recursive: true });
    }
    
    const contractsLink = path.join(contractsDst, 'contracts');
    if (fs.existsSync(contractsLink)) {
      const stats = fs.lstatSync(contractsLink);
      if (stats.isSymbolicLink() || stats.isDirectory()) {
        fs.rmSync(contractsLink, { recursive: true, force: true });
      }
    }
    
    // Create symlink/junction to contracts
    if (fs.existsSync(contractsSrc)) {
      fs.symlinkSync(contractsSrc, contractsLink, 'junction');
      console.log(`✓ Linked contracts to ${appPath.split('\\').pop()}`);
    }
  } catch (err) {
    console.error(`✗ Failed to link contracts to ${appPath}:`, err.message);
  }
});

console.log('Post-build complete');
