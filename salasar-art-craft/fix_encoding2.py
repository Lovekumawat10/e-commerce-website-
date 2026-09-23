import os
import re

def fix():
    for root, _, files in os.walk('src'):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Use a regex that replaces anything before {variable.toLocaleString...} that isn't a standard HTML tag/space
                # It looks for ">" or "`" or '"' followed by one or more non-word chars, then the { ... }
                # Let's just find `...toLocaleString('en-IN')}` and look at the 2 chars before the `{`
                
                # To be safe:
                new_content = re.sub(
                    r'(>|`|"|\s)[^\x00-\x7F\sA-Za-z0-9]+\{([A-Za-z0-9_\.]+\.toLocaleString\(\'en-IN\'\))\}',
                    r'\1₹{\2}',
                    content
                )
                
                # Also check for ",1" literal (which is Replacement Character + ",1")
                new_content = re.sub(
                    r',1\{([A-Za-z0-9_\.]+\.toLocaleString\(\'en-IN\'\))\}',
                    r'₹{\1}',
                    new_content
                )

                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed {path}")

fix()
