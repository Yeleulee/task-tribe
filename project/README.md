# TaskTribe

TaskTribe is a modern task management and productivity application that helps you collaborate with your team.

## Features

- User authentication and profile management
- Task creation, management, and tracking
- Team collaboration features
- Smart task organization with AI assistance
- Progress tracking and analytics
- Real-time updates and notifications

## Technology Stack

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Firebase for backend services
- Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/task-tribe.git
   cd task-tribe
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase environment variables:
   ```
   node setup-env.js
   ```
   This script will guide you through creating a `.env.local` file with your Firebase configuration.

   Alternatively, you can create the `.env.local` file manually with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Firebase Setup

For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

## Environment Variables

The application uses the following environment variables:

| Variable | Description |
|----------|-------------|
| VITE_FIREBASE_API_KEY | Firebase API Key |
| VITE_FIREBASE_AUTH_DOMAIN | Firebase Auth Domain |
| VITE_FIREBASE_PROJECT_ID | Firebase Project ID |
| VITE_FIREBASE_STORAGE_BUCKET | Firebase Storage Bucket |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Firebase Messaging Sender ID |
| VITE_FIREBASE_APP_ID | Firebase App ID |
| VITE_FIREBASE_MEASUREMENT_ID | Firebase Measurement ID (for Analytics) |

⚠️ **IMPORTANT**: Never commit your `.env.local` file to Git. It contains sensitive information.

## Development

### Directory Structure

- `src/` - Source code
  - `components/` - React components
  - `context/` - React contexts for state management
  - `hooks/` - Custom React hooks
  - `pages/` - Page components
  - `config/` - Configuration files
  - `utils/` - Utility functions

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/) 