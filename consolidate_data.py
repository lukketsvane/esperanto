#!/usr/bin/env python3
"""Quick script to consolidate raw promptdata into matched_conversations.json"""

import json
import os
from pathlib import Path
from datetime import datetime

def consolidate_conversations():
    """Consolidate all conversations from CSN folders"""
    all_conversations = []
    promptdata_path = Path('promptdata')

    # Process each CSN folder
    for csn_folder in sorted(promptdata_path.glob('CSN*')):
        if not csn_folder.is_dir():
            continue

        folder_name = csn_folder.name
        print(f"Processing {folder_name}...")

        # Check both direct files and nested csn folders
        conv_files = list(csn_folder.glob('conversations.json'))
        conv_files.extend(csn_folder.glob('*/conversations.json'))

        for conv_file in conv_files:
            try:
                with open(conv_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                # Handle both list and single conversation formats
                conversations = data if isinstance(data, list) else [data]

                # Add metadata to each conversation
                for conv in conversations:
                    if conv and isinstance(conv, dict):
                        conv['source_folder'] = folder_name
                        conv['source_file'] = str(conv_file.relative_to(promptdata_path))
                        all_conversations.append(conv)

            except (json.JSONDecodeError, IOError) as e:
                print(f"  Error reading {conv_file}: {e}")
                continue

    print(f"\nTotal conversations found: {len(all_conversations)}")

    # Save consolidated file
    output_file = Path('output/matched_conversations.json')
    output_file.parent.mkdir(exist_ok=True)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_conversations, f, indent=2, ensure_ascii=False)

    print(f"Saved to {output_file}")
    return len(all_conversations)

if __name__ == '__main__':
    count = consolidate_conversations()
    print(f"\n✓ Successfully consolidated {count} conversations")
