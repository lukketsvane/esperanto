# Esperanto Study Data Viewer - Next.js

An interactive, modern web application for exploring and analyzing the Esperanto study ChatGPT conversation dataset. Built with Next.js, React, and TypeScript.

## Features

- **📊 Interactive Dashboard** - Real-time visualizations and metrics
- **🔍 Advanced Filtering** - Filter by folder, match method, and confidence threshold
- **💬 Conversation Browser** - Sortable table with detailed conversation view
- **👥 Participant Analytics** - Comprehensive participant-level statistics
- **📈 Analytics & Insights** - Confidence tiers, message statistics, temporal trends
- **🔎 Full-Text Search** - Search across titles, messages, and participant IDs
- **⚡ Fast & Responsive** - Client-side filtering and instant updates
- **🎨 Modern UI** - Built with Tailwind CSS and Recharts visualizations

## Quick Start

### Prerequisites

- Node.js 18+ and npm (or yarn)
- The dataset file (`matched_conversations.json`)

### Installation

1. **Navigate to the viewer directory:**
   ```bash
   cd viewer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the data:**
   ```bash
   # Create the public data directory
   mkdir -p public/data

   # Copy the dataset from the parent directory
   cp ../output/matched_conversations.json public/data/
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Building for Production

### Static Export (Recommended)

Build a static site that can be hosted anywhere:

```bash
# Build the static site
npm run build

# The output will be in the 'out' directory
# You can serve it with any static file server:
npx serve out
```

### Deploy Options

**GitHub Pages:**
```bash
npm run build
# Deploy the 'out' directory to GitHub Pages
```

**Vercel (easiest):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Netlify:**
```bash
# Drag and drop the 'out' folder to Netlify
# Or use Netlify CLI
```

**Self-hosted:**
```bash
# Copy the 'out' directory to your web server
cp -r out /var/www/html/esperanto-viewer
```

## Project Structure

```
viewer/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
│
├── components/
│   ├── FilterSidebar.tsx   # Filter controls
│   ├── TabNavigation.tsx   # Tab switcher
│   ├── MetricCard.tsx      # Metric display card
│   ├── ConfidenceBar.tsx   # Confidence visualization
│   └── tabs/
│       ├── OverviewTab.tsx      # Overview with charts
│       ├── ConversationsTab.tsx # Conversation browser
│       ├── ParticipantsTab.tsx  # Participant analysis
│       ├── AnalyticsTab.tsx     # Advanced analytics
│       └── SearchTab.tsx        # Search interface
│
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   └── dataLoader.ts       # Data loading and filtering logic
│
├── public/
│   └── data/
│       └── matched_conversations.json  # Dataset (you add this)
│
├── package.json
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Usage Guide

### Tab Overview

#### 📊 Overview Tab
- **Key Metrics**: Total conversations, participants, folders, high-confidence matches
- **Visualizations**:
  - Match method distribution (pie chart)
  - Confidence score distribution (bar chart)
  - Conversations per folder (bar chart)

#### 💬 Conversations Tab
- Browse all conversations in a sortable table
- Sort by: time, confidence, message count, title
- Click any row to see detailed information
- View first message preview and conversation metadata

#### 👥 Participants Tab
- Complete participant summary table
- Conversation count per participant
- Total messages (user and assistant)
- Average confidence scores
- Top 20 most active participants chart

#### 📈 Analytics Tab
- **Confidence Tier Breakdown**:
  - Excellent (0.95-1.00)
  - High (0.80-0.94)
  - Medium (0.60-0.79)
  - Low (0.40-0.59)
  - Very Low (0.01-0.39)
  - Unmatched (0.00)
- **Message Statistics**: Totals and averages
- **Temporal Distribution**: Conversations over time

#### 🔎 Search Tab
- Search across:
  - Conversation titles
  - First user messages
  - Participant IDs
- Case-insensitive matching
- Works with active filters

### Filtering

Use the sidebar to filter the dataset:

1. **Study Folder**: Select a specific CSN folder or "All"
2. **Match Method**: Filter by matching algorithm used
3. **Minimum Confidence**: Use the slider to set confidence threshold (0.0 - 1.0)

All tabs update automatically when filters change.

## Development

### Running in Development Mode

```bash
npm run dev
```

The app will reload automatically when you make changes.

### Linting

```bash
npm run lint
```

### Type Checking

TypeScript will check types during development and build.

## Technologies Used

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Recharts](https://recharts.org/)** - Data visualization
- **[Lucide React](https://lucide.dev/)** - Icons
- **[date-fns](https://date-fns.org/)** - Date formatting

## Performance

- **Client-side rendering**: Fast, responsive UI with no server required
- **Static export**: Can be hosted on any static file server
- **Optimized filtering**: Efficient data operations in the browser
- **Lazy loading**: Components load only when needed

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Data file not found

**Problem**: Error message about missing data file

**Solution**:
```bash
# Ensure data directory exists
mkdir -p public/data

# Copy the dataset
cp ../output/matched_conversations.json public/data/
```

### Port already in use

**Problem**: Port 3000 is already in use

**Solution**:
```bash
# Run on a different port
npm run dev -- -p 3001
```

### Build fails

**Problem**: TypeScript or build errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Slow performance

**Problem**: App feels slow with large dataset

**Solution**:
- Use filters to reduce dataset size
- Consider implementing pagination for large tables
- Use production build (`npm run build`) instead of dev mode

## Customization

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Add your custom colors here
      },
    },
  },
},
```

### Adding New Features

1. Create new components in `components/`
2. Add new tabs in `components/tabs/`
3. Update `app/page.tsx` to include new tabs
4. Add new data processing in `lib/dataLoader.ts`

## Data Format

The viewer expects a JSON file with an array of conversation objects:

```json
[
  {
    "folder": "CSN15",
    "conv_index": 0,
    "conv_title": "Learning Esperanto",
    "matched_participant_id": "01122024_1500_11",
    "match_method": "direct_id",
    "match_confidence": 0.95,
    "create_dt": "20241202",
    "create_time": "15:30:45",
    "user_msg_count": 12,
    "assistant_msg_count": 12,
    "total_user_chars": 523,
    "total_assistant_chars": 1842,
    "first_user_msg": "Can you help me learn Esperanto?"
  }
]
```

## Comparison with Other Viewers

| Feature | Next.js Viewer | Streamlit Viewer | CLI Explorer |
|---------|---------------|------------------|--------------|
| **UI Type** | Modern web app | Python web app | Command line |
| **Setup** | npm install | pip install | No install |
| **Speed** | Very fast | Medium | Instant |
| **Visualizations** | Interactive charts | Interactive charts | Text-based |
| **Hosting** | Any web server | Python server | N/A |
| **Best For** | Production use | Python users | Quick queries |

## License

This viewer is part of the Esperanto Study Dataset repository.

## Support

For issues or questions:
1. Check this README
2. Review the main repository documentation
3. Check browser console for errors

## Contributing

Improvements welcome! Consider:
- Adding new visualizations
- Implementing data export features
- Improving mobile responsiveness
- Adding more analytics

---

**Built with ❤️ using Next.js and React**
