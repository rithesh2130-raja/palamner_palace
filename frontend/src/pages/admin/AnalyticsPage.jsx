import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Download, LineChart, PieChart } from 'lucide-react';

const AnalyticsPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordRes, prodRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/products'),
        ]);

        if (!ordRes.ok || !prodRes.ok) throw new Error('Failed to load analytics data');

        const ords = await ordRes.json();
        const prods = await prodRes.json();
        
        setOrders(ords);
        setProducts(prods);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Export CSV Helper
  const exportCSV = () => {
    if (orders.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Order ID,Customer Name,Date,Amount,Payment Status,Delivery Status\n';

    orders.forEach((order) => {
      const id = order._id;
      const customer = order.user ? order.user.name : 'Unknown';
      const date = new Date(order.createdAt).toLocaleDateString();
      const amount = order.totalPrice;
      const paid = order.isPaid ? 'Paid' : 'Unpaid';
      const delivered = order.isDelivered ? 'Delivered' : 'Pending';
      csvContent += `"${id}","${customer}","${date}",${amount},"${paid}","${delivered}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sales_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pie chart computations
  const categoriesMap = products.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoriesMap).map(([name, value]) => ({ name, value }));

  // Line chart computations (sales over past 5 orders or days)
  const salesHistory = orders
    .filter((o) => o.isPaid)
    .map((o) => ({
      date: new Date(o.createdAt).toLocaleDateString(),
      amount: o.totalPrice,
    }));

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', marginLeft: '-1.5rem', marginRight: '-1.5rem', marginTop: '-2rem', marginBottom: '-2rem' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        
        <div className="page-header-row">
          <h1 style={{ fontWeight: '700' }}>Store Analytics & Reports</h1>
          <button onClick={exportCSV} className="btn btn-primary">
            <Download size={16} /> Export Sales Report (CSV)
          </button>
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            
            {/* Sales Trends Chart */}
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <LineChart size={20} color="var(--secondary)" />
                <h3 style={{ fontWeight: '600' }}>Recent Sales Growth ($)</h3>
              </div>

              {salesHistory.length === 0 ? (
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  No payment data available for sales charts
                </div>
              ) : (
                <svg viewBox="0 0 500 250" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="40" y1="30" x2="480" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="150" x2="480" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="210" x2="480" y2="210" stroke="#e2e8f0" strokeWidth="2" />

                  {/* Draw the area and the line */}
                  {(() => {
                    const maxVal = Math.max(...salesHistory.map((h) => h.amount), 100);
                    const coords = salesHistory.map((h, i) => {
                      const x = 40 + (i / Math.max(salesHistory.length - 1, 1)) * 440;
                      const y = 210 - (h.amount / maxVal) * 160;
                      return { x, y };
                    });

                    let linePath = `M ${coords[0].x} ${coords[0].y}`;
                    let areaPath = `M ${coords[0].x} 210 L ${coords[0].x} ${coords[0].y}`;
                    
                    coords.forEach((coord, index) => {
                      if (index > 0) {
                        linePath += ` L ${coord.x} ${coord.y}`;
                        areaPath += ` L ${coord.x} ${coord.y}`;
                      }
                    });
                    
                    areaPath += ` L ${coords[coords.length - 1].x} 210 Z`;

                    return (
                      <>
                        <path d={areaPath} fill="url(#salesGrad)" />
                        <path d={linePath} fill="none" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" />
                        
                        {coords.map((coord, i) => (
                          <g key={i}>
                            <circle cx={coord.x} cy={coord.y} r="5" fill="var(--bg-card)" stroke="var(--secondary)" strokeWidth="3" />
                            <text x={coord.x} y={coord.y - 12} fontSize="9" fontWeight="700" textAnchor="middle" fill="var(--text-dark)">
                              ${salesHistory[i].amount.toFixed(0)}
                            </text>
                            <text x={coord.x} y="228" fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--text-muted)">
                              {salesHistory[i].date}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              )}
            </div>

            {/* Category Pie Chart */}
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <PieChart size={20} color="var(--primary)" />
                <h3 style={{ fontWeight: '600' }}>Category Inventory Shares</h3>
              </div>

              {categoryData.length === 0 ? (
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  No inventory data available for charts
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '210px' }}>
                  {/* Custom SVG Pie Chart representation */}
                  <svg width="150" height="150" viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)', borderRadius: '50%' }}>
                    {(() => {
                      const colors = ['var(--secondary)', 'var(--primary)', 'var(--success)', '#8b5cf6'];
                      const totalVal = categoryData.reduce((acc, c) => acc + c.value, 0);
                      let accumulatedPercent = 0;

                      return categoryData.map((item, i) => {
                        const percent = (item.value / totalVal) * 100;
                        const strokeDasharray = `${percent} ${100 - percent}`;
                        const strokeDashoffset = -accumulatedPercent;
                        accumulatedPercent += percent;

                        return (
                          <circle
                            key={i}
                            r="16"
                            cx="16"
                            cy="16"
                            fill="transparent"
                            stroke={colors[i % colors.length]}
                            strokeWidth="32"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                          />
                        );
                      });
                    })()}
                  </svg>
                  
                  {/* Legend */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {(() => {
                      const colors = ['var(--secondary)', 'var(--primary)', 'var(--success)', '#8b5cf6'];
                      const totalVal = categoryData.reduce((acc, c) => acc + c.value, 0);

                      return categoryData.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: colors[i % colors.length] }}></div>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                            {item.name}: {((item.value / totalVal) * 100).toFixed(0)}% ({item.value} SKUs)
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
