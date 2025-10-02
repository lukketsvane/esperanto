# Quick Start Guide

## 🚀 Get Started in 30 Seconds

### 1. Explore the Data
```bash
python data_explorer.py
```

### 2. See Overview
```bash
python data_explorer.py overview
```

---

## 📊 Most Common Commands

### View Participants
```bash
# List top 20 participants
python data_explorer.py participants

# View specific participant
python data_explorer.py participant 01122024_1500_11
```

### Search Conversations
```bash
# Search for Esperanto topics
python data_explorer.py search esperanto title

# Search first messages
python data_explorer.py search "what is" first_message
```

### View Folders
```bash
# List all folders
python data_explorer.py folders

# View specific folder
python data_explorer.py folder CSN15
```

### Statistics
```bash
python data_explorer.py stats
```

---

## 📁 Key Files

| File | Description |
|------|-------------|
| `output/matched_conversations.json` | Complete dataset (397 conversations) |
| `output/final_participant_summary.csv` | Participant summaries (285 participants) |
| `output/conversation_metrics.csv` | Individual conversation stats |
| `docs/DATA_EXPLORER_GUIDE.md` | Full usage guide |
| `docs/VALIDATION_INSIGHTS.md` | Data validation details |

---

## ✅ Data Quality

- **96.7% usable** (384/397 conversations)
- **89.4% high confidence** (≥0.80)
- **3.3% data loss** (13 unmatched)

### Use for Analysis

| Confidence | Count | Use Case |
|------------|-------|----------|
| ≥ 0.80 | 355 (89.4%) | ✅ All analysis |
| ≥ 0.60 | 368 (92.7%) | ✅ General analysis |
| ≥ 0.40 | 377 (95.0%) | ✅ Broad analysis |
| < 0.40 | 7 (1.8%) | ⚠️ Use with caution |
| Unmatched | 13 (3.3%) | ❌ Exclude |

---

## 🔍 Example Participant

**Participant ID**: `01122024_1500_11`
- **12 conversations** across 6 folders
- **220 total messages**
- **Active period**: Dec 2-5, 2024
- **7 direct ID matches** + **5 reconstructed** (validated)

View details:
```bash
python data_explorer.py participant 01122024_1500_11
```

---

## 📚 Need More Help?

- **Interactive mode**: `python data_explorer.py`
- **Full guide**: `docs/DATA_EXPLORER_GUIDE.md`
- **Validation details**: `docs/VALIDATION_INSIGHTS.md`
- **Main README**: `README.md`

---

## 🎯 Quick Stats

```
Total conversations: 397
Matched participants: 285
Date range: Nov 28 - Dec 5, 2024
Total messages: 9,273
Study folders: 21 (CSN1-CSN22)
Data quality: 96.7% usable
```

---

*Ready to explore? Run `python data_explorer.py` now!*
