# Tiago Danin Website
## Project info

**URL**: https://tiagodanin.com/

## How can I edit this code?

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/TiagoDanin/TiagoDanin.github.io.git

# Step 2: Navigate to the project directory.
cd tiagodanin-new-website

# Step 3: Install the necessary dependencies.
yarn install

# Step 4: Start the development server with auto-reloading and an instant preview.
yarn dev
```

## What technologies are used for this project?

This project is built with:

- Next.js with App Router
- TypeScript
- React
- shadcn-ui
- radix-ui
- Tailwind CSS

## Deploy on GitHub Pages

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow is configured in `.github/workflows/deploy.yml`.

When you push changes to the `main` branch, the site will be automatically built and deployed to GitHub Pages.
