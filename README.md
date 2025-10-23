# Business Analytics Platform - Frontend

A comprehensive React-based business analytics platform with AI-powered chat interface for analyzing Marketing, Sales, and Finance data.

## Features

- **Multi-Dashboard Interface**: Separate dashboards for Marketing, Sales, Finance, and Cross-Channel Analytics
- **AI Chat Assistant**: Real-time chat interface with context-aware AI agents
- **Real-time Updates**: Socket.io integration for live data synchronization
- **Interactive Charts**: Beautiful visualizations using Recharts
- **Authentication**: Secure login with JWT tokens
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **State Management**: Context API with custom hooks
- **Data Caching**: React Query for efficient data fetching and caching

## Tech Stack

- **React 18** - UI framework
- **React Router v6** - Navigation and routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Query** - Data fetching and caching
- **Vite** - Build tool and dev server

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (Header, Sidebar, etc.)
│   ├── chat/            # Chat interface components
│   ├── charts/          # Chart components (Line, Bar, Pie, etc.)
│   ├── dashboard/       # Dashboard-specific components
│   └── auth/            # Authentication components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API services
├── utils/               # Utility functions
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   VITE_ENV=development
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features Breakdown

### 1. Dashboard Views

#### Main Dashboard
- Overview of all business metrics
- KPI cards showing key performance indicators
- Revenue trends and performance charts
- Quick insights and recommendations

#### Marketing Dashboard
- Marketing spend tracking
- Campaign performance analysis
- ROI by channel
- Meta Ads and Google Ads integration
- Channel comparison

#### Sales Dashboard
- Sales trends over time
- Top products by revenue
- Sales by channel breakdown
- Conversion funnel visualization
- Top customers table with LTV

#### Finance Dashboard
- Revenue vs costs comparison
- P&L statement
- Budget vs actual analysis
- Cash flow tracking
- Cost breakdown by category

#### Cross-Channel Analytics
- Multi-touch attribution
- ROI comparison across channels
- Customer Acquisition Cost (CAC) trends
- Customer Lifetime Value (LTV) analysis
- Cohort retention heatmap

### 2. AI Chat Interface

The chat interface provides context-aware assistance for data analysis:

- **Suggested Questions**: Pre-configured questions for each area
- **Natural Language Queries**: Ask questions in plain language
- **Visual Responses**: Embedded charts and tables in responses
- **Context Awareness**: Chat knows which dashboard you're viewing
- **Real-time Responses**: Streaming responses from AI agents

### 3. Real-time Data Sync

- Automatic data refresh via Socket.io
- Visual sync status indicator
- Manual sync trigger
- Last updated timestamp

### 4. Authentication

- Secure JWT-based authentication
- Protected routes
- Automatic token refresh
- Login/logout functionality

## Component Documentation

### Context Providers

#### AuthContext
Manages user authentication state and operations.
```jsx
const { user, isAuthenticated, login, logout } = useAuth();
```

#### DataContext
Handles data fetching and caching for all dashboards.
```jsx
const {
  marketingData,
  salesData,
  fetchMarketingData,
  syncAllData
} = useData();
```

#### ChatContext
Manages chat messages and AI interactions.
```jsx
const {
  messages,
  sendMessage,
  isTyping,
  getSuggestedQuestions
} = useChat();
```

### Custom Hooks

- `useAuth()` - Authentication operations
- `useData()` - Data fetching and management
- `useChat()` - Chat operations
- `useSocket()` - WebSocket connection management

### Chart Components

All chart components accept standardized props:
```jsx
<LineChart
  data={chartData}
  lines={[
    { dataKey: 'revenue', stroke: '#3b82f6', name: 'Revenue' }
  ]}
  xAxisKey="date"
  height={300}
/>
```

## API Integration

### Expected Backend Endpoints

```
Authentication:
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

Dashboard Data:
GET  /api/dashboard/kpis
GET  /api/dashboard/marketing
GET  /api/dashboard/sales
GET  /api/dashboard/finance
GET  /api/dashboard/cross-analysis

Chat:
POST /api/chat/ask
GET  /api/chat/history/:userId

Data Sync:
GET  /api/data/sync/status
POST /api/data/sync/all
```

### Socket.io Events

```javascript
// Client listens for:
- 'connect'
- 'disconnect'
- 'data_updated'
- 'sync_status'
- 'chat_response'
- 'notification'

// Client emits:
- Custom events as needed
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Socket.io server URL | `http://localhost:5000` |
| `VITE_ENV` | Environment | `development` |

## Customization

### Adding New Dashboard

1. Create dashboard component in `src/components/dashboard/`
2. Create page component in `src/pages/`
3. Add route in `src/App.jsx`
4. Add navigation item in `src/components/common/Sidebar.jsx`
5. Update constants in `src/utils/constants.js`

### Adding New Chart Type

1. Create chart component in `src/components/charts/`
2. Import and use in dashboard components
3. Follow existing chart component patterns

### Customizing Theme

Edit Tailwind colors in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { ... },
      secondary: { ... }
    }
  }
}
```

## Performance Optimization

- React Query caching (5 min stale time)
- Lazy loading for routes (can be added)
- Memoized components where needed
- Debounced API calls
- Virtual scrolling for large lists (can be added)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **Charts not rendering**
   - Ensure data format matches expected structure
   - Check console for errors
   - Verify Recharts is installed

2. **Authentication errors**
   - Check API URL in `.env`
   - Verify backend is running
   - Check token expiration

3. **Socket connection issues**
   - Verify Socket.io URL in `.env`
   - Check backend Socket.io server
   - Check browser console for connection errors

## Development Tips

1. Use React DevTools for debugging
2. Check Network tab for API calls
3. Use Redux DevTools for state inspection (if added)
4. Enable React Query DevTools in development
5. Check browser console for errors

## Contributing

1. Follow the existing code structure
2. Use TypeScript types (if migrating to TS)
3. Write meaningful commit messages
4. Test thoroughly before committing
5. Update documentation as needed

## License

MIT License

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check documentation

---

Built with React and love by the development team.
