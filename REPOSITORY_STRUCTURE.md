# Repository Structure

## Overview

Clean, organized repository for the Esperanto Study ChatGPT conversation dataset.

---

## Directory Structure

```
esperanto/
│
├── 📄 README.md                    # Main documentation
├── 📄 QUICK_START.md              # Quick reference guide
├── 📄 REPOSITORY_STRUCTURE.md     # This file
├── 📄 requirements.txt            # Python dependencies
├── 📄 .gitignore                  # Git ignore rules
│
├── 🔧 data_explorer.py            # Main interactive data explorer (keep in root)
│
├── 📂 promptdata/                 # Raw ChatGPT export data
│   ├── CSN1/
│   │   ├── csn1/
│   │   │   └── conversations.json
│   │   └── [archived PNG files]
│   ├── CSN2/
│   ├── ...
│   └── CSN22/
│
├── 📂 output/                     # Processed data files (included in repo)
│   ├── matched_conversations.json       # ⭐ Complete dataset with all matches
│   ├── final_participant_summary.csv    # Participant-level data
│   ├── conversation_metrics.csv         # Per-conversation metrics
│   ├── match_report.json               # Matching statistics
│   ├── metrics_summary.json            # Summary by folder
│   ├── conversation_analysis.json      # Raw analysis results
│   └── unmatched_for_review.txt        # List of unmatched conversations
│
├── 📂 scripts/                    # Data processing pipeline scripts
│   ├── analyze_all_data.py             # Step 1: Extract participant IDs
│   ├── match_participants.py           # Step 2: Timestamp matching
│   ├── aggressive_matcher.py           # Step 3: Aggressive temporal clustering
│   ├── extract_missed_ids.py           # Step 4: ID extraction recovery
│   ├── ultra_aggressive_matcher.py     # Step 5: Ultra-aggressive matching
│   ├── create_final_dataset.py         # Step 6: Generate final outputs
│   ├── validate_matching.py            # Validation analysis
│   ├── final_validation_report.py      # Comprehensive validation
│   ├── deep_unmatched_analysis.py      # Deep dive on unmatched
│   ├── explore_data.py                 # Basic data exploration
│   ├── generate_metrics.py             # Metrics generation
│   └── data_explorer_backup.py         # Backup of data explorer
│
├── 📂 docs/                       # Documentation
│   ├── DATA_EXPLORER_GUIDE.md          # Complete usage guide
│   ├── VALIDATION_INSIGHTS.md          # Validation analysis & insights
│   └── README_old.md                   # Original README (archived)
│
└── 📂 litterature/                # Reference materials
    └── [research papers, references]
```

---

## File Descriptions

### Root Level

| File | Purpose |
|------|---------|
| `README.md` | Main documentation with overview, usage, and data quality info |
| `QUICK_START.md` | Quick reference for common commands |
| `REPOSITORY_STRUCTURE.md` | This file - repository organization |
| `data_explorer.py` | **Main entry point** - interactive data explorer |
| `requirements.txt` | Python package dependencies |
| `.gitignore` | Git ignore configuration |

### 📂 promptdata/

Raw ChatGPT conversation exports organized by study session folder.

**Structure**:
- CSN1-CSN22 folders (21 total)
- Each contains `conversations.json` (some nested in subfolder)
- Archived PNG screenshots of chat interfaces

**Note**: This is the source data - do not modify.

### 📂 output/

Processed data files ready for analysis.

| File | Records | Description |
|------|---------|-------------|
| `matched_conversations.json` | 397 | **Primary dataset** - all conversations with participant matches |
| `final_participant_summary.csv` | 285 | Participant-level aggregated statistics |
| `conversation_metrics.csv` | 397 | Individual conversation metrics |
| `match_report.json` | - | Detailed matching method statistics |
| `metrics_summary.json` | 21 | Summary statistics by folder |
| `conversation_analysis.json` | 397 | Raw analysis with ID extraction results |
| `unmatched_for_review.txt` | 13 | List of unmatched conversations |

**Primary file**: `matched_conversations.json` contains all data with:
- Participant IDs
- Match methods and confidence scores
- Message counts, timestamps, titles
- Full metadata

### 📂 scripts/

Data processing pipeline in execution order:

| Script | Phase | Purpose |
|--------|-------|---------|
| `analyze_all_data.py` | 1 | Extract participant IDs from messages (12+ format patterns) |
| `match_participants.py` | 2 | Timestamp proximity matching (60-min window) |
| `aggressive_matcher.py` | 3 | Aggressive temporal clustering (120-min window) |
| `extract_missed_ids.py` | 4 | Parse malformed IDs from messages |
| `ultra_aggressive_matcher.py` | 5 | Ultra-aggressive matching (6-hour + content similarity) |
| `create_final_dataset.py` | 6 | Generate final CSV and JSON outputs |
| `validate_matching.py` | - | Validation analysis tool |
| `final_validation_report.py` | - | Comprehensive validation report generator |
| `deep_unmatched_analysis.py` | - | Detailed analysis of unmatched conversations |
| `explore_data.py` | - | Basic data exploration utilities |
| `generate_metrics.py` | - | Metrics calculation |

**Run order** (already completed):
```bash
cd scripts
python analyze_all_data.py
python match_participants.py
python aggressive_matcher.py
python extract_missed_ids.py
python ultra_aggressive_matcher.py
python create_final_dataset.py
python final_validation_report.py
```

**Output**: All results saved to `output/` folder

### 📂 docs/

Comprehensive documentation:

| Document | Purpose |
|----------|---------|
| `DATA_EXPLORER_GUIDE.md` | Complete guide to using data_explorer.py |
| `VALIDATION_INSIGHTS.md` | Deep validation analysis comparing known correct vs reconstructed data |
| `README_old.md` | Original README (archived) |

### 📂 litterature/

Research papers, references, and supporting materials for the study.

---

## Key Design Decisions

### Why data_explorer.py is in root?
- **Main entry point** for users
- Easy to run: `python data_explorer.py`
- No need to navigate to subdirectories

### Why keep output/ in repository?
- **Processed data is valuable** - represents significant computation
- **Reproducibility** - users can immediately explore without running pipeline
- **Small size** - JSON/CSV files are manageable in git
- **Version control** - track changes in processed data

### Why separate scripts/ folder?
- **Organization** - processing scripts separate from end-user tools
- **Advanced users only** - most users just need data_explorer.py
- **Pipeline clarity** - numbered/named scripts show processing order

---

## Usage Patterns

### For Data Consumers (Most Users)

1. Read `README.md` for overview
2. Check `QUICK_START.md` for commands
3. Run `python data_explorer.py`
4. Explore data interactively or via commands
5. Use files from `output/` folder for analysis

### For Data Processors (Advanced)

1. Review `scripts/` folder
2. Run pipeline scripts in order (if reprocessing needed)
3. Check `docs/VALIDATION_INSIGHTS.md` for methodology
4. Modify scripts for custom processing

### For Researchers

1. Read `README.md` and `docs/VALIDATION_INSIGHTS.md`
2. Understand data quality levels
3. Use `output/matched_conversations.json` as primary source
4. Filter by confidence scores for analysis needs
5. Cite properly

---

## Git Strategy

### Included in Repository
- ✅ All documentation
- ✅ All scripts
- ✅ All output files (processed data)
- ✅ data_explorer.py
- ✅ requirements.txt

### Excluded from Repository (.gitignore)
- ❌ `__pycache__/` and Python bytecode
- ❌ Virtual environments
- ❌ Temporary files
- ❌ IDE-specific files
- ❌ OS-specific files (DS_Store, Thumbs.db)

### Raw Data (promptdata/)
- **Included** but can be large
- Contains original ChatGPT exports
- Required for pipeline reprocessing

---

## Data Flow

```
promptdata/CSN*/conversations.json
           ↓
    [analyze_all_data.py]
           ↓
    conversation_analysis.json
           ↓
    [match_participants.py]
           ↓
    [aggressive_matcher.py]
           ↓
    [extract_missed_ids.py]
           ↓
    [ultra_aggressive_matcher.py]
           ↓
    matched_conversations.json (primary)
           ↓
    [create_final_dataset.py]
           ↓
    ├── final_participant_summary.csv
    ├── conversation_metrics.csv
    ├── match_report.json
    └── metrics_summary.json
           ↓
    [data_explorer.py] ← User interacts here
```

---

## Quick Navigation

| I want to... | Go to... |
|--------------|----------|
| Explore data | Run `python data_explorer.py` |
| Understand data quality | Read `docs/VALIDATION_INSIGHTS.md` |
| Learn commands | Check `QUICK_START.md` |
| Access raw data | See `promptdata/` |
| Get processed data | Use `output/matched_conversations.json` |
| Understand processing | Review `scripts/` in order |
| Cite the dataset | See `README.md` citation section |

---

## Statistics Summary

- **Total files**: ~50+ (including all conversations.json)
- **Main entry point**: `data_explorer.py`
- **Primary dataset**: `output/matched_conversations.json` (397 conversations)
- **Documentation**: 4 markdown files
- **Processing scripts**: 11 Python files
- **Output files**: 7 data files

---

*Repository organized for clarity, usability, and reproducibility.*
*Last updated: December 5, 2024*
