import os

def extract_content_from_md(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    return content

def generate_llms_txt(directory, output_file='llms.txt'):
    with open(output_file, 'w', encoding='utf-8') as llms_file:
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