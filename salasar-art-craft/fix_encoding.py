import os
import re

def process_dir(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace the weird 'â‚¹' or ',1' right before {*.toLocaleString('en-IN')} with '₹'
                new_content = re.sub(
                    r'[^\x00-\x7F]+\{([A-Za-z0-9_\.]+\.toLocaleString\(\'en-IN\'\))\}',
                    r'₹{\1}',
                    content
                )
                
                # Also replace any literal 'â‚¹' characters
                new_content = new_content.replace('â‚¹', '₹')
                
                # Also fix the `?` and `,1` variants if any
                new_content = re.sub(
                    r'(\?|,1)\{([A-Za-z0-9_\.]+\.toLocaleString\(\'en-IN\'\))\}',
                    r'₹{\2}',
                    new_content
                )

                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed {path}")

process_dir('src')
