import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Store, FileText, Settings } from 'lucide-react';
import { useTheme } from '../ThemeContext'; // Theme connect kiya

const Sidebar = () => {
  const location = useLocation();
  const { darkMode, card, border } = useTheme(); // Colors nikaalein

  const menuItems = [
    { icon: <LayoutDashboard size={20}/>, label: 'Dashboard', path: '/' },
    { icon: <Store size={20}/>, label: 'Vendors', path: '/vendors' },
    { icon: <Users size={20}/>, label: 'Customers', path: '/customers' },
    { icon: <FileText size={20}/>, label: 'Reports', path: '/reports' },
    { icon: <Settings size={20}/>, label: 'Settings', path: '/settings' },
  ];

  return (
    <div style={{ 
      width: '260px', 
      height: '100vh', 
      backgroundColor: card, // Dynamic color
      borderRight: `1px solid ${border}`, 
      position: 'sticky', 
      top: 0,
      transition: '0.3s'
    }}>
      {/* Orange Logo Area (Ye hamesha orange rahega) */}
      <div style={{ padding: '25px', backgroundColor: '#ff6b00', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
         <div style={{ backgroundColor: 'white', color: '#ff6b00', borderRadius: '8px', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>L</div>
         <span style={{ fontWeight: 'bold', fontSize: '18px' }}>LocalBite</span>
      </div>

      <div style={{ marginTop: '30px' }}>
        {menuItems.map((item, index) => (
          <Link to={item.path} key={index} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', padding: '12px 20px', margin: '5px 15px', borderRadius: '10px', gap: '15px',
              backgroundColor: location.pathname === item.path ? '#ff6b00' : 'transparent',
              color: location.pathname === item.path ? 'white' : (darkMode ? '#aaa' : '#555'),
              transition: '0.3s'
            }}>
              {item.icon}
              <span style={{ fontWeight: '500' }}>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
