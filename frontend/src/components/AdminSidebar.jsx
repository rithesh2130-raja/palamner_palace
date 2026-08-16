import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  ClipboardList,
  Users,
  ShieldCheck,
  CreditCard,
  LineChart,
  Settings,
  Store,
  MessageSquare,
  Tag,
  Truck,
  HelpCircle,
  FileText,
} from 'lucide-react';

const AdminSidebar = () => {
  const menuSections = [
    {
      title: 'CORE OPERATIONAL',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={18} /> },
        { name: 'Inventory', path: '/admin/inventory', icon: <Boxes size={18} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ClipboardList size={18} /> },
      ]
    },
    {
      title: 'MARKETPLACE & USERS',
      items: [
        { name: 'Customers', path: '/admin/customers', icon: <Users size={18} /> },
        { name: 'Sellers', path: '/admin/sellers', icon: <Store size={18} /> },
        { name: 'Reviews', path: '/admin/reviews', icon: <MessageSquare size={18} /> },
        { name: 'Promotions', path: '/admin/promotions', icon: <Tag size={18} /> },
      ]
    },
    {
      title: 'FINANCE & LOGISTICS',
      items: [
        { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={18} /> },
        { name: 'Shipping', path: '/admin/shipping', icon: <Truck size={18} /> },
        { name: 'Analytics', path: '/admin/analytics', icon: <LineChart size={18} /> },
        { name: 'Support', path: '/admin/support', icon: <HelpCircle size={18} /> },
      ]
    },
    {
      title: 'SYSTEM & SECURITY',
      items: [
        { name: 'Staff & Roles', path: '/admin/staff', icon: <ShieldCheck size={18} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
        { name: 'Audit Logs', path: '/admin/audit-logs', icon: <FileText size={18} /> },
      ]
    }
  ];

  return (
    <aside style={{
      width: '250px',
      backgroundColor: '#111827',
      color: '#9ca3af',
      borderRight: '1px solid #1f2937',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - var(--header-height))',
      position: 'sticky',
      top: 'var(--header-height)',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      zIndex: 90,
      userSelect: 'none',
      flexShrink: 0
    }}>
      <div style={{ padding: '1.2rem 1.5rem 0.5rem 1.5rem', borderBottom: '1px solid #1f2937' }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ffffff', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
          <span style={{ color: '#FFB000' }}>ShopSphere</span> OPS
        </h2>
        <span style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Enterprise Console</span>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
        {menuSections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '1.2rem' }}>
            <h3 style={{
              fontSize: '0.68rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              color: '#4b5563',
              padding: '0 1.5rem',
              marginBottom: '0.4rem',
              letterSpacing: '1px'
            }}>
              {section.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {section.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '0.65rem 1.5rem',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#ffffff' : '#9ca3af',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    borderLeft: isActive ? '3px solid #FFB000' : '3px solid transparent',
                    transition: 'all 150ms ease',
                    textDecoration: 'none',
                  })}
                >
                  <span style={{ color: item.path === window.location.pathname ? '#FFB000' : 'inherit' }}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
