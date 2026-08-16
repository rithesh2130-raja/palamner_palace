import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { FileText, ShieldAlert } from 'lucide-react';

const AdminAuditLogsPage = () => {
  const logs = [
    { id: 'LOG-9001', user: 'admin@email.com', role: 'SuperAdmin', action: 'UPDATED_STORE_SETTINGS', ip: '192.168.1.42', timestamp: '2026-08-16 20:31:25' },
    { id: 'LOG-9002', user: 'admin@email.com', role: 'SuperAdmin', action: 'RE_SEEDED_DATABASE_CATALOG', ip: '192.168.1.42', timestamp: '2026-08-16 20:31:22' },
    { id: 'LOG-9003', user: 'product@email.com', role: 'ProductManager', action: 'UPDATED_PRODUCT_STOCK', ip: '192.168.1.88', timestamp: '2026-08-16 19:45:10' },
    { id: 'LOG-9004', user: 'order@email.com', role: 'OrderManager', action: 'DISPATCHED_ORDER_SHIPMENT', ip: '192.168.1.91', timestamp: '2026-08-16 18:20:04' },
    { id: 'LOG-9005', user: 'finance@email.com', role: 'Finance', action: 'CALCULATED_SELLER_COMMISSION', ip: '192.168.1.15', timestamp: '2026-08-16 17:10:00' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', backgroundColor: '#F6F7F9' }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText color="#FFB000" /> Security Audit & Action Logs
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.2rem 0 0 0' }}>
            Immutably log all administrative operations, staff RBAC role modifications, and system configuration updates.
          </p>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#374151', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Log ID</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Staff Account</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Assigned Role</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Action Event</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>IP Address</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'right' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#111827' }}>{log.id}</td>
                  <td style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>{log.user}</td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                      {log.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#374151' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ShieldAlert size={14} color="#d97706" /> {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.2rem', color: '#6b7280', fontFamily: 'monospace' }}>{log.ip}</td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'right', color: '#6b7280', fontSize: '0.8rem' }}>{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogsPage;
