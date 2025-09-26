# Zenith

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/hughsio/zenith-app)

> An elegant storage organization app that uses QR codes to instantly identify the contents of your bins.

Zenith is a minimalist, visually stunning web application designed to bring clarity and order to physical storage. The core concept revolves around 'Bins'—digital representations of any physical storage container like boxes, drawers, or shelves. Users can create Bins, give them names and descriptions, and then populate them with a list of 'Items'. Each Bin is automatically assigned a unique QR code within the app. Users can print this QR code and attach it to the physical container. When the user scans the QR code with their phone's camera, it will instantly open the web app to that specific Bin's page, revealing a clean, easy-to-read list of its contents. This eliminates the need to open and rummage through containers, providing an instant, elegant solution to the question, 'What's in this box?'.

## Key Features

*   **Bin Management**: Create, update, and delete digital 'Bins' to represent your physical storage containers.
*   **Item Tracking**: Add, edit, and remove items within each bin, including names and quantities.
*   **QR Code Generation**: Automatically generates a unique, printable QR code for every bin.
*   **Instant Access**: Scan a bin's QR code with any smartphone to immediately open its content list in the browser.
*   **Responsive Design**: A beautiful, mobile-first interface that works flawlessly on any device.
*   **Minimalist UI**: A clean, modern, and intuitive user experience focused on clarity and ease of use.

## Technology Stack

This project is built with a modern, full-stack TypeScript architecture, leveraging the Cloudflare ecosystem for performance and scalability.

*   **Frontend**:
    *   **Framework**: React (with Vite)
    *   **UI Components**: shadcn/ui
    *   **Styling**: Tailwind CSS
    *   **Animations**: Framer Motion
    *   **State Management**: Zustand
    *   **Data Fetching**: TanStack React Query
    *   **Icons**: Lucide React
*   **Backend**:
    *   **Framework**: Hono on Cloudflare Workers
*   **Storage**:
    *   **Database**: Cloudflare Durable Objects
*   **Language**: TypeScript

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following software installed on your machine:
*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [Bun](https://bun.sh/)
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/zenith_storage.git
    cd zenith_storage
    ```

2.  **Install dependencies:**
    This project uses `bun` for package management.
    ```sh
    bun install
    ```

## Usage

To start the development server, which includes both the Vite frontend and the Wrangler backend, run:

```sh
bun dev
```

This will start the application locally, typically on `http://localhost:3000`. The frontend will hot-reload on changes, and the worker backend will restart automatically.

## Project Structure

The codebase is organized into three main directories:

*   `src/`: Contains the entire React frontend application, including pages, components, hooks, and utility functions.
*   `worker/`: Contains the Hono backend application that runs on Cloudflare Workers, including API routes and Durable Object entity definitions.
*   `shared/`: Contains shared TypeScript types and interfaces used by both the frontend and backend to ensure type safety across the stack.

## Deployment

This application is designed for easy deployment to Cloudflare Pages.

1.  **Log in to Wrangler:**
    Authenticate the Wrangler CLI with your Cloudflare account.
    ```sh
    wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which will build the application and deploy it to your Cloudflare account.
    ```sh
    bun deploy
    ```

Wrangler will handle the process of building the frontend assets, deploying the worker, and configuring the Durable Object bindings.

Alternatively, you can deploy directly from your GitHub repository using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/hughsio/zenith-app)