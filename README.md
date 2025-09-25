# GrapeLog: A Manifest-Powered React App

Welcome to GrapeLog, a full-stack application for browsing grape varieties and logging personal tasting notes. This application is built entirely with React on the frontend and [Manifest](https://www.mnfst.com/) as the backend.

## Features

- **User Authentication**: Secure sign-up and login for users.
- **Grape Variety Catalog**: View a list of grape varieties, complete with descriptions and photos (managed via the Admin Panel).
- **Personal Tasting Journal**: Authenticated users can create, view, and delete their own tasting notes.
- **Ownership Policies**: Users can only manage their own tasting notes, enforced by Manifest's `condition: self` policy.
- **Auto-Generated Admin Panel**: A complete `/admin` interface for managing all data, including users, grape varieties, and tasting notes.

## Tech Stack

- **Backend**: Manifest (YAML-based configuration)
- **Frontend**: React, Vite
- **Styling**: Tailwind CSS
- **SDK**: `@mnfst/sdk` for all backend communication

## Getting Started

Follow the setup guide to get the application running on your local machine.

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Manifest CLI

### Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install frontend dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Manifest backend**:
    In the project root where `manifest.yml` is located, run:
    ```bash
    mnfst dev
    ```
    This will start the backend server, typically on `http://localhost:3000`.

4.  **Run the React frontend**:
    In a separate terminal, run:
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically on `http://localhost:5173`.

5.  **Access the App**:
    -   Open your browser to `http://localhost:5173` to see the application.
    -   Access the Admin Panel at `http://localhost:3000/admin`.

### Default Credentials

- **Admin User**: `admin@manifest.build` / `admin`

You can use these credentials to log into the Admin Panel and the demo mode of the main application.
