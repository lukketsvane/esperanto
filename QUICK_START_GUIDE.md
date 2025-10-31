# Quick Start Guide - Esperanto Study Data Analysis

## Overview

This repository contains conversation data from the Esperanto language learning study, with a complete solution for matching conversations to participants, even when participants forgot to mention their IDs (~20% of cases).

## Current Status

✅ **Data Matching: COMPLETE**
- Total conversations: 792
- Matched: 736 (92.9%)
- Unmatched: 56 (7.1%)
- Total participants: 228

## Quick Start

### 1. View the Data Interactively

```bash
streamlit run data_viewer.py
```

This opens an interactive web interface where you can:
- Browse all matched conversations
- Filter by participant, folder, date, or matching method
- View matching confidence levels
- Export filtered data
- See comprehensive statistics

**Access**: Opens automatically in your browser at `http://localhost:8501`

### 2. Key Data Files

#### Primary Dataset (Use This!)
- `output/all_matched_conversations.json` - All 736 matched conversations
  - Includes match method and confidence for each conversation
  - Ready for analysis

#### Participant Information
- `output/final_participant_summary_complete.json` - Complete participant summary
  - Number of conversations per participant
  - Folders used by each participant
  - Matching methods and confidence breakdown

#### Additional Files
- `output/newly_matched_conversations.json` - 339 conversations matched via timestamp algorithm
- `output/still_unmatched_conversations.json` - 56 conversations that couldn't be matched
- `output/final_statistics_report.json` - Comprehensive statistics

### 3. Re-run the Matching Pipeline

If you need to re-run the matching with different parameters:

```bash
# Run smart participant matcher
python3 smart_participant_matcher.py

# Generate comprehensive summaries
python3 generate_final_summary.py
```

## Understanding the Data

### Participant IDs

Format: `DDMMYYYY_HHMM_XX`
- `DD` = Day (01-31)
- `MM` = Month (01-12)
- `YYYY` = Year (2024)
- `HHMM` = Scheduled time (24-hour format)
- `XX` = CSN folder number (1-22)

Example: `03122024_1500_11`
- December 3, 2024
- 15:00 (3:00 PM)
- CSN folder 11

### Matching Methods

Each conversation has a `match_method` field:

1. **explicit_id / direct_id**: Participant mentioned their ID explicitly
   - Highest reliability
   - No additional validation needed

2. **timestamp_proximity**: Matched by our algorithm
   - Uses timestamp and folder information
   - Check `match_confidence` field:
     - `high`: Within 15 minutes of scheduled time
     - `medium`: Within 15-45 minutes
     - `low`: Within 45-120 minutes

3. **Other methods**: Previous matching attempts
   - `aggressive_temporal`: Earlier temporal matching
   - `synthetic_id_generated`: Generated placeholder IDs
   - See individual entries for details

### Match Confidence

For `timestamp_proximity` matches, check the confidence level:

```python
import json

with open('output/all_matched_conversations.json') as f:
    data = json.load(f)

# Filter by confidence
high_conf = [c for c in data if c.get('match_confidence') == 'high']
print(f"High confidence matches: {len(high_conf)}")
```

### Filtering Recommendations

**For conservative analysis** (highest confidence only):
```python
# Use only explicit ID matches and high-confidence timestamp matches
reliable = [c for c in data if
    c.get('match_method') in ['explicit_id', 'direct_id'] or
    (c.get('match_method') == 'timestamp_proximity' and
     c.get('match_confidence') == 'high')
]
```

**For comprehensive analysis** (include all matches):
```python
# Use all matched conversations
with open('output/all_matched_conversations.json') as f:
    all_data = json.load(f)
```

## Data Structure

Each conversation entry contains:
```json
{
  "title": "Conversation title",
  "create_time": 1733417137.176554,
  "participant_id": "03122024_1500_11",
  "source_folder": "CSN11",
  "match_method": "timestamp_proximity",
  "match_confidence": "high",
  "match_time_diff_minutes": 12.5,
  "mapping": { /* full conversation tree */ },
  ...
}
```

## Common Analysis Tasks

### 1. Load and Explore Data

```python
import json
import pandas as pd
from datetime import datetime

# Load all matched conversations
with open('output/all_matched_conversations.json') as f:
    conversations = json.load(f)

# Convert to DataFrame
df = pd.DataFrame(conversations)

# Basic statistics
print(f"Total conversations: {len(df)}")
print(f"Unique participants: {df['participant_id'].nunique()}")
print(f"Date range: {pd.to_datetime(df['create_time'], unit='s').min()} to {pd.to_datetime(df['create_time'], unit='s').max()}")
```

### 2. Analyze by Participant

```python
# Load participant summary
with open('output/final_participant_summary_complete.json') as f:
    participants = json.load(f)

# Participants by conversation count
import pandas as pd
df_participants = pd.DataFrame(participants)
print(df_participants['num_conversations'].describe())
```

### 3. Extract Conversation Messages

```python
def extract_messages(conversation):
    """Extract all messages from a conversation"""
    messages = []
    mapping = conversation.get('mapping', {})

    for node_id, node in mapping.items():
        if node and 'message' in node and node['message']:
            msg = node['message']
            if 'content' in msg and 'parts' in msg['content']:
                role = msg.get('author', {}).get('role')
                text = ' '.join(str(p) for p in msg['content']['parts'])
                messages.append({
                    'role': role,
                    'text': text,
                    'create_time': msg.get('create_time')
                })

    return messages

# Example usage
conv = conversations[0]
messages = extract_messages(conv)
for msg in messages:
    print(f"{msg['role']}: {msg['text'][:100]}...")
```

## Troubleshooting

### Data Viewer Won't Start

```bash
# Install dependencies
pip install streamlit pandas plotly

# Run viewer
streamlit run data_viewer.py
```

### Missing Data Files

If files are missing, re-run the pipeline:
```bash
python3 smart_participant_matcher.py
python3 generate_final_summary.py
```

### Understanding Unmatched Conversations

Check why conversations weren't matched:
```python
with open('output/still_unmatched_conversations.json') as f:
    unmatched = json.load(f)

# Analyze patterns
from collections import Counter
folders = Counter(c['source_folder'] for c in unmatched)
print("Unmatched by folder:", folders)
```

Most unmatched conversations are:
- Outside the 2-hour window of scheduled participants
- From times with no scheduled participants
- Edge cases from unusual dates

## Support Files

- `MATCHING_SOLUTION_SUMMARY.md` - Detailed explanation of the matching solution
- `smart_participant_matcher.py` - Main matching algorithm
- `generate_final_summary.py` - Summary generation script
- `data_viewer.py` - Interactive Streamlit viewer

## Contact

For questions about the matching algorithm or data structure, refer to:
- `MATCHING_SOLUTION_SUMMARY.md` for algorithm details
- Streamlit viewer for interactive exploration
- This guide for common operations

---

**Last Updated**: 2025-10-31
**Data Version**: v2.0 (with smart participant matching)
**Match Rate**: 92.9%
