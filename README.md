# Sven Maibaum Portfolio

This repository contains the source code for **sven-maibaum.com**, a personal portfolio website for software architect and game developer Sven Maibaum. The site is entirely static and is intended to be served via GitHub Pages or any static file host.

## Directory structure

```
assets/  # images and other assets
pages/   # additional HTML pages
css/     # global stylesheets
js/      # JavaScript files
index.html
sitemap.xml
CNAME     # custom domain configuration for GitHub Pages
```

## Local preview

You can preview the site locally using any static file server. A quick way is to use Python's built-in HTTP server:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Stop the server with `Ctrl+C` when you're done.

## Deployment

The site is designed for deployment with GitHub Pages:

1. Push your changes to the `main` branch of this repository.
2. Enable **GitHub Pages** in the repository settings and choose the `main` branch as the source.
3. If you use a custom domain, ensure the desired domain is set in the `CNAME` file and configured with your DNS provider.

Once GitHub Pages is configured, updates pushed to `main` will automatically be published.