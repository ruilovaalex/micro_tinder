const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

const configs = [
  {
    target: path.resolve(projectRoot, '../auth-service/prisma'),
    links: [
      path.resolve(projectRoot, 'dist/apps/auth-service/prisma'),
      path.resolve(projectRoot, 'dist/apps/auth-service/auth-service/prisma'),
    ]
  },
  {
    target: path.resolve(projectRoot, '../tinder-service/prisma'),
    links: [
      path.resolve(projectRoot, 'dist/apps/tinder-service/prisma'),
      path.resolve(projectRoot, 'dist/apps/tinder-service/tinder-service/prisma'),
    ]
  }
];

configs.forEach(({ target, links }) => {
  if (!fs.existsSync(target)) {
    console.error(`Target directory does not exist: ${target}`);
    return;
  }

  links.forEach(link => {
    try {
      if (fs.existsSync(link)) {
        // Remove if it exists to ensure it's fresh
        const stats = fs.lstatSync(link);
        if (stats.isSymbolicLink() || stats.isDirectory()) {
          fs.rmSync(link, { recursive: true, force: true });
        }
      }
      const parent = path.dirname(link);
      if (!fs.existsSync(parent)) {
        fs.mkdirSync(parent, { recursive: true });
      }
      fs.symlinkSync(target, link, 'junction');
      console.log(`Created junction: ${link} -> ${target}`);
    } catch (err) {
      console.error(`Failed to create junction ${link}:`, err.message);
    }
  });
});
