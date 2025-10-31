# 🎉 Esperanto Study Data Analysis - Complete Solution

## Overview

Complete end-to-end solution for matching and analyzing Esperanto language learning study ChatGPT conversations. Successfully matched 92.9% of conversations to participants, including those where participants forgot to mention their IDs (~20% of cases).

## 📊 Quick Stats

- **Total Conversations**: 736 matched (out of 792 total)
- **Match Rate**: 92.9%
- **Total Participants**: 228
- **CSN Folders**: 22
- **Date Range**: November-December 2024

## 🚀 Quick Start

### View the Data (Recommended!)

```bash
cd viewer
npm install  # First time only
npm run dev
```

**Open**: http://localhost:3000

You now have a beautiful, interactive web interface to explore all the data!

### Re-run Matching (If Needed)

```bash
python3 smart_participant_matcher.py
python3 generate_final_summary.py
```

## 📁 Project Structure

```
esperanto/
├── viewer/                                    # ⭐ Next.js Web Viewer (USE THIS!)
│   ├── app/, components/, lib/                # UI components
│   ├── public/data/matched_conversations.json # Your data (33MB)
│   └── README_QUICKSTART.md                   # Viewer guide
│
├── output/                                    # Generated data files
│   ├── all_matched_conversations.json         # Main dataset (736 convs)
│   ├── newly_matched_conversations.json       # Timestamp-matched (339)
│   ├── still_unmatched_conversations.json     # Unmatched (56)
│   ├── final_participant_summary_complete.json# Participant stats
│   └── final_statistics_report.json           # Overall stats
│
├── promptdata/                                # Raw ChatGPT export data
│   ├── CSN1/, CSN2/, ..., CSN22/              # One folder per participant
│   └── user.json, conversations.json          # ChatGPT exports
│
├── context/                                   # Study materials
│   └── *.pdf, *.docx                          # Esperanto lessons, instructions
│
├── smart_participant_matcher.py               # ⭐ Core matching algorithm
├── generate_final_summary.py                  # Summary generation
│
└── Documentation
    ├── VIEWER_SETUP_COMPLETE.md               # This setup summary
    ├── MATCHING_SOLUTION_SUMMARY.md           # Algorithm details
    └── QUICK_START_GUIDE.md                   # Data analysis guide
```

## 🎯 The Problem We Solved

About 20% of participants (~395 conversations) forgot to mention their unique IDs at the start of their ChatGPT conversations. This made it impossible to match those conversations to specific participants using the original approach.

## ✨ The Solution

### Smart Timestamp-Based Matching

Created an intelligent algorithm (`smart_participant_matcher.py`) that:

1. **Parses participant IDs** (format: `DDMMYYYY_HHMM_XX`)
   - Extracts date, time, and CSN folder number

2. **Matches conversations** based on:
   - Same CSN folder as participant's scheduled folder
   - Closest timestamp within 2-hour window
   - Multiple confidence levels

3. **Assigns confidence**:
   - **High**: Within 15 minutes (96 conversations)
   - **Medium**: 15-45 minutes (171 conversations)
   - **Low**: 45-120 minutes (72 conversations)

### Results

**Successfully matched 339 additional conversations** (85.8% of previously unmatched data!)

## 📊 Data Breakdown

### By Matching Method
- **Explicit ID**: 397 conversations (participant mentioned their ID)
- **Timestamp Proximity**: 339 conversations (matched by algorithm)
  - High confidence: 96
  - Medium confidence: 171
  - Low confidence: 72
- **Legacy methods**: 0 (superseded)
- **Still unmatched**: 56 (7.1%)

### By Confidence Level
- **High reliability**: 493 conversations (67%)
- **Medium reliability**: 171 conversations (23%)
- **Low reliability**: 72 conversations (10%)

## 🖥️ Web Viewer Features

### Overview Tab 📊
- Quick statistics and KPIs
- Match method distribution charts
- Confidence level breakdown
- Timeline visualizations

### Conversations Tab 💬
- Sortable table of all conversations
- Title, participant, folder, timestamps
- Match method and confidence indicators
- First user message preview

### Participants Tab 👥
- Complete participant directory
- Conversation counts per participant
- Folder usage patterns
- Match quality metrics

### Analytics Tab 📈
- Detailed visualizations and charts
- Temporal patterns analysis
- Match quality distribution
- Folder-wise breakdown

### Search Tab 🔎
- Search across all conversations
- Filter by title, message, or participant
- **Export to CSV** functionality
- Advanced search combinations

### Sidebar Filters
- **📁 CSN Folder**: Filter by folder (CSN1-22)
- **🔍 Match Method**: Filter by matching method
- **⭐ Confidence**: Filter by confidence level
- **👤 Participant**: Filter by specific participant
- **📅 Date Range**: Filter by date
- **Active Filters Display**: See and remove filters
- **Clear All**: Reset all filters at once

## 📖 Documentation

### For Using the Viewer
👉 **`viewer/README_QUICKSTART.md`** - Complete viewer guide

### For Understanding the Matching
👉 **`MATCHING_SOLUTION_SUMMARY.md`** - Algorithm details

### For Data Analysis
👉 **`QUICK_START_GUIDE.md`** - How to analyze the data

### Setup Complete
👉 **`VIEWER_SETUP_COMPLETE.md`** - What was done

## 🔧 Common Tasks

### 1. View Data Interactively
```bash
cd viewer
npm run dev
# Open http://localhost:3000
```

### 2. Export Specific Data
1. Open viewer at http://localhost:3000
2. Go to Search tab
3. Apply filters
4. Click "Export to CSV"

### 3. Re-run Matching with Different Parameters
Edit `smart_participant_matcher.py`, change `time_threshold_minutes`, then:
```bash
python3 smart_participant_matcher.py
```

### 4. Load Data in Python
```python
import json

# Load all matched conversations
with open('output/all_matched_conversations.json') as f:
    conversations = json.load(f)

# Load participant summaries
with open('output/final_participant_summary_complete.json') as f:
    participants = json.load(f)

print(f"Total: {len(conversations)} conversations")
print(f"Participants: {len(participants)}")
```

### 5. Filter by Confidence in Python
```python
import json

with open('output/all_matched_conversations.json') as f:
    all_convs = json.load(f)

# High confidence only
high_conf = [c for c in all_convs if c.get('match_confidence') == 'high']
print(f"High confidence: {len(high_conf)}")

# Explicit ID matches only
explicit = [c for c in all_convs if
           c.get('match_method') in ['explicit_id', 'direct_id']]
print(f"Explicit ID: {len(explicit)}")
```

## 🎨 Technology Stack

### Matching Algorithm
- **Language**: Python 3
- **Core**: Smart timestamp-based matching
- **Libraries**: json, datetime, collections

### Web Viewer
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## ✅ Validation

### Match Quality Indicators

Each conversation includes:
- `match_method`: How it was matched
- `match_confidence`: Reliability level
- `match_time_diff_minutes`: Time difference for timestamp matches

### Validation Steps

1. **Check Confidence Distribution**
   - High: 96 conversations (28% of timestamp matches)
   - Medium: 171 conversations (50% of timestamp matches)
   - Low: 72 conversations (21% of timestamp matches)

2. **Review Time Differences**
   - Most are within reasonable ranges
   - Can be validated against study logs

3. **Spot Check Matches**
   - Use viewer to inspect individual matches
   - Check conversation content against participant ID

## 🔍 Still Unmatched (56 conversations)

Reasons conversations remain unmatched:
- Created outside 2-hour window of any scheduled participant
- From times with no scheduled participants
- Edge cases from unusual dates
- Represent only 7.1% of total data

These can be manually reviewed or excluded from analysis.

## 💡 Best Practices

### For Analysis
1. **Always check match confidence** for timestamp-matched conversations
2. **Use filters** to focus on specific subsets
3. **Export data** for statistical analysis in R/Python
4. **Cross-reference** with study scheduling records when needed

### For Conservative Analysis
Use only high-confidence matches:
```python
reliable = [c for c in conversations if
    c.get('match_method') in ['explicit_id', 'direct_id'] or
    (c.get('match_method') == 'timestamp_proximity' and
     c.get('match_confidence') == 'high')
]
```

## 🚀 What's Next?

1. **Explore in Viewer**: Open http://localhost:3000 and explore!
2. **Validate Matches**: Review the matched conversations
3. **Export Data**: Export subsets for your analysis
4. **Analyze Results**: Use the matched data for your study
5. **Customize**: Modify viewer components as needed

## 📞 Support

- **Viewer Issues**: Check `viewer/README_QUICKSTART.md`
- **Matching Algorithm**: Check `MATCHING_SOLUTION_SUMMARY.md`
- **Data Analysis**: Check `QUICK_START_GUIDE.md`

## 🎓 Summary

✅ **Problem**: 20% of participants forgot to mention IDs
✅ **Solution**: Smart timestamp-based matching algorithm
✅ **Result**: 92.9% match rate (339 additional conversations matched!)
✅ **Tools**: Python matching scripts + Modern Next.js viewer
✅ **Status**: Complete and ready to use!

---

**Last Updated**: 2025-10-31
**Version**: 2.0
**Status**: ✅ Production Ready
**Viewer**: 🟢 Running at http://localhost:3000
