# Quick Start Guide

Get your Business Analytics Platform up and running in minutes!

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Backend API server running (see backend documentation)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- React Router
- Tailwind CSS
- Recharts
- Axios
- Socket.io Client
- React Query

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the values in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_ENV=development
```

### 3. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 4. Login

Use the demo credentials (or your actual credentials):
- **Email**: demo@example.com
- **Password**: demo123

## Testing the Application

### 1. Dashboard Navigation
- Click on different menu items in the sidebar
- Explore Marketing, Sales, Finance, and Analytics dashboards

### 2. Chat Interface
- Click the chat icon in the header to open the chat
- Try asking suggested questions
- Type your own questions about the data

### 3. Data Sync
- Click the refresh icon in the header
- Watch the sync status indicator
- Data should update automatically

## Expected Data Format

### Marketing Data
```json
{
  "kpis": {
    "totalSpend": 50000,
    "roas": 4.5,
    "avgCpc": 1.25,
    "ctr": 0.035
  },
  "spendOverTime": [
    { "date": "2024-01-01", "spend": 5000 },
    { "date": "2024-01-02", "spend": 5200 }
  ]
}
```

### Sales Data
```json
{
  "kpis": {
    "totalSales": 225000,
    "totalOrders": 450,
    "avgOrderValue": 500,
    "conversionRate": 0.025
  },
  "salesOverTime": [
    { "date": "2024-01-01", "sales": 15000, "orders": 30 }
  ]
}
```

### Finance Data
```json
{
  "kpis": {
    "revenue": 300000,
    "totalCosts": 180000,
    "profitMargin": 0.4,
    "cashFlow": 50000
  }
}
```

## Common Tasks

### Adding New Features

1. **Add a new chart to a dashboard:**
   ```jsx
   import LineChart from '../components/charts/LineChart';

   <LineChart
     data={myData}
     lines={[{ dataKey: 'value', stroke: '#3b82f6' }]}
     xAxisKey="date"
   />
   ```

2. **Create a new dashboard:**
   - Add component in `src/components/dashboard/`
   - Create page in `src/pages/`
   - Add route in `src/App.jsx`
   - Add to sidebar navigation

3. **Customize colors:**
   - Edit `tailwind.config.js`
   - Update `src/utils/constants.js` CHART_COLORS

### Debugging

Enable debugging in browser console:

```javascript
// Add to any component
console.log('Data:', data);
console.log('Loading:', isLoading);
console.log('Error:', error);
```

Use React DevTools:
- Install React DevTools browser extension
- Inspect component props and state
- Check context values

## Production Build

### Build for production:

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview production build:

```bash
npm run preview
```

### Deploy to hosting:

1. **Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify:**
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

3. **Manual deployment:**
   - Copy `dist/` folder to your web server
   - Configure server to serve `index.html` for all routes

## Troubleshooting

### Issue: Cannot connect to API

**Solution:**
1. Check if backend server is running
2. Verify VITE_API_URL in `.env`
3. Check browser console for CORS errors
4. Ensure backend allows your origin

### Issue: Charts not displaying

**Solution:**
1. Check data format matches expected structure
2. Verify data is not null/undefined
3. Check browser console for errors
4. Ensure Recharts is properly installed

### Issue: Chat not working

**Solution:**
1. Verify backend chat endpoint is working
2. Check network tab for API calls
3. Ensure chat service is configured correctly
4. Check browser console for errors

### Issue: Authentication fails

**Solution:**
1. Verify credentials are correct
2. Check backend authentication endpoint
3. Clear browser localStorage
4. Check network tab for 401 errors

### Issue: Real-time updates not working

**Solution:**
1. Check Socket.io server is running
2. Verify VITE_SOCKET_URL in `.env`
3. Check browser console for connection errors
4. Ensure backend has Socket.io configured

## Next Steps

1. **Integrate with your backend:**
   - Update API endpoints to match your backend
   - Adjust data formats as needed
   - Configure authentication

2. **Customize for your brand:**
   - Update colors in Tailwind config
   - Change logo and branding
   - Adjust dashboard layouts

3. **Add more features:**
   - Export to PDF functionality
   - Email reports
   - Data filtering and date pickers
   - User preferences
   - Dark mode

4. **Optimize performance:**
   - Add lazy loading for routes
   - Implement virtual scrolling
   - Add service worker for PWA
   - Optimize bundle size

## Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [React Router](https://reactrouter.com/)
- [React Query](https://tanstack.com/query)

## Getting Help

- Check the main README.md for detailed documentation
- Review component code for examples
- Check browser console for errors
- Contact development team for support

---

Happy coding! 🚀
