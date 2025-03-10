import os

def extract_content_from_md(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    return content

def generate_llms_txt(directory, output_file='llms.txt'):
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
        
        for root, _, files in os.walk(directory):
            for file in files:
                if file.endswith(('.md', '.mdx')):
                    file_path = os.path.join(root, file)
                    content = extract_content_from_md(file_path)
                    llms_file.write(f"## {file}\n")
                    llms_file.write(content)
                    llms_file.write("\n\n")

if __name__ == "__main__":
    # Update the path to the docs directory
    docs_directory = os.path.join('..', 'docs')
    generate_llms_txt(docs_directory, 'llms.txt')