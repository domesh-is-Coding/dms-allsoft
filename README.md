# Document Management System (DMS)

A modern React-based Document Management System built with Vite, featuring OTP authentication, document upload, and search capabilities.

## 🚀 Live Demo

[View Live Application](https://dms-wine.vercel.app/)

## Features

- **OTP-based Authentication**: Secure login using mobile number verification
- **Document Upload**: Upload PDF and image files with metadata (date, category, tags, remarks)
- **Document Search**: Advanced search and filtering of documents
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar
- **Protected Routes**: Authentication-based access control
- **Modern UI**: Built with Tailwind CSS and Radix UI components

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **UI Components**: Radix UI
- **Testing**: Vitest, Testing Library
- **Linting**: ESLint

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/domesh-is-Coding/dms-allsoft.git
   cd dms-allsoft
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```
   VITE_BACKEND_BASE_URL=https://apis.allsoft.co/api
   ```

## Environment Variables

The application uses the following environment variable:

- `VITE_BACKEND_BASE_URL`: Base URL for the backend API (default: `https://apis.allsoft.co/api`)

## Running the Application

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Testing

Run tests:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── ProtectedRoute.jsx
│   ├── PublicRoute.jsx
│   ├── Sidebar.jsx
│   └── Topbar.jsx
├── layout/             # Layout components
│   └── Layout.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── AdminCreateUser.jsx
│   ├── SearchDocument.jsx
│   └── UploadDocument.jsx
├── store/              # State management
│   └── auth.js         # Authentication store
├── lib/                # Utilities
│   └── utils.js
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## API Endpoints

The application communicates with the following backend endpoints:

- `POST /documentManagement/generateOTP` - Generate OTP for login
- `POST /documentManagement/validateOTP` - Validate OTP and login
- `POST /documentManagement/documentTags` - Fetch tag suggestions
- `POST /documentManagement/saveDocumentEntry` - Upload document
- `POST /documentManagement/searchDocumentEntry` - Search documents

## Usage

1. **Login**: Enter your mobile number to receive an OTP, then verify to log in
2. **Upload Document**: Fill in document details, select category/sub-category, add tags, and upload files
3. **Search Document**: Use filters to search and view uploaded documents
4. **Admin User**: Placeholder page for user management (not implemented)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is private and proprietary.
