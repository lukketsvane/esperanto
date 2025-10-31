#!/usr/bin/env python3
"""
Generate comprehensive final summary of all participants and their conversations
"""

import json
from collections import defaultdict
from datetime import datetime

def generate_participant_summary(all_matched_conversations):
    """
    Generate a comprehensive summary of all participants with their matched conversations
    """
    participant_data = defaultdict(lambda: {
        'conversations': [],
        'folders': set(),
        'match_methods': defaultdict(int),
        'confidence_levels': defaultdict(int)
    })

    # Aggregate data by participant
    for conv in all_matched_conversations:
        participant_id = conv.get('participant_id')

        if not participant_id:
            continue

        participant_data[participant_id]['conversations'].append({
            'title': conv.get('title'),
            'create_time': conv.get('create_time'),
            'update_time': conv.get('update_time'),
            'source_folder': conv.get('source_folder'),
            'match_method': conv.get('match_method', 'explicit_id'),
            'match_confidence': conv.get('match_confidence'),
            'match_time_diff_minutes': conv.get('match_time_diff_minutes')
        })

        participant_data[participant_id]['folders'].add(conv.get('source_folder'))
        participant_data[participant_id]['match_methods'][conv.get('match_method', 'explicit_id')] += 1

        if conv.get('match_confidence'):
            participant_data[participant_id]['confidence_levels'][conv.get('match_confidence')] += 1

    # Convert to list format
    summary = []
    for participant_id, data in sorted(participant_data.items()):
        summary.append({
            'participant_id': participant_id,
            'num_conversations': len(data['conversations']),
            'source_folders': sorted(list(data['folders'])),
            'num_folders': len(data['folders']),
            'match_methods': dict(data['match_methods']),
            'confidence_breakdown': dict(data['confidence_levels']),
            'conversations': sorted(data['conversations'], key=lambda x: x['create_time'])
        })

    return summary

def generate_statistics_report(all_matched, newly_matched, still_unmatched, participant_summary):
    """
    Generate comprehensive statistics report
    """
    report = {
        'generated_at': datetime.now().isoformat(),
        'total_conversations': len(all_matched) + len(still_unmatched),
        'matched_conversations': len(all_matched),
        'unmatched_conversations': len(still_unmatched),
        'match_rate': len(all_matched) / (len(all_matched) + len(still_unmatched)) * 100,
        'total_participants': len(participant_summary),
        'matching_breakdown': {
            'explicit_id': len([c for c in all_matched if c.get('match_method') != 'timestamp_proximity']),
            'timestamp_proximity': len(newly_matched)
        },
        'confidence_breakdown': {
            'high': len([c for c in newly_matched if c.get('match_confidence') == 'high']),
            'medium': len([c for c in newly_matched if c.get('match_confidence') == 'medium']),
            'low': len([c for c in newly_matched if c.get('match_confidence') == 'low'])
        },
        'participants_by_conversation_count': {}
    }

    # Analyze participants by conversation count
    conv_counts = defaultdict(int)
    for p in participant_summary:
        count = p['num_conversations']
        conv_counts[count] += 1

    report['participants_by_conversation_count'] = dict(sorted(conv_counts.items()))

    return report

def main():
    print("=" * 80)
    print("GENERATING FINAL COMPREHENSIVE SUMMARY")
    print("=" * 80)

    # Load all data
    print("\n📂 Loading data...")
    with open('output/all_matched_conversations.json') as f:
        all_matched = json.load(f)

    with open('output/newly_matched_conversations.json') as f:
        newly_matched = json.load(f)

    with open('output/still_unmatched_conversations.json') as f:
        still_unmatched = json.load(f)

    print(f"   - Total matched: {len(all_matched)}")
    print(f"   - Newly matched: {len(newly_matched)}")
    print(f"   - Still unmatched: {len(still_unmatched)}")

    # Generate participant summary
    print("\n📊 Generating participant summary...")
    participant_summary = generate_participant_summary(all_matched)
    print(f"   - Total participants: {len(participant_summary)}")

    # Generate statistics
    print("\n📈 Generating statistics report...")
    statistics = generate_statistics_report(all_matched, newly_matched, still_unmatched, participant_summary)

    # Save outputs
    print("\n💾 Saving outputs...")
    with open('output/final_participant_summary_complete.json', 'w') as f:
        json.dump(participant_summary, f, indent=2)

    with open('output/final_statistics_report.json', 'w') as f:
        json.dump(statistics, f, indent=2)

    # Print report
    print("\n" + "=" * 80)
    print("FINAL STATISTICS REPORT")
    print("=" * 80)

    print(f"\n📊 Overall Statistics:")
    print(f"   • Total conversations: {statistics['total_conversations']}")
    print(f"   • Matched: {statistics['matched_conversations']} ({statistics['match_rate']:.1f}%)")
    print(f"   • Unmatched: {statistics['unmatched_conversations']} ({100-statistics['match_rate']:.1f}%)")
    print(f"   • Total participants: {statistics['total_participants']}")

    print(f"\n🔍 Matching Method Breakdown:")
    print(f"   • Explicit ID in conversation: {statistics['matching_breakdown']['explicit_id']}")
    print(f"   • Timestamp proximity matching: {statistics['matching_breakdown']['timestamp_proximity']}")
    print(f"     - High confidence (<15 min): {statistics['confidence_breakdown']['high']}")
    print(f"     - Medium confidence (15-45 min): {statistics['confidence_breakdown']['medium']}")
    print(f"     - Low confidence (45-120 min): {statistics['confidence_breakdown']['low']}")

    print(f"\n👥 Participant Distribution:")
    print(f"   Participants by number of conversations:")
    for count, num_participants in sorted(statistics['participants_by_conversation_count'].items()):
        print(f"   • {count} conversation(s): {num_participants} participant(s)")

    print(f"\n📦 Output Files:")
    print(f"   • output/all_matched_conversations.json - All matched conversations")
    print(f"   • output/final_participant_summary_complete.json - Complete participant summary")
    print(f"   • output/final_statistics_report.json - Statistics report")
    print(f"   • output/still_unmatched_conversations.json - Unmatched conversations")

    print("\n" + "=" * 80)
    print("✅ SUMMARY GENERATION COMPLETE!")
    print("=" * 80)

if __name__ == "__main__":
    main()
