import re

with open("src/app/admin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'MessageCircle\n  Menu,',
    'MessageCircle,\n  Menu,'
)

with open("src/app/admin/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
