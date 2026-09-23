import re

with open("src/app/admin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make search bars responsive width
content = content.replace('className="relative w-64"', 'className="relative w-full sm:w-64"')
content = content.replace('className="relative w-72"', 'className="relative w-full sm:w-72"')

# Ensure buttons don't overflow on small flex rows
content = re.sub(
    r'<div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6">',
    r'<div className="flex flex-col md:flex-row justify-between md:items-start gap-6">',
    content
)

content = re.sub(
    r'<div className="flex flex-row lg:flex-col gap-3 min-w-\[200px\]">',
    r'<div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto md:min-w-[200px]">',
    content
)

content = content.replace('className="flex gap-3"', 'className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"')

# Fix any hardcoded max-w-xs
content = content.replace('max-w-xs break-words', 'max-w-[200px] md:max-w-xs break-words whitespace-normal')

with open("src/app/admin/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
