# Deployment Guide for Namecheap Hosting

This guide explains how to deploy your Angular application to Namecheap hosting (cPanel).

## Prerequisites

1.  **Node.js**: Ensure Node.js is enabled in your cPanel.
    -   Go to cPanel > **Setup Node.js App**.
    -   Create a new application.
    -   **Node.js Version**: Select 18.x or 20.x.
    -   **Application Mode**: Production.
    -   **Application Root**: e.g., `portfolio`.
    -   **Application URL**: Select your domain.
    -   **Application startup file**: `server.js` (or `app.js` which imports `server.js`).

## Deployment Steps

### Option 1: Uploading Built Files (Static Hosting)

If you just want to host the static files (no Node.js server required):

1.  Run `npm run build` locally.
2.  Compress the contents of `dist/jahidur-portfolio/browser` into a ZIP file.
3.  Upload the ZIP to your `public_html` (or subdomain folder) in cPanel File Manager.
4.  Extract the files.
5.  **Important**: Ensure `index.html` is in the root of your domain folder.
6.  **Routing**: For Angular routing to work on refresh, create a `.htaccess` file in the same folder with:

    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>
    ```

### Option 2: Running as a Node.js App (Recommended)

This method uses the included `server.js` to serve the app, which handles routing automatically.

1.  **Upload Files**:
    -   Upload your entire project folder (excluding `node_modules` and `dist`) to the **Application Root** you defined in cPanel (e.g., `/home/username/portfolio`).
    -   Or, if you built locally, upload the `dist` folder as well.

2.  **Install Dependencies**:
    -   In the "Setup Node.js App" page in cPanel, click **Run NPM Install**.
    -   Alternatively, SSH into your server, enter the virtual environment (command provided in cPanel), and run `npm install`.

3.  **Build the App** (if you didn't upload `dist`):
    -   SSH into the server.
    -   Run `npm run build`.
    -   This will generate the `dist/jahidur-portfolio/browser` folder.

4.  **Start the App**:
    -   In cPanel, click **Restart Application**.
    -   The app should now be live.

## Troubleshooting

-   **500 Error**: Check the `stderr.log` in your application root.
-   **"Dist folder not found"**: Ensure `npm run build` has been run and the `dist` folder exists.
-   **Port Issues**: The `server.js` automatically uses `process.env.PORT`, which cPanel provides. Do not hardcode the port.

## Key Files

-   `server.js`: The Node.js Express server that serves the Angular app.
-   `app.js`: Entry point wrapper (imports `server.js`).
-   `package.json`: Contains dependencies and scripts (`start`, `build`).
-   `angular.json`: Angular build configuration.
