import re

with open("src/app/admin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Stats state interface
content = content.replace(
    '''const [stats, setStats] = useState<{total_revenue: number, total_orders: number, recent_orders: any[]}>({total_revenue: 0, total_orders: 0, recent_orders: []});''',
    '''const [stats, setStats] = useState<{total_revenue: number, total_orders: number, active_users: number, pending_returns: number, recent_orders: any[]}>({total_revenue: 0, total_orders: 0, active_users: 0, pending_returns: 0, recent_orders: []});'''
)

# Fix 2: MetricCard usage
metric_cards_old = '''<MetricCard title="Total Revenue" value={₹} trend="+12.5%" />
        <MetricCard title="Total Orders" value={stats.total_orders.toString()} trend="+8.2%" />
        <MetricCard title="Active Users" value="850" trend="+24.1%" />
        <MetricCard title="Pending Returns" value="3" trend="-2.0%" alert />'''
        
metric_cards_new = '''<MetricCard title="Total Revenue" value={₹} trend="+12.5%" />
        <MetricCard title="Total Orders" value={stats.total_orders.toString()} trend="+8.2%" />
        <MetricCard title="Active Users" value={stats.active_users.toString()} trend="+24.1%" />
        <MetricCard title="Pending Returns" value={stats.pending_returns.toString()} trend={stats.pending_returns > 0 ? "+1" : "0"} alert={stats.pending_returns > 0} />'''

content = content.replace(metric_cards_old, metric_cards_new)

# Fix 3: The Returns & Complaints Tab (ReturnsComplaints component)
# I will replace the entire ReturnsComplaints component.

returns_new = '''
// Returns & Complaints Tab
const ReturnsComplaints = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/admin/complaints");
      if (res.ok) {
        setComplaints(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(http://127.0.0.1:8000/admin/complaints//status, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-serif text-navy">Returns & Complaints</h1>

      {loading ? (
        <p className="text-navy/50">Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-xl border border-navy/5">
          <p className="text-navy/50">No returns or complaints found in the database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {complaints.map((ticket, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-navy/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-semibold text-navy text-sm bg-navy/5 px-3 py-1 rounded-md">{ticket.ticket_id}</span>
                    <span className={	ext-xs font-medium px-2 py-1 rounded-full }>
                      {ticket.type}
                    </span>
                    <span className="text-xs text-navy/50 bg-cream px-2 py-1 rounded-full border border-navy/10">{ticket.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-navy/50 uppercase tracking-wider mb-1">Customer</p>
                      <p className="text-sm font-medium text-navy">{ticket.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-navy/50 uppercase tracking-wider mb-1">Order Ref</p>
                      <p className="text-sm font-medium text-navy">{ticket.order_id || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-navy/50 uppercase tracking-wider mb-1">Issue Description</p>
                    <p className="text-sm text-navy/80 bg-cream p-3 rounded-lg border border-navy/5">{ticket.issue}</p>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col gap-3 min-w-[200px]">
                  {ticket.status !== 'Resolved' && (
                    <button onClick={() => updateStatus(ticket.id, 'Resolved')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors">
                      <CheckCircle size={16} /> Mark Resolved
                    </button>
                  )}
                  {ticket.status !== 'Rejected' && (
                    <button onClick={() => updateStatus(ticket.id, 'Rejected')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">
                      <XCircle size={16} /> Reject Claim
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
'''

content = re.sub(r'// Returns & Complaints Tab\nconst ReturnsComplaints = \(\) => \{.*?\n\};\n', returns_new, content, flags=re.DOTALL)

with open("src/app/admin/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
