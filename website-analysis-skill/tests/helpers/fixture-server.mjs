import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function startFixtureServer(root) {
  let origin = '';
  const server = createServer(async (request, response) => {
    const url = new URL(request.url, origin || 'http://127.0.0.1');
    if (url.pathname === '/robots.txt') {
      response.writeHead(200, { 'content-type': 'text/plain' });
      response.end(`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
      return;
    }
    if (url.pathname === '/sitemap.xml') {
      response.writeHead(200, { 'content-type': 'application/xml' });
      response.end(`<?xml version="1.0"?><urlset><url><loc>${origin}/</loc></url><url><loc>${origin}/services</loc></url><url><loc>${origin}/contact</loc></url></urlset>`);
      return;
    }
    if (url.pathname === '/missing' || url.pathname === '/old') {
      response.writeHead(404, { 'content-type': 'text/html' });
      response.end('<!doctype html><title>Missing</title><h1>Missing</h1>');
      return;
    }
    const mapping = { '/': 'index.html', '/services': 'services.html', '/contact': 'contact.html', '/blog/lorem': 'blog/lorem.html' };
    const relative = mapping[url.pathname];
    if (!relative) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    try {
      const content = await readFile(path.join(root, relative));
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'x-fixture': 'fictional' });
      response.end(content);
    } catch {
      response.writeHead(500);
      response.end('Fixture error');
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  origin = `http://127.0.0.1:${address.port}`;
  return { origin, close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
}
