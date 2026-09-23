import re

with open("src/app/admin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add Menu and X if they are missing
if 'Menu,' not in content:
    content = content.replace('} from "lucide-react";', '  Menu,\n  X,\n} from "lucide-react";')

with open("src/app/admin/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
