import os

def list_md_files(directory):
    md_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.md', '.mdx')):
                md_files.append(file)
    return md_files

def list_llms_headers(llms_file):
    headers = []
    with open(llms_file, 'r', encoding='utf-8') as file:
        for line in file:
            if line.startswith('## '):
                headers.append(line.strip()[3:])  # Remove '## ' prefix
    return headers

if __name__ == "__main__":
    # Update the path to the docs directory
    docs_directory = os.path.join('..', 'docs')
    llms_file = 'llms.txt'

    md_files = list_md_files(docs_directory)
    llms_headers = list_llms_headers(llms_file)

    missing_files = set(md_files) - set(llms_headers)
    if missing_files:
        print("The following files are missing from llms.txt:")
        for file in missing_files:
            print(file)
    else:
        print("All files are included in llms.txt.")