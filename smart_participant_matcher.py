#!/usr/bin/env python3
"""
Smart Participant Matcher - Matches conversations to participants based on timestamps and folder info
Solves the problem where ~20% of participants forgot to mention their unique IDs
"""

import json
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict, List, Tuple, Optional

def parse_participant_id(participant_id: str) -> Optional[datetime]:
    """
    Parse participant ID in format DDMMYYYY_HHMM_XX to datetime
    Returns None if parsing fails
    """
    try:
        parts = participant_id.split('_')
        if len(parts) != 3:
            return None

        date_part = parts[0]  # DDMMYYYY
        time_part = parts[1]  # HHMM

        # Parse date: DDMMYYYY
        day = int(date_part[0:2])
        month = int(date_part[2:4])
        year = int(date_part[4:8])

        # Parse time: HHMM
        hour = int(time_part[0:2])
        minute = int(time_part[2:4])

        return datetime(year, month, day, hour, minute)
    except (ValueError, IndexError) as e:
        print(f"Warning: Could not parse participant_id '{participant_id}': {e}")
        return None

def get_csn_from_participant_id(participant_id: str) -> Optional[str]:
    """Extract CSN number from participant ID"""
    try:
        parts = participant_id.split('_')
        if len(parts) == 3:
            csn_num = int(parts[2])
            return f"CSN{csn_num}"
    except (ValueError, IndexError):
        pass
    return None

def build_participant_lookup(participants: List[Dict]) -> Dict[str, List[Dict]]:
    """
    Build a lookup dictionary: CSN folder -> list of participant info
    Each participant info contains: id, scheduled_time, folders
    """
    lookup = defaultdict(list)

    for p in participants:
        participant_id = p['participant_id']
        scheduled_time = parse_participant_id(participant_id)

        if scheduled_time is None:
            print(f"Skipping participant with unparseable ID: {participant_id}")
            continue

        participant_info = {
            'id': participant_id,
            'scheduled_time': scheduled_time,
            'folders': p['source_folders'],
            'num_conversations': p['num_conversations']
        }

        # Add to lookup for each folder this participant used
        for folder in p['source_folders']:
            lookup[folder].append(participant_info)

    return lookup

def find_best_match(conversation: Dict, participant_lookup: Dict[str, List[Dict]],
                    time_threshold_minutes: int = 120) -> Optional[Tuple[str, float, str]]:
    """
    Find the best matching participant for a conversation based on:
    1. Same CSN folder
    2. Closest timestamp within threshold

    Returns: (participant_id, time_difference_minutes, confidence) or None
    """
    conv_folder = conversation['source_folder']
    conv_time = datetime.fromtimestamp(conversation['create_time'])

    # Get all participants who used this folder
    candidates = participant_lookup.get(conv_folder, [])

    if not candidates:
        return None

    best_match = None
    best_time_diff = float('inf')

    for candidate in candidates:
        scheduled_time = candidate['scheduled_time']
        time_diff = abs((conv_time - scheduled_time).total_seconds() / 60)  # in minutes

        # Check if within threshold
        if time_diff < time_threshold_minutes and time_diff < best_time_diff:
            best_time_diff = time_diff
            best_match = candidate

    if best_match:
        # Determine confidence level
        if best_time_diff < 15:
            confidence = "high"
        elif best_time_diff < 45:
            confidence = "medium"
        else:
            confidence = "low"

        return (best_match['id'], best_time_diff, confidence)

    return None

def match_conversations(unmatched_conversations: List[Dict],
                       participants: List[Dict],
                       time_threshold_minutes: int = 120) -> Tuple[List[Dict], List[Dict], Dict]:
    """
    Match unmatched conversations to participants

    Returns:
        - newly_matched: conversations that were successfully matched
        - still_unmatched: conversations that couldn't be matched
        - stats: matching statistics
    """
    # Build participant lookup
    participant_lookup = build_participant_lookup(participants)

    newly_matched = []
    still_unmatched = []

    stats = {
        'total_unmatched': len(unmatched_conversations),
        'newly_matched': 0,
        'still_unmatched': 0,
        'high_confidence': 0,
        'medium_confidence': 0,
        'low_confidence': 0,
        'by_folder': defaultdict(int)
    }

    for conv in unmatched_conversations:
        match_result = find_best_match(conv, participant_lookup, time_threshold_minutes)

        if match_result:
            participant_id, time_diff, confidence = match_result

            # Add match info to conversation
            matched_conv = conv.copy()
            matched_conv['participant_id'] = participant_id
            matched_conv['match_method'] = 'timestamp_proximity'
            matched_conv['match_confidence'] = confidence
            matched_conv['match_time_diff_minutes'] = round(time_diff, 2)

            newly_matched.append(matched_conv)

            # Update stats
            stats['newly_matched'] += 1
            stats[f'{confidence}_confidence'] += 1
            stats['by_folder'][conv['source_folder']] += 1

            conv_time = datetime.fromtimestamp(conv['create_time'])
            print(f"✓ Matched: {conv['title'][:30]:30} | {conv_time.strftime('%d/%m/%Y %H:%M')} | "
                  f"Folder: {conv['source_folder']} -> {participant_id} "
                  f"(±{time_diff:.1f}min, {confidence} confidence)")
        else:
            still_unmatched.append(conv)
            stats['still_unmatched'] += 1

            conv_time = datetime.fromtimestamp(conv['create_time'])
            print(f"✗ No match: {conv['title'][:30]:30} | {conv_time.strftime('%d/%m/%Y %H:%M')} | "
                  f"Folder: {conv['source_folder']}")

    return newly_matched, still_unmatched, stats

def main():
    print("=" * 80)
    print("SMART PARTICIPANT MATCHER")
    print("Matching conversations without explicit participant IDs")
    print("=" * 80)

    # Load data
    print("\n📂 Loading data...")
    with open('output/unmatched_conversations.json', 'r') as f:
        unmatched_conversations = json.load(f)

    with open('output/true_participant_summary.json', 'r') as f:
        participants = json.load(f)

    with open('output/participant_matched_conversations.json', 'r') as f:
        already_matched = json.load(f)

    print(f"   - Unmatched conversations: {len(unmatched_conversations)}")
    print(f"   - Already matched: {len(already_matched)}")
    print(f"   - Total participants: {len(participants)}")

    # Perform matching
    print("\n🔍 Matching conversations based on timestamps and folders...")
    print("-" * 80)

    newly_matched, still_unmatched, stats = match_conversations(
        unmatched_conversations,
        participants,
        time_threshold_minutes=120  # 2 hour window
    )

    # Combine with already matched conversations
    all_matched = already_matched + newly_matched

    # Save results
    print("\n💾 Saving results...")
    with open('output/all_matched_conversations.json', 'w') as f:
        json.dump(all_matched, f, indent=2)

    with open('output/still_unmatched_conversations.json', 'w') as f:
        json.dump(still_unmatched, f, indent=2)

    with open('output/newly_matched_conversations.json', 'w') as f:
        json.dump(newly_matched, f, indent=2)

    # Print statistics
    print("\n" + "=" * 80)
    print("MATCHING RESULTS")
    print("=" * 80)
    print(f"\n📊 Overall Statistics:")
    print(f"   • Total unmatched conversations: {stats['total_unmatched']}")
    print(f"   • Successfully matched: {stats['newly_matched']} ({stats['newly_matched']/stats['total_unmatched']*100:.1f}%)")
    print(f"   • Still unmatched: {stats['still_unmatched']} ({stats['still_unmatched']/stats['total_unmatched']*100:.1f}%)")

    print(f"\n🎯 Match Confidence Breakdown:")
    print(f"   • High confidence (<15 min): {stats['high_confidence']}")
    print(f"   • Medium confidence (15-45 min): {stats['medium_confidence']}")
    print(f"   • Low confidence (45-120 min): {stats['low_confidence']}")

    print(f"\n📁 Matches by Folder:")
    for folder in sorted(stats['by_folder'].keys(), key=lambda x: int(x.replace('CSN', ''))):
        count = stats['by_folder'][folder]
        print(f"   • {folder}: {count} conversations")

    print(f"\n📦 Output Files:")
    print(f"   • output/all_matched_conversations.json - All matched conversations ({len(all_matched)} total)")
    print(f"   • output/newly_matched_conversations.json - Newly matched conversations ({len(newly_matched)})")
    print(f"   • output/still_unmatched_conversations.json - Still unmatched ({len(still_unmatched)})")

    print("\n" + "=" * 80)
    print("✅ MATCHING COMPLETE!")
    print("=" * 80)

if __name__ == "__main__":
    main()
