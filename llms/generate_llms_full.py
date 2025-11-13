import os
import sys
from datetime import datetime, timezone

# Function to extract content from markdown files
# Handles file reading and error cases
def extract_content_from_md(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        return content
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return f"Error: Could not read content from {file_path}"

# Main function to generate LLM documentation files by combining markdown files
# from specified subdirectories
def generate_llms_txt(base_directory, subdirectories, output_file, title, description, include_sdk_instructions=True):
    processed_files = []

    # Make sure the output directory exists
    output_dir = os.path.dirname(output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        with open(output_file, 'w', encoding='utf-8') as llms_file:
            # Write the header and guidance at the top of the file
            llms_file.write(f"# {title}\n\n")

            # Add timestamp
            current_time = datetime.now(timezone.utc)
            timestamp = current_time.strftime("Generated at %I:%M %p UTC / %B %d, %Y")
            llms_file.write(f"{timestamp}\n\n")

            # Add description
            llms_file.write(f"## About this file\n\n")
            llms_file.write(f"{description}\n\n")

            # Add SDK instructions (optional)
            if include_sdk_instructions:
                llms_file.write("## Instructions for AI Tools\n\n")
                llms_file.write("This documentation includes code samples for multiple SDKs. Please use the code samples that correspond to the SDK you are working with:\n\n")
                llms_file.write("- For **xmtp-react-native**, use the code samples marked with `[React Native]`.\n")
                llms_file.write("- For **xmtp-android**, use the code samples marked with `[Kotlin]`.\n")
                llms_file.write("- For **xmtp-ios**, use the code samples marked with `[Swift]`.\n")
                llms_file.write("- For **xmtp-js** in a browser environment, use the code samples marked with `[Browser]`.\n")
                llms_file.write("- For **xmtp-js** in a Node.js environment, use the code samples marked with `[Node]`.\n\n")
                llms_file.write("Ensure that you select the correct code block to avoid compatibility issues.\n\n")

            # Add table of contents
            llms_file.write("## Included Sections\n\n")
            for subdir in subdirectories:
                llms_file.write(f"- {subdir}\n")
            llms_file.write("\n---\n\n")

            # Process each subdirectory
            for subdir in subdirectories:
                full_path = os.path.join(base_directory, subdir)

                # Check if the subdirectory exists
                if not os.path.exists(full_path):
                    print(f"Warning: Directory not found: {full_path}")
                    continue

                # Add section header
                llms_file.write(f"# Section: {subdir}\n\n")

                # Walk through all directories and files in the subdirectory
                for root, _, files in os.walk(full_path):
                    for file in sorted(files):  # Sort files for consistent ordering
                        # Process only markdown files (.md and .mdx)
                        if file.endswith(('.md', '.mdx')):
                            file_path = os.path.join(root, file)
                            # Get the path relative to the base directory
                            rel_path = os.path.relpath(file_path, base_directory)
                            content = extract_content_from_md(file_path)
                            if isinstance(content, str) and content.startswith("Error:"):
                                print(f"Warning: Skipping {rel_path}: {content}")
                                continue
                            # Write the relative path as the header
                            llms_file.write(f"## {rel_path}\n")
                            llms_file.write(content)
                            llms_file.write("\n\n")
                            processed_files.append(rel_path)

            # Add a summary at the end
            llms_file.write(f"# Summary\n\n")
            llms_file.write(f"This documentation contains {len(processed_files)} files from {len(subdirectories)} sections.\n")

        print(f"Successfully processed {len(processed_files)} Markdown files into {output_file}")
        return processed_files

    except Exception as e:
        print(f"Error generating {output_file}: {e}")
        return []

# Script entry point
if __name__ == "__main__":
    # Base path to the docs directory
    docs_directory = 'docs/pages'

    # Check if the docs directory exists
    if not os.path.isdir(docs_directory):
        print(f"Error: Directory not found: {docs_directory}")
        print("Make sure you're running this script from the correct location.")
        sys.exit(1)

    # Shared sections for both chat apps and agents
    shared_sections = [
        'protocol',
        'network',
        'fund-agents-apps'
    ]

    # Configuration for chat apps documentation
    chat_apps_config = {
        'subdirectories': ['chat-apps'] + shared_sections,
        'output_file': 'llms/llms-chat-apps.txt',
        'title': 'XMTP Documentation for Building Chat Applications',
        'description': 'This documentation is tailored for developers building chat apps with XMTP. It includes guides on core messaging, content types, push notifications, user consent, and more, along with protocol fundamentals, network operations, and funding information.'
    }

    # Configuration for agents documentation
    agents_config = {
        'subdirectories': ['agents'] + shared_sections,
        'output_file': 'llms/llms-agents.txt',
        'title': 'XMTP Documentation for Building Agents',
        'description': 'This documentation is tailored for developers building agents with XMTP. It includes guides on agent concepts, building and deploying agents, content types, and integration patterns, along with protocol fundamentals, network operations, and funding information.'
    }

    # Configuration for full documentation (everything)
    full_docs_config = {
        'subdirectories': ['chat-apps', 'agents'] + shared_sections,
        'output_file': 'llms/llms-full.txt',
        'title': 'XMTP Full Documentation',
        'description': 'This is the complete XMTP documentation including guides for building both chat apps and agents, along with protocol fundamentals, network operations, and funding information.'
    }

    # Generate all three documentation files
    all_successful = True

    print("Generating Chat Apps documentation...")
    chat_files = generate_llms_txt(
        docs_directory,
        chat_apps_config['subdirectories'],
        chat_apps_config['output_file'],
        chat_apps_config['title'],
        chat_apps_config['description']
    )

    if not chat_files:
        print("Warning: No files were processed for chat apps documentation.")
        all_successful = False

    print("\nGenerating Agents documentation...")
    agent_files = generate_llms_txt(
        docs_directory,
        agents_config['subdirectories'],
        agents_config['output_file'],
        agents_config['title'],
        agents_config['description'],
        include_sdk_instructions=False
    )

    if not agent_files:
        print("Warning: No files were processed for agents documentation.")
        all_successful = False

    print("\nGenerating Full documentation...")
    full_files = generate_llms_txt(
        docs_directory,
        full_docs_config['subdirectories'],
        full_docs_config['output_file'],
        full_docs_config['title'],
        full_docs_config['description']
    )

    if not full_files:
        print("Warning: No files were processed for full documentation.")
        all_successful = False

    # Exit with error if any generation failed
    if not all_successful:
        print("\nError: Some documentation files were not generated successfully.")
        sys.exit(1)

    print(f"\n✓ Successfully generated all documentation files!")
    print(f"  - {chat_apps_config['output_file']} ({len(chat_files)} files)")
    print(f"  - {agents_config['output_file']} ({len(agent_files)} files)")
    print(f"  - {full_docs_config['output_file']} ({len(full_files)} files)")
