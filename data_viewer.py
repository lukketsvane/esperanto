#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Interactive Data Viewer for Esperanto Study Dataset
A Streamlit-based web application for efficient data exploration
"""

import streamlit as st
import pandas as pd
import json
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path
from datetime import datetime
from collections import Counter
import sys

# Page configuration
st.set_page_config(
    page_title="Esperanto Study Data Viewer",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        padding: 1rem 0;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #1f77b4;
    }
    .stDataFrame {
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
    }
</style>
""", unsafe_allow_html=True)


@st.cache_data
def load_data():
    """Load and cache the dataset"""
    data_file = Path('output/matched_conversations.json')

    if not data_file.exists():
        st.error(f"""
        ⚠️ Data file not found: `{data_file}`

        Please ensure the data files are in the correct location:
        - `output/matched_conversations.json` - Main dataset
        - `output/final_participant_summary.csv` - Participant summaries
        - `output/conversation_metrics.csv` - Conversation metrics

        Run the data processing pipeline first or check the documentation.
        """)
        return None, None, None

    # Load main conversation data
    with open(data_file, 'r', encoding='utf-8') as f:
        conversations = json.load(f)

    # Convert to DataFrame
    df = pd.DataFrame(conversations)

    # Process and normalize column names
    # Map actual columns to expected columns
    column_mapping = {
        'source_folder': 'folder',
        'title': 'conv_title',
        'participant_id': 'matched_participant_id',
        'matching_confidence': 'match_confidence',
        'conversation_id': 'conv_id'
    }

    df = df.rename(columns=column_mapping)

    # Add missing columns with defaults
    if 'match_method' not in df.columns:
        # Infer match method from confidence
        df['match_method'] = df['match_confidence'].apply(
            lambda x: 'unmatched' if pd.isna(x) or x == 0.0 else 'matched'
        )

    # Fill NaN values in match_confidence with 0.0
    df['match_confidence'] = df['match_confidence'].fillna(0.0)

    # Extract create date and time from create_time timestamp
    df['create_dt'] = pd.to_datetime(df['create_time'], unit='s').dt.strftime('%Y%m%d')
    df['create_time_str'] = pd.to_datetime(df['create_time'], unit='s').dt.strftime('%Y-%m-%d %H:%M:%S')

    # Extract message counts and first user message from mapping
    def extract_message_info(mapping):
        if not mapping or not isinstance(mapping, dict):
            return 0, 0, ''

        user_msgs = 0
        assistant_msgs = 0
        first_user_msg = ''

        for node_id, node in mapping.items():
            if node and 'message' in node and node['message']:
                msg = node['message']
                if 'author' in msg and 'role' in msg['author']:
                    role = msg['author']['role']
                    if role == 'user':
                        user_msgs += 1
                        if not first_user_msg and 'content' in msg and 'parts' in msg['content']:
                            parts = msg['content']['parts']
                            if parts and len(parts) > 0:
                                first_user_msg = str(parts[0])[:200]  # First 200 chars
                    elif role == 'assistant':
                        assistant_msgs += 1

        return user_msgs, assistant_msgs, first_user_msg

    message_info = df['mapping'].apply(extract_message_info)
    df['user_msg_count'] = message_info.apply(lambda x: x[0])
    df['assistant_msg_count'] = message_info.apply(lambda x: x[1])
    df['first_user_msg'] = message_info.apply(lambda x: x[2])

    # Add conversation index
    df['conv_index'] = range(len(df))

    # Load additional data if available
    participant_summary = None
    conversation_metrics = None

    participant_file = Path('output/final_participant_summary.csv')
    if participant_file.exists():
        participant_summary = pd.read_csv(participant_file)

    metrics_file = Path('output/conversation_metrics.csv')
    if metrics_file.exists():
        conversation_metrics = pd.read_csv(metrics_file)

    return df, participant_summary, conversation_metrics


def create_overview_metrics(df):
    """Create overview metric cards"""
    col1, col2, col3, col4 = st.columns(4)

    total_conversations = len(df)
    matched = len(df[df['match_method'] != 'unmatched'])
    unique_participants = df['matched_participant_id'].nunique()
    unique_folders = df['folder'].nunique()

    with col1:
        st.metric(
            label="📄 Total Conversations",
            value=f"{total_conversations:,}",
            delta=f"{matched/total_conversations*100:.1f}% matched"
        )

    with col2:
        st.metric(
            label="👥 Unique Participants",
            value=f"{unique_participants:,}",
            delta=f"{matched/unique_participants:.1f} avg convs/participant"
        )

    with col3:
        st.metric(
            label="📁 Study Folders",
            value=f"{unique_folders}",
            delta=f"{total_conversations/unique_folders:.1f} avg convs/folder"
        )

    with col4:
        high_confidence = len(df[df['match_confidence'] >= 0.80])
        st.metric(
            label="✅ High Confidence",
            value=f"{high_confidence:,}",
            delta=f"{high_confidence/total_conversations*100:.1f}%"
        )


def plot_match_method_distribution(df):
    """Plot distribution of match methods"""
    method_counts = df['match_method'].value_counts()

    fig = px.pie(
        values=method_counts.values,
        names=method_counts.index,
        title='Match Method Distribution',
        hole=0.4,
        color_discrete_sequence=px.colors.qualitative.Set3
    )
    fig.update_traces(textposition='inside', textinfo='percent+label')
    fig.update_layout(height=400)

    return fig


def plot_confidence_distribution(df):
    """Plot confidence score distribution"""
    fig = px.histogram(
        df,
        x='match_confidence',
        nbins=50,
        title='Match Confidence Score Distribution',
        labels={'match_confidence': 'Confidence Score', 'count': 'Number of Conversations'},
        color_discrete_sequence=['#1f77b4']
    )
    fig.add_vline(x=0.80, line_dash="dash", line_color="red",
                  annotation_text="High Confidence Threshold (0.80)")
    fig.update_layout(height=400, showlegend=False)

    return fig


def plot_conversations_by_folder(df):
    """Plot conversations per folder"""
    folder_counts = df['folder'].value_counts().sort_index()

    fig = px.bar(
        x=folder_counts.index,
        y=folder_counts.values,
        title='Conversations per Study Folder',
        labels={'x': 'Folder', 'y': 'Number of Conversations'},
        color=folder_counts.values,
        color_continuous_scale='Blues'
    )
    fig.update_layout(height=400, showlegend=False)

    return fig


def plot_message_statistics(df):
    """Plot message count statistics"""
    fig = go.Figure()

    fig.add_trace(go.Box(
        y=df['user_msg_count'],
        name='User Messages',
        marker_color='#1f77b4'
    ))

    fig.add_trace(go.Box(
        y=df['assistant_msg_count'],
        name='Assistant Messages',
        marker_color='#ff7f0e'
    ))

    fig.update_layout(
        title='Message Count Distribution',
        yaxis_title='Number of Messages',
        height=400
    )

    return fig


def plot_temporal_distribution(df):
    """Plot temporal distribution of conversations"""
    # Parse dates
    df['date'] = pd.to_datetime(df['create_dt'], format='%Y%m%d', errors='coerce')
    daily_counts = df.groupby('date').size().reset_index(name='count')

    fig = px.line(
        daily_counts,
        x='date',
        y='count',
        title='Conversations Over Time',
        labels={'date': 'Date', 'count': 'Number of Conversations'},
        markers=True
    )
    fig.update_layout(height=400)

    return fig


def plot_participant_activity(df):
    """Plot top participants by activity"""
    participant_counts = df['matched_participant_id'].value_counts().head(20)

    fig = px.bar(
        x=participant_counts.index,
        y=participant_counts.values,
        title='Top 20 Most Active Participants',
        labels={'x': 'Participant ID', 'y': 'Number of Conversations'},
        color=participant_counts.values,
        color_continuous_scale='Viridis'
    )
    fig.update_layout(height=400, showlegend=False)
    fig.update_xaxes(tickangle=45)

    return fig


def main():
    """Main application"""

    # Header
    st.markdown('<div class="main-header">📊 Esperanto Study Data Viewer</div>',
                unsafe_allow_html=True)
    st.markdown("---")

    # Load data
    with st.spinner('Loading data...'):
        df, participant_summary, conversation_metrics = load_data()

    if df is None:
        st.stop()

    # Sidebar filters
    st.sidebar.header("🔍 Filters")

    # Folder filter
    folders = ['All'] + sorted(df['folder'].unique().tolist())
    selected_folder = st.sidebar.selectbox("Study Folder", folders)

    # Match method filter
    methods = ['All'] + sorted(df['match_method'].unique().tolist())
    selected_method = st.sidebar.selectbox("Match Method", methods)

    # Confidence threshold
    confidence_threshold = st.sidebar.slider(
        "Minimum Confidence",
        min_value=0.0,
        max_value=1.0,
        value=0.0,
        step=0.1
    )

    # Apply filters
    filtered_df = df.copy()
    if selected_folder != 'All':
        filtered_df = filtered_df[filtered_df['folder'] == selected_folder]
    if selected_method != 'All':
        filtered_df = filtered_df[filtered_df['match_method'] == selected_method]
    filtered_df = filtered_df[filtered_df['match_confidence'] >= confidence_threshold]

    st.sidebar.markdown(f"**Showing {len(filtered_df):,} of {len(df):,} conversations**")

    # Main tabs
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "📊 Overview",
        "💬 Conversations",
        "👥 Participants",
        "📈 Analytics",
        "🔎 Search"
    ])

    with tab1:
        st.header("Dataset Overview")
        create_overview_metrics(filtered_df)

        st.markdown("---")

        col1, col2 = st.columns(2)
        with col1:
            st.plotly_chart(plot_match_method_distribution(filtered_df),
                          use_container_width=True)
            st.plotly_chart(plot_conversations_by_folder(filtered_df),
                          use_container_width=True)

        with col2:
            st.plotly_chart(plot_confidence_distribution(filtered_df),
                          use_container_width=True)
            st.plotly_chart(plot_message_statistics(filtered_df),
                          use_container_width=True)

    with tab2:
        st.header("Conversation Browser")

        # Sort options
        sort_by = st.selectbox(
            "Sort by",
            ['create_time_str', 'match_confidence', 'user_msg_count',
             'assistant_msg_count', 'conv_title']
        )
        sort_order = st.radio("Order", ['Descending', 'Ascending'], horizontal=True)

        # Sort dataframe
        display_df = filtered_df.sort_values(
            by=sort_by,
            ascending=(sort_order == 'Ascending')
        )

        # Display conversations
        st.dataframe(
            display_df[[
                'folder', 'conv_index', 'conv_title', 'matched_participant_id',
                'match_method', 'match_confidence', 'create_dt', 'create_time_str',
                'user_msg_count', 'assistant_msg_count'
            ]],
            use_container_width=True,
            hide_index=True,
            column_config={
                "match_confidence": st.column_config.ProgressColumn(
                    "Confidence",
                    format="%.2f",
                    min_value=0,
                    max_value=1,
                ),
                "user_msg_count": st.column_config.NumberColumn(
                    "User Msgs",
                    format="%d"
                ),
                "assistant_msg_count": st.column_config.NumberColumn(
                    "Assistant Msgs",
                    format="%d"
                )
            }
        )

        # Conversation details
        if len(display_df) > 0:
            st.markdown("---")
            st.subheader("Conversation Details")

            conv_idx = st.number_input(
                "Select conversation index (0-based)",
                min_value=0,
                max_value=len(display_df)-1,
                value=0
            )

            selected_conv = display_df.iloc[conv_idx]

            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("Folder", selected_conv['folder'])
                st.metric("Participant ID", selected_conv['matched_participant_id'])
            with col2:
                st.metric("Match Method", selected_conv['match_method'])
                st.metric("Confidence", f"{selected_conv['match_confidence']:.2f}")
            with col3:
                st.metric("User Messages", selected_conv['user_msg_count'])
                st.metric("Assistant Messages", selected_conv['assistant_msg_count'])

            st.markdown("**Title:** " + selected_conv['conv_title'])
            st.markdown("**First Message:**")
            st.info(selected_conv.get('first_user_msg', 'N/A'))

    with tab3:
        st.header("Participant Analysis")

        if participant_summary is not None:
            st.dataframe(
                participant_summary,
                use_container_width=True,
                hide_index=True
            )
        else:
            # Build participant summary from conversations
            participant_data = []
            for pid in filtered_df['matched_participant_id'].unique():
                if pd.notna(pid):
                    pid_convs = filtered_df[filtered_df['matched_participant_id'] == pid]
                    participant_data.append({
                        'participant_id': pid,
                        'conversation_count': len(pid_convs),
                        'total_user_messages': pid_convs['user_msg_count'].sum(),
                        'total_assistant_messages': pid_convs['assistant_msg_count'].sum(),
                        'avg_confidence': pid_convs['match_confidence'].mean(),
                        'folders': ', '.join(sorted(pid_convs['folder'].unique()))
                    })

            participant_df = pd.DataFrame(participant_data)
            participant_df = participant_df.sort_values('conversation_count', ascending=False)

            st.dataframe(
                participant_df,
                use_container_width=True,
                hide_index=True,
                column_config={
                    "avg_confidence": st.column_config.ProgressColumn(
                        "Avg Confidence",
                        format="%.2f",
                        min_value=0,
                        max_value=1,
                    )
                }
            )

        st.markdown("---")
        st.plotly_chart(plot_participant_activity(filtered_df),
                       use_container_width=True)

    with tab4:
        st.header("Advanced Analytics")

        col1, col2 = st.columns(2)

        with col1:
            st.subheader("Confidence Score Tiers")
            tiers = {
                '0.95-1.00 (Excellent)': len(filtered_df[filtered_df['match_confidence'] >= 0.95]),
                '0.80-0.94 (High)': len(filtered_df[(filtered_df['match_confidence'] >= 0.80) &
                                                    (filtered_df['match_confidence'] < 0.95)]),
                '0.60-0.79 (Medium)': len(filtered_df[(filtered_df['match_confidence'] >= 0.60) &
                                                     (filtered_df['match_confidence'] < 0.80)]),
                '0.40-0.59 (Low)': len(filtered_df[(filtered_df['match_confidence'] >= 0.40) &
                                                   (filtered_df['match_confidence'] < 0.60)]),
                '0.01-0.39 (Very Low)': len(filtered_df[(filtered_df['match_confidence'] > 0.0) &
                                                       (filtered_df['match_confidence'] < 0.40)]),
                '0.00 (Unmatched)': len(filtered_df[filtered_df['match_confidence'] == 0.0])
            }

            tier_df = pd.DataFrame(list(tiers.items()), columns=['Tier', 'Count'])
            tier_df['Percentage'] = (tier_df['Count'] / len(filtered_df) * 100).round(1)

            st.dataframe(tier_df, use_container_width=True, hide_index=True)

        with col2:
            st.subheader("Message Statistics")
            stats_df = pd.DataFrame({
                'Metric': ['Total User Messages', 'Total Assistant Messages',
                          'Avg User Msgs/Conv', 'Avg Assistant Msgs/Conv'],
                'Value': [
                    filtered_df['user_msg_count'].sum(),
                    filtered_df['assistant_msg_count'].sum(),
                    f"{filtered_df['user_msg_count'].mean():.2f}",
                    f"{filtered_df['assistant_msg_count'].mean():.2f}"
                ]
            })
            st.dataframe(stats_df, use_container_width=True, hide_index=True)

        st.markdown("---")
        st.plotly_chart(plot_temporal_distribution(filtered_df),
                       use_container_width=True)

    with tab5:
        st.header("Search Conversations")

        search_type = st.radio(
            "Search in",
            ['Title', 'First Message', 'Participant ID'],
            horizontal=True
        )

        search_term = st.text_input("Enter search term", "")

        if search_term:
            if search_type == 'Title':
                search_results = filtered_df[
                    filtered_df['conv_title'].str.contains(search_term, case=False, na=False)
                ]
            elif search_type == 'First Message':
                search_results = filtered_df[
                    filtered_df['first_user_msg'].str.contains(search_term, case=False, na=False)
                ]
            else:  # Participant ID
                search_results = filtered_df[
                    filtered_df['matched_participant_id'].str.contains(search_term, case=False, na=False)
                ]

            st.success(f"Found {len(search_results)} matching conversations")

            if len(search_results) > 0:
                st.dataframe(
                    search_results[[
                        'folder', 'conv_title', 'matched_participant_id',
                        'match_method', 'match_confidence', 'user_msg_count'
                    ]],
                    use_container_width=True,
                    hide_index=True
                )
        else:
            st.info("Enter a search term to find conversations")

    # Footer
    st.markdown("---")
    st.markdown(
        f"**Esperanto Study Data Viewer** | "
        f"Showing {len(filtered_df):,} conversations | "
        f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    )


if __name__ == "__main__":
    main()
