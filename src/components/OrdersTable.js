import React from 'react';
import { useTheme } from '../ThemeContext';

const OrdersTable = () => {
  const { card, text, border } = useTheme(); // Colors nikaalein

  const orders = [
    { id: '#1024', dish: 'Chicken Karahi', customer: 'Ali Khan', price: '$25.00', status: 'Delivered' },
    { id: '#1025', dish: 'Special Biryani', customer: 'Sana Ahmed', price: '$18.50', status: 'Pending' },
  ];

  return (
    <div style={{ 
      backgroundColor: card, 
      padding: '25px', 
      borderRadius: '20px', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      border: `1px solid ${border}`,
      color: text, // Poori div ka text color change hoga
      transition: '0.3s'
    }}>
      <h3 style={{ marginBottom: '20px', color: text }}>Recent Orders</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${border}`, color: '#888', fontSize: '14px' }}>
            <th style={{ padding: '12px' }}>Order ID</th>
            <th style={{ padding: '12px' }}>Dish Name</th>
            <th style={{ padding: '12px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} style={{ borderBottom: `1px solid ${border}`, color: text }}>
              <td style={{ padding: '15px' }}>{order.id}</td>
              <td style={{ padding: '15px' }}>{order.dish}</td>
              <td style={{ padding: '15px' }}>
                <span style={{
                  padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                  backgroundColor: order.status === 'Delivered' ? '#E8F5E9' : '#FFF3E0',
                  color: order.status === 'Delivered' ? '#2E7D32' : '#EF6C00'
                }}>{order.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
