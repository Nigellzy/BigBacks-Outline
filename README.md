# FoodSaver App

A Vue.js application designed to help users reduce food waste by tracking food items, managing expiration dates, and discovering recipes for leftover ingredients.

## Features

- **Dashboard**: Track your food inventory with expiration monitoring
- **Recipe Suggestions**: AI-powered recipe recommendations based on available ingredients
- **Chat Interface**: AI assistant to help with food-related questions
- **Community**: Connect with other users to share tips and recipes
- **Analytics**: Visualize your food waste reduction progress
- **Leaderboard**: Compete with friends to minimize food waste
- **Notifications**: Get alerts for expiring food items
- **Profile Management**: Customize your experience and track achievements

## Tech Stack

- **Frontend**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **Styling**: Bootstrap 5
- **Charts**: Chart.js with Vue-ChartJS
- **AI Integration**: Google Generative AI
- **Icons**: Bootstrap Icons

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd foodsaver-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   ├── layout/            # Layout components (Sidebar, Header)
│   └── recipes/           # Recipe-related components
├── composables/           # Vue composables for state management
├── views/                 # Main application views
├── assets/               # Static assets
├── App.vue               # Root component
└── main.js               # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.