#!/usr/bin/env python3
"""Match conversations to participants based on source folders"""

import json
from pathlib import Path
from collections import defaultdict

def load_user_data():
    """Load all user.json files from promptdata folders"""
    users = {}
    promptdata_path = Path('promptdata')

    # Process each CSN folder
    for csn_folder in sorted(promptdata_path.glob('CSN*')):
        if not csn_folder.is_dir():
            continue

        folder_name = csn_folder.name

        # Check both direct user.json and nested folders
        user_files = list(csn_folder.glob('user.json'))
        user_files.extend(csn_folder.glob('*/user.json'))

        for user_file in user_files:
            try:
                with open(user_file, 'r', encoding='utf-8') as f:
                    user_data = json.load(f)

                # Extract participant ID from email if available
                email = user_data.get('email', '')
                if email:
                    # Extract CSN number from email like "uksurveycsn01@gmail.com"
                    if 'csn' in email.lower():
                        csn_num = ''.join(filter(str.isdigit, email.split('csn')[-1].split('@')[0]))
                        participant_id = f"CSN{csn_num}"
                    else:
                        participant_id = folder_name
                else:
                    participant_id = folder_name

                users[folder_name] = {
                    'participant_id': participant_id,
                    'user_id': user_data.get('id', ''),
                    'email': email,
                    'chatgpt_plus_user': user_data.get('chatgpt_plus_user', False),
                    'birth_year': user_data.get('birth_year', None),
                    'source_folder': folder_name
                }

                print(f"Loaded user data for {folder_name}: {participant_id}")

            except (json.JSONDecodeError, IOError) as e:
                print(f"Error reading {user_file}: {e}")
                continue

    return users

def match_conversations():
    """Match conversations to participants"""

    # Load user data
    users = load_user_data()
    print(f"\n{'='*60}")
    print(f"Loaded {len(users)} participants")
    print('='*60)

    # Load conversations
    with open('output/matched_conversations.json', 'r', encoding='utf-8') as f:
        conversations = json.load(f)

    print(f"\nTotal conversations: {len(conversations)}")

    # Match conversations to participants
    matched = []
    unmatched = []

    for conv in conversations:
        source_folder = conv.get('source_folder', '')

        if source_folder in users:
            # Match found!
            user_info = users[source_folder]

            # Add participant information to conversation
            conv['participant_id'] = user_info['participant_id']
            conv['participant_email'] = user_info['email']
            conv['participant_user_id'] = user_info['user_id']
            conv['participant_birth_year'] = user_info['birth_year']
            conv['chatgpt_plus_user'] = user_info['chatgpt_plus_user']
            conv['matching_confidence'] = 1.0  # High confidence - same folder

            matched.append(conv)
        else:
            unmatched.append(conv)

    print(f"\nMatched conversations: {len(matched)} ({len(matched)/len(conversations)*100:.1f}%)")
    print(f"Unmatched conversations: {len(unmatched)} ({len(unmatched)/len(conversations)*100:.1f}%)")

    # Show unmatched details
    if unmatched:
        print(f"\n{'='*60}")
        print("UNMATCHED CONVERSATIONS")
        print('='*60)

        unmatched_folders = defaultdict(int)
        for conv in unmatched:
            folder = conv.get('source_folder', 'Unknown')
            unmatched_folders[folder] += 1

        for folder, count in sorted(unmatched_folders.items()):
            print(f"  {folder}: {count} conversations")

    # Save matched conversations
    output_file = Path('output/matched_conversations.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(matched, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Saved {len(matched)} matched conversations to {output_file}")

    # Save unmatched for review
    if unmatched:
        unmatched_file = Path('output/unmatched_for_review.json')
        with open(unmatched_file, 'w', encoding='utf-8') as f:
            json.dump(unmatched, f, indent=2, ensure_ascii=False)
        print(f"✓ Saved {len(unmatched)} unmatched conversations to {unmatched_file}")

    # Create participant summary
    participants = []
    conv_by_participant = defaultdict(list)

    for conv in matched:
        pid = conv['participant_id']
        conv_by_participant[pid].append(conv)

    for pid, convs in conv_by_participant.items():
        # Get participant info from first conversation
        first_conv = convs[0]
        participants.append({
            'participant_id': pid,
            'email': first_conv.get('participant_email', ''),
            'user_id': first_conv.get('participant_user_id', ''),
            'birth_year': first_conv.get('participant_birth_year', ''),
            'chatgpt_plus_user': first_conv.get('chatgpt_plus_user', False),
            'num_conversations': len(convs),
            'source_folder': first_conv.get('source_folder', '')
        })

    # Save participant summary
    summary_file = Path('output/participant_summary.json')
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(participants, f, indent=2, ensure_ascii=False)

    print(f"✓ Saved participant summary to {summary_file} ({len(participants)} participants)")

    return matched, unmatched, participants

if __name__ == '__main__':
    print("MATCHING CONVERSATIONS TO PARTICIPANTS")
    print("="*60)
    matched, unmatched, participants = match_conversations()
    print(f"\n{'='*60}")
    print("MATCHING COMPLETE!")
    print(f"  Matched: {len(matched)} conversations")
    print(f"  Participants: {len(participants)}")
    print(f"  Unmatched: {len(unmatched)} conversations")
    print('='*60)
