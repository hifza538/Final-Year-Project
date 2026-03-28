import React from 'react';
import { Search, Bell, User, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '../ThemeContext'; 

const Navbar = () => {
  const { darkMode, toggleTheme, card, text, border } = useTheme();

  return (
    <div style={{ 
      height: '70px', 
      backgroundColor: card, 
      color: text, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '0 30px', 
      borderBottom: `1px solid ${border}`,
      transition: '0.3s',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      
      {/* 1. Left Side: Global Search Bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: darkMode ? '#3d3d3d' : '#f5f5f5', 
        padding: '8px 15px', 
        borderRadius: '10px', 
        width: '350px',
        transition: '0.3s'
      }}>
        <Search size={18} color={darkMode ? '#aaa' : '#888'} />
        <input 
          type="text" 
          placeholder="Search for anything..." 
          style={{ 
            border: 'none', 
            background: 'transparent', 
            marginLeft: '10px', 
            outline: 'none', 
            width: '100%',
            color: text,
            fontSize: '14px'
          }} 
        />
      </div>

      {/* 2. Right Side: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* --- DARK MODE TOGGLE --- */}
        <div 
          onClick={toggleTheme} 
          style={{ 
            cursor: 'pointer', 
            padding: '8px', 
            borderRadius: '10px', 
            backgroundColor: darkMode ? '#3d3d3d' : '#f5f5f5', 
            display: 'flex', 
            alignItems: 'center'
          }}>
          {darkMode ? <Sun size={20} color="#FFBB28" /> : <Moon size={20} color="#555" />}
        </div>

        {/* --- NOTIFICATIONS --- */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={22} color={darkMode ? '#ccc' : '#555'} />
          <span style={{ 
            position: 'absolute', top: '-5px', right: '-5px', 
            backgroundColor: '#ff6b00', color: 'white', 
            fontSize: '10px', borderRadius: '50%', padding: '2px 5px'
          }}>3</span>
        </div>

        {/* --- ADMIN PROFILE --- */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          paddingLeft: '20px', 
          borderLeft: `1px solid ${border}`,
          cursor: 'pointer'
        }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>Admin Name</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>Super Admin</p>
          </div>
          <div style={{ 
            width: '38px', height: '38px', borderRadius: '10px', 
            backgroundColor: '#ff6b0020', display: 'flex', 
            alignItems: 'center', justifyContent: 'center' 
          }}>
            <User size={20} color="#ff6b00" />
          </div>
          <ChevronDown size={14} color="#888" />
        </div>

      </div>
    </div>
  );
};

export default Navbar;
