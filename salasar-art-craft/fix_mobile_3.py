import re

with open("src/app/admin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'className="flex-1 overflow-y-auto p-4 md:p-8"',
    'className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8"'
)

with open("src/app/admin/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
