import React, { useState } from 'react';
import { User, Save, Globe, Database, History, CheckCircle, DollarSign, Clock, Download } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const Settings = () => {
  const { darkMode, card, text, subText, border } = useTheme();
  const [saveStatus, setSaveStatus] = useState(false);
  
  // Dynamic States
  const [adminData, setAdminData] = useState({ name: 'Super Admin', email: 'admin@localbite.com' });
  const [currency, setCurrency] = useState('PKR (Rs)'); // Default Currency

  const handleUpdate = () => {
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 3000);
  };

  return (
    <div style={{ padding: '5px', color: text }}>
      {/* Header with Success Alert */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold' }}>Settings & Preferences</h1>
          <p style={{ color: subText }}>Showing System Currency: <b>{currency}</b></p>
        </div>
        {saveStatus && (
          <div style={{ backgroundColor: '#4CAF50', color: 'white', padding: '12px 25px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)' }}>
            <CheckCircle size={18} /> Settings Updated!
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        
        {/* --- 1. SYSTEM PREFERENCES (Currency & Language) --- */}
        <div style={{ backgroundColor: card, padding: '30px', borderRadius: '25px', border: `1px solid ${border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={20} color="#ff6b00" /> System Preferences
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
              <DollarSign size={16} /> Default Currency
            </label>
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={inputStyle(darkMode, border, text)}
            >
              <option value="PKR (Rs)">PKR - Pakistani Rupee (Rs)</option>
              <option value="USD ($)">USD - US Dollar ($)</option>
              <option value="EUR (€)">EUR - Euro (€)</option>
              <option value="GBP (£)">GBP - British Pound (£)</option>
            </select>
            <p style={{ fontSize: '12px', color: subText, marginTop: '5px' }}>All prices on dashboard will be shown in {currency}.</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
              <Clock size={16} /> Business Timezone
            </label>
            <select style={inputStyle(darkMode, border, text)}>
              <option>(GMT+05:00) Islamabad, Karachi</option>
              <option>(GMT+00:00) London, UTC</option>
              <option>(GMT-05:00) New York, EST</option>
            </select>
          </div>
          
          <button onClick={handleUpdate} style={btnPrimary}><Save size={18} /> Sync Preferences</button>
        </div>

        {/* --- 2. ADMIN PROFILE SECTION --- */}
        <div style={{ backgroundColor: card, padding: '30px', borderRadius: '25px', border: `1px solid ${border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={20} color="#ff6b00" /> Admin Profile
          </h3>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Display Name</label>
            <input type="text" value={adminData.name} onChange={(e) => setAdminData({...adminData, name: e.target.value})} style={inputStyle(darkMode, border, text)} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Email Address</label>
            <input type="email" value={adminData.email} style={inputStyle(darkMode, border, text)} />
          </div>
          <button onClick={handleUpdate} style={{ ...btnPrimary, backgroundColor: '#333' }}>Update Profile</button>
        </div>

        {/* --- 3. RECENT ACTIVITY LOG --- */}
        <div style={{ backgroundColor: card, padding: '30px', borderRadius: '25px', border: `1px solid ${border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={20} color="#ff6b00" /> Activity History
          </h3>
          <div style={{ fontSize: '13px', color: subText }}>
            <div style={{ padding: '12px 0', borderBottom: `1px solid ${border}` }}>• Currency changed to <b>{currency}</b> <span style={{float: 'right'}}>Just now</span></div>
            <div style={{ padding: '12px 0', borderBottom: `1px solid ${border}` }}>• Logged in from <b>Lahore, PK</b> <span style={{float: 'right'}}>10m ago</span></div>
            <div style={{ padding: '12px 0' }}>• Theme switched to <b>{darkMode ? 'Dark' : 'Light'}</b> <span style={{float: 'right'}}>1h ago</span></div>
          </div>
        </div>

        {/* --- 4. DATA BACKUP --- */}
        <div style={{ backgroundColor: card, padding: '30px', borderRadius: '25px', border: `1px solid ${border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} color="#ff6b00" /> Database Backup
          </h3>
          <p style={{ fontSize: '13px', color: subText, marginBottom: '20px' }}>Securely download all vendor and order data in a single JSON file.</p>
          <button style={{ backgroundColor: darkMode ? '#444' : '#f5f5f5', color: text, border: `1px solid ${border}`, padding: '14px', borderRadius: '12px', width: '100%', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Download size={18} /> Download Full Backup
          </button>
        </div>

      </div>
    </div>
  );
};

// Styles
const inputStyle = (darkMode, border, text) => ({
  width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${border}`,
  backgroundColor: darkMode ? '#2d2d2d' : '#f9f9f9', color: text, outline: 'none', boxSizing: 'border-box'
});

const btnPrimary = {
  backgroundColor: '#ff6b00', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', 
  fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center'
};

export default Settings;
