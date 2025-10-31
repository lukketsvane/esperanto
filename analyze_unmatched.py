#!/usr/bin/env python3
"""Analyze unmatched conversations and identify missing participant data"""

import json
from pathlib import Path
from collections import defaultdict

def analyze_matching():
    """Analyze conversation-participant matching"""

    # Load conversations
    with open('output/matched_conversations.json', 'r', encoding='utf-8') as f:
        conversations = json.load(f)

    print(f"Total conversations: {len(conversations)}")

    # Analyze matching status
    matched = []
    unmatched = []

    for conv in conversations:
        # Check for participant ID indicators
        has_participant_id = False
        participant_id = None

        # Check various fields that might contain participant info
        if 'participant_id' in conv:
            has_participant_id = True
            participant_id = conv.get('participant_id')
        elif 'user_id' in conv:
            has_participant_id = True
            participant_id = conv.get('user_id')
        elif 'title' in conv:
            title = conv.get('title', '')
            # Check if title contains date/time pattern like "01122024_1500"
            if '_' in title and any(char.isdigit() for char in title):
                has_participant_id = True
                participant_id = title

        if has_participant_id and participant_id:
            matched.append({
                'conversation': conv,
                'participant_id': participant_id
            })
        else:
            unmatched.append(conv)

    print(f"\nMatched conversations: {len(matched)} ({len(matched)/len(conversations)*100:.1f}%)")
    print(f"Unmatched conversations: {len(unmatched)} ({len(unmatched)/len(conversations)*100:.1f}%)")

    # Analyze unmatched conversations
    if unmatched:
        print(f"\n{'='*60}")
        print("UNMATCHED CONVERSATIONS ANALYSIS")
        print('='*60)

        for i, conv in enumerate(unmatched[:10], 1):  # Show first 10
            print(f"\n[{i}] Unmatched Conversation:")
            print(f"  Source: {conv.get('source_folder', 'Unknown')}")
            print(f"  Title: {conv.get('title', 'No title')}")
            print(f"  Create time: {conv.get('create_time', 'Unknown')}")
            print(f"  Update time: {conv.get('update_time', 'Unknown')}")

            # Show first few messages if available
            if 'mapping' in conv:
                messages = []
                for msg_id, msg_data in conv['mapping'].items():
                    if msg_data and 'message' in msg_data:
                        message = msg_data['message']
                        if message and 'content' in message:
                            messages.append(message)
                print(f"  Messages: {len(messages)}")

        if len(unmatched) > 10:
            print(f"\n... and {len(unmatched) - 10} more unmatched conversations")

    # Save unmatched for review
    if unmatched:
        output_file = Path('output/unmatched_conversations.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(unmatched, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Saved unmatched conversations to {output_file}")

    return matched, unmatched

if __name__ == '__main__':
    matched, unmatched = analyze_matching()
    print(f"\n{'='*60}")
    print(f"Analysis complete!")
    print('='*60)
