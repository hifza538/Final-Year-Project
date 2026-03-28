import React from 'react';
import { useTheme } from '../ThemeContext';

const StatsCard = ({ title, value, icon, color, trend }) => {
  const { card, text, subText, border } = useTheme();

  return (
    <div style={{
      backgroundColor: card, // Dynamic background
      padding: '25px',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      border: `1px solid ${border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      transition: '0.3s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ backgroundColor: `${color}15`, color: color, padding: '10px', borderRadius: '10px' }}>
          {icon}
        </div>
        <div style={{ fontSize: '12px', color: '#4CAF50', fontWeight: 'bold' }}>{trend}</div>
      </div>
      <div>
        <p style={{ margin: 0, color: subText, fontSize: '14px' }}>{title}</p>
        <h2 style={{ margin: '5px 0 0 0', fontSize: '26px', fontWeight: 'bold', color: text }}>{value}</h2>
      </div>
    </div>
  );
};

export default StatsCard;
