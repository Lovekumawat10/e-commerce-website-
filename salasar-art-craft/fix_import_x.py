import re

with open("src/app/admin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '  Menu,\n  X,\n} from "lucide-react";',
    '  Menu\n} from "lucide-react";'
)

with open("src/app/admin/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
