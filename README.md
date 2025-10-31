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