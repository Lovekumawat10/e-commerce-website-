import re
import os

with open("src/app/admin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Menu, X to imports from lucide-react
if 'Menu, X' not in content:
    content = re.sub(r'import \{ (.*?) \} from "lucide-react";', r'import { \1, Menu, X } from "lucide-react";', content)

# 2. Add isSidebarOpen state to AdminDashboard
if 'const [isSidebarOpen' not in content:
    content = re.sub(
        r'const \[isAuthenticated, setIsAuthenticated\] = useState\(false\);',
        'const [isAuthenticated, setIsAuthenticated] = useState(false);\n  const [isSidebarOpen, setIsSidebarOpen] = useState(false);',
        content
    )

# 3. Modify Layout Wrapper (from return ( <div className="flex h-screen bg-cream"> up to <main>)
# Current layout:
# return (
#   <div className="flex h-screen bg-cream">
#     <aside className="w-64 bg-white border-r border-navy/10 flex flex-col">
#        ...
#     </aside>
#     <main className="flex-1 overflow-y-auto p-8">
layout_old = '''  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-navy/10 flex flex-col">'''

layout_new = '''  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={ixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-navy/10 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 }>
        <div className="md:hidden absolute top-4 right-4">
          <button onClick={() => setIsSidebarOpen(false)} className="text-navy/50 hover:text-navy"><X size={24} /></button>
        </div>'''
content = content.replace(layout_old, layout_new)

# Modify main tag and add mobile topbar
main_old = '      <main className="flex-1 overflow-y-auto p-8">'
main_new = '''      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Topbar */}
        <header className="md:hidden bg-white border-b border-navy/10 p-4 flex justify-between items-center z-30 shrink-0">
          <h1 className="font-serif text-lg text-navy font-semibold flex items-center gap-2">
            <PackageSearch size={20} className="text-gold" />
            Salasar Admin
          </h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-navy hover:bg-navy/5 rounded-lg">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">'''
content = content.replace(main_old, main_new)

# Close the new <div className="flex-1 flex flex-col ..."> wrapper at the end of AdminDashboard
content = re.sub(r'        \{renderTabContent\(\)\}\n      </main>\n    </div\>', r'        {renderTabContent()}\n        </main>\n      </div>\n    </div>', content)

# 4. Make tables scrollable and prevent squishing
# Find <table className="..."> and add whitespace-nowrap and min-w-[800px]
content = re.sub(
    r'<table className="w-full text-left border-collapse">',
    r'<table className="w-full text-left border-collapse min-w-[800px] whitespace-nowrap">',
    content
)

# 5. Fix sticky headers or search bars that flex-row on mobile
content = re.sub(
    r'flex items-center justify-between',
    r'flex flex-col md:flex-row md:items-center justify-between gap-4',
    content
)

# 6. Adjust padding on metric cards and wrappers
content = re.sub(r'p-6 rounded-xl', r'p-4 md:p-6 rounded-xl', content)
content = re.sub(r'space-y-8 pb-12', r'space-y-6 md:space-y-8 pb-8 md:pb-12', content)

# 7. Make inputs full width in forms
# Most inputs already have w-full, but let's make sure the wrapping grid (if any) is responsive.
content = re.sub(r'grid grid-cols-2 gap-4', r'grid grid-cols-1 md:grid-cols-2 gap-4', content)
# Ensure modal is responsive (OrdersTab modal)
content = re.sub(r'w-96 bg-white', r'w-full max-w-sm md:w-96 bg-white mx-4', content)

with open("src/app/admin/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated admin layout for mobile.")
