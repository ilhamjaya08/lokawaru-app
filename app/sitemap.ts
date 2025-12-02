import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

function findPageRoutes(
  dir: string,
  baseDir: string,
  pages: string[] = []
): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'api') {
        findPageRoutes(fullPath, baseDir, pages);
      }
    } else if (file === 'page.tsx') {
      const routePath = path
        .relative(baseDir, fullPath)
        .replace(/\\/g, '/')
        .replace(/page\.tsx$/, '')
        .replace(/\/$/, '');
      
      pages.push(routePath === '' ? '/' : `/${routePath}`);
    }
  });

  return pages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const appDirectory = path.join(process.cwd(), 'app');
  const routes = findPageRoutes(appDirectory, appDirectory);
  const siteUrl = process.env.BASE_URL;

  if (!siteUrl) {
    throw new Error('BASE_URL environment variable is not set. Please add it to your .env file.');
  }

  return routes.map((route) => {
    return {
      url: `${siteUrl}${route === '/' ? '' : route}`,
      lastModified: new Date().toISOString(),
    };
  });
}