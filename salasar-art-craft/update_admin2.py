import re

with open("src/app/admin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Stats state interface
content = re.sub(
    r'const \[stats, setStats\] = useState<\{.*?\}\>\(\{.*?\}\);',
    'const [stats, setStats] = useState<{total_revenue: number, total_orders: number, active_users: number, pending_returns: number, recent_orders: any[]}>({total_revenue: 0, total_orders: 0, active_users: 0, pending_returns: 0, recent_orders: []});',
    content
)

# Fix 2: MetricCards
# Look for <MetricCard title="Active Users"... and replace it
content = re.sub(
    r'<MetricCard title="Active Users" value="850" trend="\+24\.1%" />',
    '<MetricCard title="Active Users" value={stats.active_users.toString()} trend="+24.1%" />',
    content
)

content = re.sub(
    r'<MetricCard title="Pending Returns" value="3" trend="-2\.0%" alert />',
    '<MetricCard title="Pending Returns" value={stats.pending_returns.toString()} trend={stats.pending_returns > 0 ? "+1" : "0"} alert={stats.pending_returns > 0} />',
    content
)

# Fix 3: Remove the hardcoded "Complaints & Returns Action Required" block from the dashboard page
content = re.sub(
    r'\{\/\* Returns & Complaints \*\/\}[\s\S]*?(?=</div\>\n        </div\>\n      </div\>\n    \);\n\})',
    '',
    content
)

with open("src/app/admin/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

