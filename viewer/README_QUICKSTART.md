# Esperanto Data Viewer - Quick Start

Modern Next.js web application for viewing and analyzing Esperanto study ChatGPT conversation data.

## Quick Start

### 1. Install Dependencies

```bash
cd viewer
npm install
```

### 2. Prepare Data

The data file has already been copied to `public/data/matched_conversations.json`. If you need to update it:

```bash
cp ../output/all_matched_conversations.json public/data/matched_conversations.json
```

### 3. Run the Viewer

```bash
npm run dev
```

The viewer will open at **http://localhost:3000**

## Features

### 📊 Overview Tab
- Quick statistics on conversations, participants, and matching methods
- Visual charts showing match confidence distribution
- Timeline of conversation activity

### 💬 Conversations Tab
- Browsable list of all conversations
- Sortable table with key information
- Quick view of first user message

### 👥 Participants Tab
- Summary of all participants
- Conversation counts per participant
- Match method and confidence breakdowns

### 📈 Analytics Tab
- Detailed charts and visualizations
- Temporal patterns
- Match quality analysis

### 🔎 Search Tab
- Search across conversations, participants, and messages
- Export filtered results to CSV

## Sidebar Filters

- **📁 CSN Folder**: Filter by specific folder (CSN1-CSN22)
- **🔍 Match Method**: Filter by how conversations were matched
  - `explicit_id` / `direct_id`: Participant mentioned their ID
  - `timestamp_proximity`: Matched by our smart algorithm
  - Other legacy methods
- **⭐ Match Confidence**: Filter by confidence level
  - **High**: Within 15 minutes of scheduled time ✓
  - **Medium**: Within 15-45 minutes ~
  - **Low**: Within 45-120 minutes ⚠
- **👤 Participant ID**: Filter to specific participant
- **📅 Date Range**: Filter by conversation creation date

## Data Overview

- **Total Conversations**: 736 matched
- **Total Participants**: 228
- **Match Rate**: 92.9%
- **Date Range**: November-December 2024

## Understanding Match Confidence

Each conversation has a confidence indicator:

- **High (✓)**: Conversation created within 15 minutes of participant's scheduled time - highest reliability
- **Medium (~)**: Conversation created within 15-45 minutes - good reliability
- **Low (⚠)**: Conversation created within 45-120 minutes - acceptable but less certain

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Troubleshooting

### Data Not Loading

If you see "No data found":

1. Ensure you're in the `viewer` directory
2. Check that `public/data/matched_conversations.json` exists
3. Verify the file is not empty (should be ~18MB)
4. Refresh the page

### Port Already in Use

If port 3000 is busy:

```bash
npm run dev -- -p 3001
```

Then open http://localhost:3001

### Build for Production

```bash
npm run build
npm run start
```

## File Structure

```
viewer/
├── app/
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── FilterSidebar.tsx  # Sidebar filters
│   ├── TabNavigation.tsx  # Tab navigation
│   ├── MetricCard.tsx     # Metric display cards
│   ├── ConfidenceBar.tsx  # Confidence indicators
│   └── tabs/              # Tab content components
│       ├── OverviewTab.tsx
│       ├── ConversationsTab.tsx
│       ├── ParticipantsTab.tsx
│       ├── AnalyticsTab.tsx
│       └── SearchTab.tsx
├── lib/
│   ├── types.ts           # TypeScript type definitions
│   └── dataLoader.ts      # Data loading and filtering logic
└── public/
    └── data/
        └── matched_conversations.json  # Your data file
```

## Tips

1. **Use Filters**: Combine multiple filters to drill down to specific data
2. **Export Data**: Use the Search tab to export filtered subsets to CSV
3. **Check Confidence**: Pay attention to match confidence when analyzing timestamp-matched conversations
4. **Active Filters**: View and clear active filters in the sidebar footer

## Support

For issues with the matching algorithm or data structure, refer to:
- `../MATCHING_SOLUTION_SUMMARY.md` - Algorithm details
- `../QUICK_START_GUIDE.md` - General data guide

---

**Last Updated**: 2025-10-31
**Viewer Version**: 2.0
**Data Version**: Comprehensive matched dataset (92.9% match rate)
