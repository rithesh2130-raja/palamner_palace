import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { HelpCircle, Bot, CheckCircle, Clock } from 'lucide-react';

const AdminSupportPage = () => {
  const [tickets, setTickets] = useState([
    { id: 'TCK-8921', customer: 'John Doe', topic: 'Tracking order #65f12a', source: 'Rufus AI Assistant', status: 'Resolved', date: '2026-08-16' },
    { id: 'TCK-8922', customer: 'Jane Smith', topic: 'Return pickup request', source: 'Support Center Form', status: 'Pending Agent', date: '2026-08-16' },
    { id: 'TCK-8923', customer: 'Alex Johnson', topic: 'Warranty claim on headphones', source: 'Support Center Form', status: 'In Progress', date: '2026-08-15' },
  ]);

  const handleResolve = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'Resolved' } : t))
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', backgroundColor: '#F6F7F9' }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle color="#FFB000" /> Support Desk & AI Chatbot Logs
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.2rem 0 0 0' }}>
            Review customer service inquiries, Rufus AI assistant interactions, and escalation tickets.
          </p>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#374151', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Ticket ID</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Customer</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Topic / Query</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Channel Source</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#111827' }}>{t.id}</td>
                  <td style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>{t.customer}</td>
                  <td style={{ padding: '1rem 1.2rem', color: '#374151' }}>{t.topic}</td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#2563eb', fontWeight: '600', fontSize: '0.75rem' }}>
                      <Bot size={14} /> {t.source}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      backgroundColor: t.status === 'Resolved' ? '#ecfdf5' : '#fffbe6',
                      color: t.status === 'Resolved' ? '#067d62' : '#d97706',
                    }}>
                      {t.status === 'Resolved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                    {t.status !== 'Resolved' && (
                      <button onClick={() => handleResolve(t.id)} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', backgroundColor: '#067d62', border: 'none', color: '#ffffff' }}>
                        Mark Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportPage;
