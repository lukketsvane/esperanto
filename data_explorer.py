#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Interactive Data Explorer for Esperanto Study Dataset
Explore conversations, participants, and statistics
"""
import json
import sys
import io
from datetime import datetime
from collections import defaultdict
import re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class DataExplorer:
    def __init__(self):
        data_file = 'output/matched_conversations.json'
        with open(data_file, 'r', encoding='utf-8') as f:
            self.data = json.load(f)

        self.participants = self._build_participant_index()
        self.folders = self._build_folder_index()

    def _build_participant_index(self):
        """Build index of conversations by participant"""
        index = defaultdict(list)
        for conv in self.data:
            pid = conv.get('matched_participant_id')
            if pid:
                index[pid].append(conv)
        return index

    def _build_folder_index(self):
        """Build index of conversations by folder"""
        index = defaultdict(list)
        for conv in self.data:
            index[conv['folder']].append(conv)
        return index

    def show_overview(self):
        """Show dataset overview"""
        print("\n" + "="*100)
        print("ESPERANTO STUDY DATASET - OVERVIEW")
        print("="*100)

        total = len(self.data)
        matched = len([c for c in self.data if c['match_method'] != 'unmatched'])
        unmatched = total - matched

        print(f"\nDataset Size:")
        print(f"  Total conversations: {total}")
        print(f"  Matched: {matched} ({matched/total*100:.1f}%)")
        print(f"  Unmatched: {unmatched} ({unmatched/total*100:.1f}%)")

        print(f"\nParticipants:")
        print(f"  Unique participants: {len(self.participants)}")

        # Participation distribution
        conv_per_participant = [len(convs) for convs in self.participants.values()]
        print(f"  Avg conversations per participant: {sum(conv_per_participant)/len(conv_per_participant):.1f}")
        print(f"  Min conversations: {min(conv_per_participant)}")
        print(f"  Max conversations: {max(conv_per_participant)}")

        print(f"\nFolders:")
        print(f"  Total folders: {len(self.folders)}")

        # Message statistics
        total_user_msgs = sum(c['user_msg_count'] for c in self.data)
        total_assistant_msgs = sum(c['assistant_msg_count'] for c in self.data)

        print(f"\nMessages:")
        print(f"  Total user messages: {total_user_msgs}")
        print(f"  Total assistant messages: {total_assistant_msgs}")
        print(f"  Avg per conversation: {(total_user_msgs + total_assistant_msgs)/total:.1f}")

        # Date range
        dates = [datetime.fromisoformat(c['create_dt']) for c in self.data]
        print(f"\nDate Range:")
        print(f"  First conversation: {min(dates).strftime('%Y-%m-%d %H:%M')}")
        print(f"  Last conversation: {max(dates).strftime('%Y-%m-%d %H:%M')}")

    def list_participants(self, limit=20, sort_by='conversations'):
        """List participants with statistics"""
        print("\n" + "="*100)
        print(f"PARTICIPANTS (showing top {limit})")
        print("="*100)

        participant_stats = []
        for pid, convs in self.participants.items():
            total_msgs = sum(c['user_msg_count'] + c['assistant_msg_count'] for c in convs)
            total_user_chars = sum(c.get('total_user_chars', 0) for c in convs)
            folders = list(set(c['folder'] for c in convs))

            # Date range
            dates = [datetime.fromisoformat(c['create_dt']) for c in convs]
            date_range = (max(dates) - min(dates)).total_seconds() / 3600  # hours

            participant_stats.append({
                'id': pid,
                'conversations': len(convs),
                'messages': total_msgs,
                'chars': total_user_chars,
                'folders': len(folders),
                'date_range_hours': date_range,
                'first_date': min(dates),
                'last_date': max(dates)
            })

        # Sort
        if sort_by == 'conversations':
            participant_stats.sort(key=lambda x: x['conversations'], reverse=True)
        elif sort_by == 'messages':
            participant_stats.sort(key=lambda x: x['messages'], reverse=True)
        elif sort_by == 'chars':
            participant_stats.sort(key=lambda x: x['chars'], reverse=True)

        print(f"\n{'Participant ID':<20} | {'Convs':>5} | {'Msgs':>5} | {'Chars':>7} | {'Folders':>7} | {'Date Range':<25}")
        print("-" * 100)

        for stat in participant_stats[:limit]:
            date_range_str = f"{stat['first_date'].strftime('%m-%d')} to {stat['last_date'].strftime('%m-%d')}"
            print(f"{stat['id']:<20} | {stat['conversations']:>5} | {stat['messages']:>5} | " +
                  f"{stat['chars']:>7} | {stat['folders']:>7} | {date_range_str:<25}")

    def show_participant(self, participant_id):
        """Show detailed information about a participant"""
        if participant_id not in self.participants:
            print(f"\n[ERROR] Participant '{participant_id}' not found")
            return

        convs = sorted(self.participants[participant_id], key=lambda x: x['create_time'])

        print("\n" + "="*100)
        print(f"PARTICIPANT: {participant_id}")
        print("="*100)

        # Statistics
        total_convs = len(convs)
        total_user_msgs = sum(c['user_msg_count'] for c in convs)
        total_assistant_msgs = sum(c['assistant_msg_count'] for c in convs)
        total_user_chars = sum(c.get('total_user_chars', 0) for c in convs)
        total_assistant_chars = sum(c.get('total_assistant_chars', 0) for c in convs)

        folders = list(set(c['folder'] for c in convs))

        dates = [datetime.fromisoformat(c['create_dt']) for c in convs]
        date_range = (max(dates) - min(dates)).total_seconds() / 3600

        print(f"\nOverview:")
        print(f"  Conversations: {total_convs}")
        print(f"  User messages: {total_user_msgs}")
        print(f"  Assistant messages: {total_assistant_msgs}")
        print(f"  User characters: {total_user_chars}")
        print(f"  Assistant characters: {total_assistant_chars}")
        print(f"  Folders: {', '.join(sorted(folders))}")
        print(f"  Active period: {min(dates).strftime('%Y-%m-%d')} to {max(dates).strftime('%Y-%m-%d')} ({date_range:.1f} hours)")

        # Match methods
        methods = defaultdict(int)
        for c in convs:
            methods[c['match_method']] += 1

        print(f"\nMatch Methods:")
        for method, count in sorted(methods.items(), key=lambda x: x[1], reverse=True):
            print(f"  {method}: {count}")

        # Conversation timeline
        print(f"\nConversation Timeline:")
        print(f"\n{'Date/Time':<16} | {'Folder':>5} | {'Msgs':>4} | {'Match Method':<30} | {'Conf':>4} | {'Title':<30}")
        print("-" * 100)

        for c in convs:
            dt = datetime.fromisoformat(c['create_dt'])
            msgs = c['user_msg_count'] + c['assistant_msg_count']
            conf = c.get('match_confidence', 0)
            title = c['conv_title'][:30]

            print(f"{dt.strftime('%m-%d %H:%M'):<16} | {c['folder']:>5} | {msgs:>4} | " +
                  f"{c['match_method']:<30} | {conf:>4.2f} | {title:<30}")

    def list_folders(self):
        """List folders with statistics"""
        print("\n" + "="*100)
        print("FOLDERS")
        print("="*100)

        folder_stats = []
        for folder, convs in self.folders.items():
            matched = [c for c in convs if c['match_method'] != 'unmatched']
            participants = list(set(c.get('matched_participant_id') for c in matched if c.get('matched_participant_id')))

            total_msgs = sum(c['user_msg_count'] + c['assistant_msg_count'] for c in convs)

            folder_stats.append({
                'folder': folder,
                'conversations': len(convs),
                'matched': len(matched),
                'participants': len(participants),
                'messages': total_msgs
            })

        folder_stats.sort(key=lambda x: x['folder'])

        print(f"\n{'Folder':<10} | {'Convs':>5} | {'Matched':>7} | {'Match %':>7} | {'Parts':>5} | {'Msgs':>5}")
        print("-" * 100)

        for stat in folder_stats:
            match_pct = stat['matched'] / stat['conversations'] * 100 if stat['conversations'] > 0 else 0
            print(f"{stat['folder']:<10} | {stat['conversations']:>5} | {stat['matched']:>7} | " +
                  f"{match_pct:>6.1f}% | {stat['participants']:>5} | {stat['messages']:>5}")

    def show_folder(self, folder):
        """Show detailed information about a folder"""
        if folder not in self.folders:
            print(f"\n[ERROR] Folder '{folder}' not found")
            return

        convs = sorted(self.folders[folder], key=lambda x: x['create_time'])

        print("\n" + "="*100)
        print(f"FOLDER: {folder}")
        print("="*100)

        # Statistics
        matched = [c for c in convs if c['match_method'] != 'unmatched']
        participants = list(set(c.get('matched_participant_id') for c in matched if c.get('matched_participant_id')))

        print(f"\nOverview:")
        print(f"  Conversations: {len(convs)}")
        print(f"  Matched: {len(matched)} ({len(matched)/len(convs)*100:.1f}%)")
        print(f"  Participants: {len(participants)}")

        if participants:
            print(f"\nParticipants in this folder:")
            for pid in sorted(participants):
                p_convs = [c for c in convs if c.get('matched_participant_id') == pid]
                print(f"  {pid}: {len(p_convs)} conversations")

        # Conversations
        print(f"\nConversations:")
        print(f"\n{'Conv#':>5} | {'Date/Time':<16} | {'Msgs':>4} | {'Participant ID':<20} | {'Method':<30} | {'Title':<25}")
        print("-" * 100)

        for c in convs:
            dt = datetime.fromisoformat(c['create_dt'])
            msgs = c['user_msg_count'] + c['assistant_msg_count']
            pid = c.get('matched_participant_id', 'UNMATCHED')[:20]
            title = c['conv_title'][:25]

            print(f"{c['conv_index']:>5} | {dt.strftime('%m-%d %H:%M'):<16} | {msgs:>4} | " +
                  f"{pid:<20} | {c['match_method']:<30} | {title:<25}")

    def search_conversations(self, query, search_in='title'):
        """Search conversations by title or content"""
        print("\n" + "="*100)
        print(f"SEARCH RESULTS: '{query}' in {search_in}")
        print("="*100)

        results = []
        query_lower = query.lower()

        for c in self.data:
            if search_in == 'title':
                if query_lower in c['conv_title'].lower():
                    results.append(c)
            elif search_in == 'first_message':
                first_msg = c.get('first_user_msg', '')
                if first_msg and query_lower in first_msg.lower():
                    results.append(c)

        print(f"\nFound {len(results)} results:")

        if results:
            print(f"\n{'Folder':<10} | {'Conv#':>5} | {'Date/Time':<16} | {'Participant':<20} | {'Title/Content':<40}")
            print("-" * 100)

            for c in results[:50]:  # Limit to 50 results
                dt = datetime.fromisoformat(c['create_dt'])
                pid = c.get('matched_participant_id', 'UNMATCHED')[:20]

                if search_in == 'title':
                    content = c['conv_title'][:40]
                else:
                    content = c.get('first_user_msg', '')[:40]

                print(f"{c['folder']:<10} | {c['conv_index']:>5} | {dt.strftime('%m-%d %H:%M'):<16} | " +
                      f"{pid:<20} | {content:<40}")

            if len(results) > 50:
                print(f"\n... and {len(results) - 50} more results")

    def show_statistics(self):
        """Show detailed statistics"""
        print("\n" + "="*100)
        print("DETAILED STATISTICS")
        print("="*100)

        # Match method distribution
        print("\n1. MATCH METHOD DISTRIBUTION:")
        methods = defaultdict(int)
        for c in self.data:
            methods[c['match_method']] += 1

        for method, count in sorted(methods.items(), key=lambda x: x[1], reverse=True):
            pct = count / len(self.data) * 100
            print(f"   {method:<35s}: {count:>3} ({pct:>5.1f}%)")

        # Confidence distribution
        print("\n2. CONFIDENCE DISTRIBUTION:")
        conf_buckets = defaultdict(int)
        for c in self.data:
            conf = c.get('match_confidence', 0)
            if conf == 0:
                bucket = '0.00'
            elif conf >= 0.95:
                bucket = '0.95-1.00'
            elif conf >= 0.80:
                bucket = '0.80-0.94'
            elif conf >= 0.60:
                bucket = '0.60-0.79'
            elif conf >= 0.40:
                bucket = '0.40-0.59'
            else:
                bucket = '0.01-0.39'
            conf_buckets[bucket] += 1

        for bucket in ['0.95-1.00', '0.80-0.94', '0.60-0.79', '0.40-0.59', '0.01-0.39', '0.00']:
            count = conf_buckets[bucket]
            pct = count / len(self.data) * 100
            print(f"   {bucket}: {count:>3} ({pct:>5.1f}%)")

        # Messages per conversation
        print("\n3. MESSAGES PER CONVERSATION:")
        msg_counts = [c['user_msg_count'] + c['assistant_msg_count'] for c in self.data]
        print(f"   Min: {min(msg_counts)}")
        print(f"   Max: {max(msg_counts)}")
        print(f"   Mean: {sum(msg_counts)/len(msg_counts):.1f}")
        print(f"   Median: {sorted(msg_counts)[len(msg_counts)//2]}")

        # Conversations per participant
        print("\n4. CONVERSATIONS PER PARTICIPANT:")
        conv_per_part = [len(convs) for convs in self.participants.values()]
        print(f"   Min: {min(conv_per_part)}")
        print(f"   Max: {max(conv_per_part)}")
        print(f"   Mean: {sum(conv_per_part)/len(conv_per_part):.1f}")
        print(f"   Median: {sorted(conv_per_part)[len(conv_per_part)//2]}")

        # Daily distribution
        print("\n5. CONVERSATIONS BY DATE:")
        by_date = defaultdict(int)
        for c in self.data:
            dt = datetime.fromisoformat(c['create_dt'])
            by_date[dt.strftime('%Y-%m-%d')] += 1

        for date in sorted(by_date.keys()):
            count = by_date[date]
            print(f"   {date}: {count:>3} conversations")

    def interactive_menu(self):
        """Interactive menu for exploring data"""
        while True:
            print("\n" + "="*100)
            print("DATA EXPLORER - MENU")
            print("="*100)
            print("\n1. Show overview")
            print("2. List participants")
            print("3. Show participant details")
            print("4. List folders")
            print("5. Show folder details")
            print("6. Search conversations")
            print("7. Show statistics")
            print("8. Exit")

            choice = input("\nEnter choice (1-8): ").strip()

            if choice == '1':
                self.show_overview()

            elif choice == '2':
                sort_by = input("Sort by (conversations/messages/chars) [conversations]: ").strip() or 'conversations'
                limit = input("How many to show? [20]: ").strip()
                limit = int(limit) if limit else 20
                self.list_participants(limit=limit, sort_by=sort_by)

            elif choice == '3':
                pid = input("Enter participant ID: ").strip()
                self.show_participant(pid)

            elif choice == '4':
                self.list_folders()

            elif choice == '5':
                folder = input("Enter folder name (e.g., CSN1): ").strip()
                self.show_folder(folder)

            elif choice == '6':
                query = input("Search query: ").strip()
                search_in = input("Search in (title/first_message) [title]: ").strip() or 'title'
                self.search_conversations(query, search_in=search_in)

            elif choice == '7':
                self.show_statistics()

            elif choice == '8':
                print("\nExiting Data Explorer. Goodbye!")
                break

            else:
                print("\n[ERROR] Invalid choice. Please enter 1-8.")

def main():
    print("\n" + "="*100)
    print("ESPERANTO STUDY DATASET - DATA EXPLORER")
    print("="*100)
    print("\nLoading data...")

    explorer = DataExplorer()

    print(f"Loaded {len(explorer.data)} conversations from {len(explorer.participants)} participants")

    # Check if running interactively
    if len(sys.argv) > 1:
        # Command-line mode
        command = sys.argv[1].lower()

        if command == 'overview':
            explorer.show_overview()
        elif command == 'participants':
            explorer.list_participants()
        elif command == 'participant' and len(sys.argv) > 2:
            explorer.show_participant(sys.argv[2])
        elif command == 'folders':
            explorer.list_folders()
        elif command == 'folder' and len(sys.argv) > 2:
            explorer.show_folder(sys.argv[2])
        elif command == 'stats':
            explorer.show_statistics()
        elif command == 'search' and len(sys.argv) > 2:
            query = sys.argv[2]
            search_in = sys.argv[3] if len(sys.argv) > 3 else 'title'
            explorer.search_conversations(query, search_in=search_in)
        else:
            print("\nUsage:")
            print("  python data_explorer.py                    - Interactive mode")
            print("  python data_explorer.py overview           - Show overview")
            print("  python data_explorer.py participants       - List participants")
            print("  python data_explorer.py participant <id>   - Show participant details")
            print("  python data_explorer.py folders            - List folders")
            print("  python data_explorer.py folder <name>      - Show folder details")
            print("  python data_explorer.py stats              - Show statistics")
            print("  python data_explorer.py search <query> [title|first_message]")
    else:
        # Interactive mode
        explorer.interactive_menu()

if __name__ == '__main__':
    main()
