# Esperanto Study Dataset

**ChatGPT conversation data from Esperanto language learning study**

## Overview

This repository contains 397 ChatGPT conversations from 285 participants across 21 study sessions (CSN1-CSN22), collected during December 2-5, 2024. The dataset has been processed, matched to participants, and validated with **96.7% usable data** (3.3% loss).

### Key Statistics

- **Total conversations**: 397
- **Matched to participants**: 384 (96.7%)
- **Unique participants**: 285
- **Total messages**: 9,273 (4,540 user + 4,733 assistant)
- **Date range**: November 28 - December 5, 2024
- **Study folders**: 21 (CSN1-CSN22)

---

## Quick Start

### Option 1: Next.js Web Viewer (Recommended)

Modern, interactive React-based viewer:

```bash
cd viewer
npm install
mkdir -p public/data
cp ../output/matched_conversations.json public/data/
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore:
- 📊 Interactive dashboard with real-time charts
- 🔍 Advanced filtering and search
- 💬 Conversation browser with detailed views
- 👥 Participant analytics
- 📈 Statistical insights

See [viewer/README.md](viewer/README.md) for full documentation.

### Option 2: Streamlit Viewer (Python)

Python-based web viewer:

```bash
streamlit run data_viewer.py
```

See [DATA_VIEWER_GUIDE.md](DATA_VIEWER_GUIDE.md) for detailed usage.

### Option 3: Command-Line Explorer

For quick queries and scripting:

```bash
# Interactive menu
python data_explorer.py

# View overview
python data_explorer.py overview

# Search conversations
python data_explorer.py search esperanto title

# View participant details
python data_explorer.py participant 01122024_1500_11
```

---

## Repository Structure

```
esperanto/
├── viewer/                  # Next.js web-based data viewer (React/TypeScript)
│   ├── app/                 # Next.js pages and layouts
│   ├── components/          # React components
│   ├── lib/                 # Data loading and utilities
│   ├── public/data/         # Data files (copy matched_conversations.json here)
│   └── README.md            # Viewer documentation
│
├── data_viewer.py           # Streamlit web viewer (Python)
├── data_explorer.py         # Command-line data explorer
├── requirements.txt         # Python dependencies
│
├── promptdata/              # Raw ChatGPT export data
│   ├── CSN1/
│   ├── CSN2/
│   └── ...
│
├── output/                  # Processed data files
│   ├── matched_conversations.json       # All conversations with participant matches
│   ├── final_participant_summary.csv    # Participant-level aggregated data
│   ├── conversation_metrics.csv         # Individual conversation metrics
│   ├── match_report.json               # Detailed matching statistics
│   └── metrics_summary.json            # Statistical summary by folder
│
├── scripts/                 # Data processing scripts
│   ├── analyze_all_data.py             # Extract IDs from conversations
│   ├── match_participants.py           # Match conversations to participants
│   ├── aggressive_matcher.py           # Aggressive temporal clustering
│   ├── extract_missed_ids.py           # Extract malformed IDs
│   ├── ultra_aggressive_matcher.py     # Ultra-aggressive matching
│   ├── create_final_dataset.py         # Generate final outputs
│   ├── validate_matching.py            # Validation analysis
│   └── final_validation_report.py      # Comprehensive validation
│
├── docs/                    # Documentation
│   ├── DATA_VIEWER_GUIDE.md            # Web viewer usage guide
│   ├── DATA_EXPLORER_GUIDE.md          # CLI explorer usage guide
│   ├── VALIDATION_INSIGHTS.md          # Validation analysis
│   └── README_old.md                   # Original README
│
└── litterature/             # Reference materials
```

---

## Data Quality

### Confidence Levels

| Confidence | Count | % | Reliability | Recommendation |
|------------|-------|---|-------------|----------------|
| 0.95-1.00 (very high) | 342 | 86.1% | Direct ID / Extracted ID | ✅ Use with full confidence |
| 0.80-0.94 (high) | 13 | 3.3% | Timestamp proximity | ✅ Highly reliable |
| 0.60-0.79 (medium) | 13 | 3.3% | Temporal clustering | ✅ Generally reliable |
| 0.40-0.59 (low-medium) | 9 | 2.3% | Extended temporal | ⚠️ Use with caution |
| 0.01-0.39 (low) | 7 | 1.8% | Weak temporal | ⚠️ Verify if critical |
| 0.00 (unmatched) | 13 | 3.3% | No match | ❌ Exclude from analysis |

### Recommended Datasets

- **General analysis**: Use confidence ≥ 0.40 → **377 conversations (95.0%)**
- **High-precision analysis**: Use confidence ≥ 0.60 → **368 conversations (92.7%)**
- **Critical analysis**: Use confidence ≥ 0.80 → **355 conversations (89.4%)**

---

## Matching Methods

The dataset uses multiple methods to match conversations to participants:

1. **Direct ID** (290 convs, 73.0%) - Participant explicitly stated their ID
2. **Timestamp Proximity** (57 convs, 14.4%) - Matched via timestamp within same folder
3. **Aggressive Temporal Clustering** (21 convs, 5.3%) - 120-minute window matching
4. **Ultra-Aggressive Methods** (11 convs, 2.8%) - Extended temporal + content similarity
5. **ID Extraction** (6 convs, 1.5%) - Parsed malformed IDs from messages

See [VALIDATION_INSIGHTS.md](docs/VALIDATION_INSIGHTS.md) for detailed validation analysis.

---

## Data Processing Pipeline

### Phase 1: Initial Analysis
```bash
python scripts/analyze_all_data.py
```
- Extracts participant IDs from conversation messages
- Handles 12+ ID format variations
- Output: `conversation_analysis.json`

### Phase 2: Participant Matching
```bash
python scripts/match_participants.py
```
- Matches conversations without IDs using timestamp proximity
- 60-minute temporal window within same folder
- Output: `matched_conversations.json` (initial)

### Phase 3: Aggressive Matching
```bash
python scripts/aggressive_matcher.py
```
- 120-minute temporal clustering
- Single-participant folder heuristics
- Output: Updated `matched_conversations.json`

### Phase 4: ID Extraction Recovery
```bash
python scripts/extract_missed_ids.py
```
- Extracts IDs from malformed formats
- Handles text months, short dates, alternative formats
- Output: Updated `matched_conversations.json`

### Phase 5: Ultra-Aggressive Matching
```bash
python scripts/ultra_aggressive_matcher.py
```
- 6-hour temporal window + content similarity
- Topic-based matching for Esperanto queries
- Output: Final `matched_conversations.json`

### Phase 6: Final Dataset Creation
```bash
python scripts/create_final_dataset.py
```
- Generates participant summaries
- Creates conversation metrics
- Output: CSV files and consolidated JSON

### Phase 7: Validation
```bash
python scripts/final_validation_report.py
```
- Validates reconstructed matches against known correct data
- Analyzes confidence distribution
- Output: Validation report

---

## Data Recovery Achievement

| Phase | Unmatched | Data Loss | Method |
|-------|-----------|-----------|--------|
| Initial | 89 | 22.4% | Direct ID only |
| Phase 1 | 54 | 13.6% | + Timestamp proximity |
| Phase 2 | 29 | 7.3% | + Aggressive temporal |
| Phase 3 | 24 | 6.0% | + ID extraction |
| **Final** | **13** | **3.3%** | + Ultra-aggressive |

**Total recovery**: 76 conversations (85.4% reduction in data loss)

---

## Participant ID Format

Standard format: `DDMMYYYY_HHMM_NN`

**Example**: `05122024_1500_19`
- **Day**: 05
- **Month**: 12
- **Year**: 2024
- **Time**: 15:00 (3:00 PM)
- **Participant number**: 19

---

## Usage Examples

### Explore by Participant

```bash
# List top participants by activity
python data_explorer.py participants

# View specific participant's full timeline
python data_explorer.py participant 01122024_1500_11
```

### Explore by Folder

```bash
# List all folders with statistics
python data_explorer.py folders

# View all conversations in a folder
python data_explorer.py folder CSN15
```

### Search Conversations

```bash
# Search by title
python data_explorer.py search esperanto title

# Search by first message content
python data_explorer.py search "what is" first_message
```

### View Statistics

```bash
# Comprehensive statistics
python data_explorer.py stats
```

---

## Data Files

### Primary Data

- **`output/matched_conversations.json`** - Complete dataset with all matches
  - 397 conversations with full metadata
  - Participant IDs, match methods, confidence scores
  - Message counts, timestamps, titles

- **`output/final_participant_summary.csv`** - Participant-level aggregated data
  - 285 participants
  - Total conversations, messages, characters per participant
  - Active folders, date ranges

- **`output/conversation_metrics.csv`** - Individual conversation metrics
  - Per-conversation statistics
  - User/assistant message counts
  - Character counts, duration

### Supporting Files

- **`output/match_report.json`** - Detailed matching statistics and diagnostics
- **`output/metrics_summary.json`** - Statistical summary by folder
- **`output/conversation_analysis.json`** - Raw analysis results

---

## Validation

The dataset has been validated by comparing reconstructed matches against participants who explicitly provided their IDs.

**Example validation** (Participant `01122024_1500_11`):
- 12 total conversations
- 7 with direct ID (100% reliable)
- 5 reconstructed using temporal/topic matching
- All 5 reconstructed conversations occurred within 1-5 hours of known correct conversations
- All matched topical content (Esperanto learning/translation)

See [docs/VALIDATION_INSIGHTS.md](docs/VALIDATION_INSIGHTS.md) for complete validation analysis.

---

## Requirements

```bash
pip install -r requirements.txt
```

Requires:
- Python 3.7+
- Standard library only (no external dependencies)

---

## Documentation

- **[DATA_EXPLORER_GUIDE.md](docs/DATA_EXPLORER_GUIDE.md)** - Complete guide to using the data explorer
- **[VALIDATION_INSIGHTS.md](docs/VALIDATION_INSIGHTS.md)** - Deep validation analysis
- **Interactive help** - Run `python data_explorer.py` and select option 8

---

## The 13 Unmatched Conversations

- **9 conversations** - Test/junk messages ("login" on 2024-11-29)
- **4 conversations** - Legitimate but isolated conversations with no temporal matches
  - CSN14 Conv#16: 38 messages, 22+ hours from nearest match
  - CSN21 Conv#16: 12 messages, 23+ hours from nearest match
  - CSN7 Conv#0: 19 messages, 6+ hours from nearest match
  - CSN8 Conv#19: 6 messages, 22+ hours from nearest match

---

## Citation

If you use this dataset, please cite:

```
Esperanto Study ChatGPT Conversations
Collected: December 2-5, 2024
397 conversations from 285 participants
Data processing and matching: [Your Name]
Available at: [Repository URL]
```

---

## License

[Add your license here]

---

## Contact

For questions about the dataset or data processing:
- See documentation in `docs/`
- Review validation reports in `output/`
- Run data explorer for interactive exploration

---

**Dataset Statistics**
- Total conversations: 397
- Usable data: 384 (96.7%)
- Data loss: 13 (3.3%)
- Validation: ✅ Passed
- Quality: High (89.4% confidence ≥ 0.80)

*Last updated: December 5, 2024*
