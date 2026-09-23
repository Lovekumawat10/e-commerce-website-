import re

with open("src/app/register/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'const itemVariants = {',
    'const itemVariants: any = {'
)

with open("src/app/register/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
