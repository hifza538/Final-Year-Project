import React, { useState } from 'react';
import { Search, User, Trash2, ShieldCheck, ShieldAlert, AlertTriangle, X } from 'lucide-react';
import { useTheme } from '../ThemeContext'; // 1. Theme connect kiya

const Customers = () => {
  const { darkMode, card, text, subText, border } = useTheme(); // 2. Theme variables nikaalein
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  
  const [customersData, setCustomersData] = useState([
    { id: 1, name: 'Ali Ahmed', email: 'ali@example.com', joined: '12 March 2026', orders: 15, status: 'Active' },
    { id: 2, name: 'Sana Khan', email: 'sana@example.com', joined: '10 March 2026', orders: 8, status: 'Active' },
    { id: 3, name: 'Zeeshan Malik', email: 'zeesh@example.com', joined: '05 March 2026', orders: 2, status: 'Inactive' },
  ]);

  const filteredCustomers = customersData.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    setCustomersData(customersData.filter(c => c.id !== customerToDelete));
    setShowDeleteModal(false);
  };

  return (
    <div style={{ padding: '5px', color: text }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' }}>Customer Management</h1>

      {/* Main Card with Dynamic Background */}
      <div style={{ 
        backgroundColor: card, 
        padding: '25px', 
        borderRadius: '20px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)', 
        border: `1px solid ${border}`,
        transition: '0.3s' 
      }}>
        
        {/* Search Bar - Dark Mode compatible */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: darkMode ? '#3d3d3d' : '#f8f9fa', 
          padding: '12px 20px', 
          borderRadius: '12px', 
          marginBottom: '25px', 
          width: '350px', 
          border: `1px solid ${border}` 
        }}>
          <Search size={18} color="#888" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ border: 'none', background: 'transparent', marginLeft: '10px', outline: 'none', width: '100%', color: text }} 
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${border}`, color: '#888', fontSize: '13px', textTransform: 'uppercase' }}>
              <th style={{ padding: '15px' }}>Customer Info</th>
              <th style={{ padding: '15px' }}>Email</th>
              <th style={{ padding: '15px' }}>Orders</th>
              <th style={{ padding: '15px' }}>Status</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} style={{ borderBottom: `1px solid ${border}`, color: text }}>
                <td style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '35px', height: '35px', borderRadius: '50%', 
                    backgroundColor: '#ff6b0015', color: '#ff6b00', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    <User size={16} />
                  </div>
                  <div style={{ fontWeight: 'bold' }}>{customer.name}</div>
                </td>
                <td style={{ padding: '20px', color: subText }}>{customer.email}</td>
                <td style={{ padding: '20px', fontWeight: 'bold', color: '#ff6b00' }}>{customer.orders}</td>
                <td style={{ padding: '20px' }}>
                   <span style={{ 
                     padding: '6px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', 
                     backgroundColor: customer.status === 'Active' ? '#e8f5e9' : '#ffebee', 
                     color: customer.status === 'Active' ? '#2e7d32' : '#c62828', 
                     display: 'flex', alignItems: 'center', gap: '5px', width: 'fit-content' 
                   }}>
                    {customer.status === 'Active' ? <ShieldCheck size={14}/> : <ShieldAlert size={14}/>} {customer.status}
                  </span>
                </td>
                <td style={{ padding: '20px', textAlign: 'center' }}>
                  <Trash2 
                    size={18} 
                    color="#d63031" 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => {setCustomerToDelete(customer.id); setShowDeleteModal(true);}} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- CUSTOM DELETE MODAL --- */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1001 }}>
          <div style={{ backgroundColor: card, color: text, padding: '30px', borderRadius: '20px', width: '380px', textAlign: 'center', border: `1px solid ${border}`, position: 'relative' }}>
             
             {/* Ye raha X icon functionality ke liye */}
             <X 
                onClick={() => setShowDeleteModal(false)} 
                size={20} 
                style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', color: darkMode ? '#aaa' : '#888' }} 
             />

             <AlertTriangle color="#d63031" size={45} style={{ marginBottom: '15px' }} />
             <h3>Remove User?</h3>
             <p style={{ color: subText, marginBottom: '25px', fontSize: '14px' }}>Are you sure you want to remove this user from the platform?</p>
             <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleDelete} style={{ flex: 1, backgroundColor: '#d63031', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Yes, Remove</button>
                <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, backgroundColor: darkMode ? '#3d3d3d' : '#f5f5f5', color: text, border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
