import os
import sys

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

# Main function to generate the llms-full.txt file by combining all markdown files
# from the specified directory
def generate_llms_txt(directory, output_file='llms/llms-full.txt'):  # Updated filename to llms-full.txt
    processed_files = []
    
    # Make sure the output directory exists
    output_dir = os.path.dirname(output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    try:
        with open(output_file, 'w', encoding='utf-8') as llms_file:
            # Write the header and guidance at the top of the file
            llms_file.write("# XMTP Full Documentation\n\n")
            llms_file.write("## Instructions for AI Tools\n\n")
            llms_file.write("This documentation includes code samples for multiple SDKs. Please use the code samples that correspond to the SDK you are working with:\n\n")
            llms_file.write("- For **xmtp-react-native**, use the code samples marked with `[React Native]`.\n")
            llms_file.write("- For **xmtp-android**, use the code samples marked with `[Kotlin]`.\n")
            llms_file.write("- For **xmtp-ios**, use the code samples marked with `[Swift]`.\n")
            llms_file.write("- For **xmtp-js** in a browser environment, use the code samples marked with `[Browser]`.\n")
            llms_file.write("- For **xmtp-js** in a Node.js environment, use the code samples marked with `[Node]`.\n\n")
            llms_file.write("Ensure that you select the correct code block to avoid compatibility issues.\n\n")
            
            # Walk through all directories and files in the specified directory
            for root, _, files in os.walk(directory):
                for file in files:
                    # Process only markdown files (.md and .mdx)
                    if file.endswith(('.md', '.mdx')):
                        file_path = os.path.join(root, file)
                        # Get the path relative to the docs directory
                        rel_path = os.path.relpath(file_path, directory)
                        content = extract_content_from_md(file_path)
                        
                        # Write the relative path as the header
                        llms_file.write(f"## {rel_path}\n")
                        llms_file.write(content)
                        llms_file.write("\n\n")
                        
                        processed_files.append(rel_path)
            
            # Add a summary at the end
            llms_file.write(f"# Summary\n\n")
            llms_file.write(f"This documentation contains {len(processed_files)} files.\n")
            
        print(f"Successfully processed {len(processed_files)} Markdown files into {output_file}")
        return processed_files
    
    except Exception as e:
        print(f"Error generating {output_file}: {e}")
        return []

# Script entry point
if __name__ == "__main__":
    # Update the path to the docs directory
    docs_directory = 'docs'
    
    # Check if the docs directory exists
    if not os.path.isdir(docs_directory):
        print(f"Error: Directory not found: {docs_directory}")
        print("Make sure you're running this script from the correct location.")
        sys.exit(1)
    
    # Generate the llms-full.txt file and get the list of processed files
    processed_files = generate_llms_txt(docs_directory, 'llms/llms-full.txt')
    
    # Exit with error if no files were processed
    if not processed_files:
        print("Warning: No files were processed. Check the docs directory path.")
        sys.exit(1)
