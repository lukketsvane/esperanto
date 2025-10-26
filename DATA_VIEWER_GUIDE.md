# Interactive Data Viewer Guide

## Overview

The **Esperanto Study Data Viewer** is a powerful web-based application for exploring and analyzing the ChatGPT conversation dataset. Built with Streamlit, it provides an intuitive interface with interactive visualizations, advanced filtering, and comprehensive search capabilities.

## Features

### 1. Interactive Web Interface
- Modern, responsive design optimized for data exploration
- Real-time filtering and searching
- Interactive visualizations with Plotly
- Multi-tab layout for organized exploration

### 2. Comprehensive Filtering
- Filter by study folder (CSN1-CSN22)
- Filter by match method (direct ID, timestamp proximity, etc.)
- Filter by confidence threshold (0.0 - 1.0)
- Real-time update of all visualizations

### 3. Five Main Sections

#### Overview Tab
- Key metrics dashboard showing:
  - Total conversations and match rate
  - Unique participants and averages
  - Study folders and distribution
  - High confidence conversation count
- Visual distributions:
  - Match method pie chart
  - Confidence score histogram
  - Conversations per folder bar chart
  - Message count box plots

#### Conversations Tab
- Browse all conversations in a sortable table
- Sort by: time, confidence, message count, title
- Detailed view of individual conversations:
  - Folder and participant information
  - Match method and confidence
  - Message counts and statistics
  - First user message preview
- Color-coded confidence progress bars

#### Participants Tab
- Participant-level analytics showing:
  - Conversation count per participant
  - Total user and assistant messages
  - Average confidence scores
  - Associated study folders
- Top 20 most active participants visualization
- Sortable participant summary table

#### Analytics Tab
- Confidence score tier breakdown:
  - Excellent (0.95-1.00)
  - High (0.80-0.94)
  - Medium (0.60-0.79)
  - Low (0.40-0.59)
  - Very Low (0.01-0.39)
  - Unmatched (0.00)
- Message statistics summary
- Temporal distribution chart (conversations over time)
- Data quality insights

#### Search Tab
- Full-text search across:
  - Conversation titles
  - First user messages
  - Participant IDs
- Case-insensitive search
- Results displayed in interactive table
- Works with active filters

## Installation

### Prerequisites

1. Ensure you have Python 3.7+ installed
2. The dataset must be processed and available in `output/` folder

### Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- streamlit (web framework)
- plotly (interactive visualizations)
- pandas (data manipulation)
- Other supporting libraries

## Usage

### Starting the Viewer

From the repository root, run:

```bash
streamlit run data_viewer.py
```

The viewer will automatically open in your default web browser at `http://localhost:8501`

### Alternative: Specify Port

```bash
streamlit run data_viewer.py --server.port 8502
```

### Alternative: Headless Mode (for servers)

```bash
streamlit run data_viewer.py --server.headless true
```

## Common Tasks

### 1. Getting a Quick Overview

1. Launch the viewer
2. Go to the **Overview** tab
3. Review the metric cards at the top
4. Examine the visualizations for patterns

### 2. Finding High-Quality Data

1. Use the sidebar **Minimum Confidence** slider
2. Set threshold to 0.80 or higher
3. All tabs will update to show only high-confidence matches
4. Check the **Analytics** tab for tier breakdown

### 3. Exploring a Specific Study Session

1. In the sidebar, select a folder from **Study Folder** dropdown (e.g., "CSN15")
2. Review the filtered conversations in the **Conversations** tab
3. Check participant distribution in the **Participants** tab
4. View session-specific statistics in **Overview**

### 4. Analyzing Participant Activity

1. Go to the **Participants** tab
2. Review the participant summary table
3. Sort by conversation count to find most active users
4. Check the visualization of top 20 participants
5. Note the folders where each participant was active

### 5. Searching for Specific Content

1. Navigate to the **Search** tab
2. Select search type (Title, First Message, or Participant ID)
3. Enter your search term
4. Review matching conversations
5. Use filters to narrow results further

### 6. Examining Individual Conversations

1. Go to the **Conversations** tab
2. Sort by your preferred metric
3. Scroll through the table
4. Select a conversation using the index number
5. Review detailed metrics and message preview below

### 7. Understanding Match Quality

1. Visit the **Analytics** tab
2. Review the confidence tier breakdown
3. Check what percentage falls into each category
4. Use this to decide appropriate confidence thresholds
5. View temporal distribution to identify data collection patterns

## Tips and Best Practices

### Performance Optimization

- The data is cached on first load for fast performance
- Filtering and searching are instant
- If you update the data files, restart the viewer to reload

### Data Quality Analysis

- Use confidence >= 0.80 for high-precision analysis
- Use confidence >= 0.40 for general exploration (95% of data)
- Review unmatched conversations (confidence = 0.00) separately
- Check match method distribution to understand data reliability

### Effective Filtering

- Combine multiple filters for targeted analysis
- Start broad, then narrow with additional filters
- Use the conversation count indicator in sidebar to track filter impact
- Reset filters by refreshing the page

### Exporting Data

- Use the download button on any dataframe to export to CSV
- Filtered views can be exported for further analysis
- Screenshots can capture visualizations for reports

## Troubleshooting

### Data File Not Found

**Error:** "Data file not found: output/matched_conversations.json"

**Solution:**
- Ensure you've run the data processing pipeline
- Check that `output/` folder exists with the data files
- Verify file permissions

### Port Already in Use

**Error:** "Address already in use"

**Solution:**
```bash
streamlit run data_viewer.py --server.port 8502
```

### Slow Performance

**Issue:** Viewer is slow to respond

**Solution:**
- Check if other applications are using system resources
- Restart the viewer to clear cache
- Consider using a smaller dataset for testing

### Visualizations Not Displaying

**Issue:** Charts are blank or missing

**Solution:**
- Check browser console for JavaScript errors
- Try a different browser (Chrome/Firefox recommended)
- Ensure plotly is properly installed: `pip install --upgrade plotly`

## Comparison with CLI Explorer

### Data Viewer (Streamlit) - Best for:
- Visual exploration and pattern discovery
- Interactive filtering and real-time updates
- Creating reports and presentations
- Multi-dimensional analysis
- Sharing with non-technical users

### CLI Explorer (data_explorer.py) - Best for:
- Quick command-line queries
- Scripting and automation
- Server environments without GUI
- Integrating with other CLI tools
- Low-resource environments

### Use Both:
- CLI for quick lookups: `python data_explorer.py participant 01122024_1500_11`
- Web viewer for in-depth analysis and visualization

## Advanced Features

### Custom Filtering Logic

The viewer supports combining multiple filters:
- Folder + Confidence threshold
- Method + Confidence threshold
- All three combined

All visualizations and tables update automatically.

### Data Export Options

Each table has a built-in download button:
1. Hover over any dataframe
2. Click the download icon (top-right)
3. Save as CSV for use in Excel, R, or other tools

### Keyboard Shortcuts

- `R` - Reload the app
- `Ctrl + C` (in terminal) - Stop the server
- Browser refresh - Reset all filters

## Technical Details

### Technology Stack

- **Streamlit**: Web application framework
- **Plotly**: Interactive visualizations
- **Pandas**: Data manipulation
- **Python 3.7+**: Core language

### Data Caching

The viewer uses Streamlit's caching mechanism to:
- Load data once per session
- Provide instant filtering and updates
- Minimize memory usage
- Improve performance

### Browser Compatibility

Tested and supported on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Examples

### Example 1: Data Quality Report

```bash
# Start the viewer
streamlit run data_viewer.py

# Then in the viewer:
# 1. Go to Analytics tab
# 2. Screenshot the confidence tier breakdown
# 3. Note the percentage of high-quality matches
# 4. Export the tier table for your report
```

### Example 2: Session Analysis

```bash
# For analyzing CSN15 session:
# 1. Select "CSN15" in folder filter
# 2. Go to Overview tab
# 3. Review session-specific metrics
# 4. Check Participants tab for user engagement
# 5. Export participant list
```

### Example 3: Finding Esperanto Learning Patterns

```bash
# Search for conversations about specific topics:
# 1. Go to Search tab
# 2. Select "First Message"
# 3. Search for "learn" or "practice"
# 4. Review results
# 5. Check which participants asked these questions
```

## Support and Feedback

- For issues with the viewer, check the troubleshooting section
- For questions about the dataset, see README.md
- For technical details, see REPOSITORY_STRUCTURE.md

## Version History

- **v1.0.0** (2025-10-26): Initial release
  - Five-tab interface
  - Interactive filtering
  - Comprehensive visualizations
  - Full-text search
  - Participant analytics

## Next Steps

After familiarizing yourself with the viewer:
1. Explore the dataset systematically using all tabs
2. Identify patterns and insights
3. Export filtered data for detailed analysis
4. Use the CLI tool for specific queries
5. Refer to the validation docs for data quality context

---

**Happy exploring!**
