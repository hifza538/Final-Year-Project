import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, AlertTriangle, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../ThemeContext'; // Theme connect kiya

const Vendors = () => {
  const { darkMode, card, text, subText, border } = useTheme(); // Theme variables
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentVendorId, setCurrentVendorId] = useState(null);

  const [vendorsData, setVendorsData] = useState([
    { id: 1, name: 'Desi Tadka', email: 'desi@food.com', phone: '+92 300 1234567', location: 'Lahore', status: 'Active' },
    { id: 2, name: 'Pizza Point', email: 'pizza@point.com', phone: '+92 311 9876543', location: 'Karachi', status: 'Inactive' },
  ]);

  const [newVendor, setNewVendor] = useState({ name: '', email: '', phone: '', location: '' });

  // --- Search Logic (Pehli wali) ---
  const filteredVendors = vendorsData.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Edit Function (Pehli wali) ---
  const handleEditClick = (vendor) => {
    setIsEditing(true);
    setCurrentVendorId(vendor.id);
    setNewVendor({ ...vendor });
    setShowAddModal(true);
  };

  // --- Delete Logic (Pehli wali) ---
  const confirmDelete = (id) => {
    setVendorToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    setVendorsData(vendorsData.filter(v => v.id !== vendorToDelete));
    setShowDeleteModal(false);
    setVendorToDelete(null);
  };

  // --- Save/Update Function (Pehli wali) ---
  const handleSave = () => {
    if (newVendor.name && newVendor.phone) {
      if (isEditing) {
        setVendorsData(vendorsData.map(v => v.id === currentVendorId ? { ...v, ...newVendor } : v));
      } else {
        setVendorsData([...vendorsData, { id: Date.now(), ...newVendor, status: 'Active' }]);
      }
      setShowAddModal(false);
      setIsEditing(false);
      setNewVendor({ name: '', email: '', phone: '', location: '' });
    } else {
      alert("Please fill Name and Phone!");
    }
  };

  return (
    <div style={{ padding: '5px', color: text }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Vendors Management</h1>
        <button onClick={() => { setIsEditing(false); setNewVendor({name:'', email:'', phone:'', location:''}); setShowAddModal(true); }} 
          style={{ backgroundColor: '#ff6b00', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Add New Vendor
        </button>
      </div>

      {/* Main Table Card (Now with Dark Mode) */}
      <div style={{ backgroundColor: card, padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: `1px solid ${border}`, transition: '0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: darkMode ? '#3d3d3d' : '#f8f9fa', padding: '12px 20px', borderRadius: '12px', marginBottom: '25px', width: '350px', border: `1px solid ${border}` }}>
          <Search size={18} color="#888" />
          <input type="text" placeholder="Search vendors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ border: 'none', background: 'transparent', marginLeft: '10px', outline: 'none', width: '100%', color: text }} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${border}`, color: '#888', fontSize: '13px' }}>
              <th style={{ padding: '15px' }}>Vendor Info</th>
              <th style={{ padding: '15px' }}>Phone</th>
              <th style={{ padding: '15px' }}>Location</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor) => (
              <tr key={vendor.id} style={{ borderBottom: `1px solid ${border}`, color: text }}>
                <td style={{ padding: '20px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ff6b0015', color: '#ff6b00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{vendor.name.charAt(0)}</div>
                      <div><div style={{ fontWeight: 'bold' }}>{vendor.name}</div><div style={{ fontSize: '12px', color: subText }}>{vendor.email}</div></div>
                   </div>
                </td>
                <td style={{ padding: '20px', color: subText }}><Phone size={14} style={{marginRight: '5px'}}/> {vendor.phone}</td>
                <td style={{ padding: '20px', color: subText }}><MapPin size={14} style={{marginRight: '5px'}}/> {vendor.location}</td>
                <td style={{ padding: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <Edit size={18} color="#00b894" style={{ cursor: 'pointer' }} onClick={() => handleEditClick(vendor)} />
                  <Trash2 size={18} color="#d63031" style={{ cursor: 'pointer' }} onClick={() => confirmDelete(vendor.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ADD/EDIT MODAL (Now with Dark Mode) --- */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: card, color: text, padding: '40px', borderRadius: '25px', width: '450px', position: 'relative', border: `1px solid ${border}` }}>
             <X onClick={() => setShowAddModal(false)} size={22} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', color: subText }} />
             <h2 style={{ marginTop: 0, marginBottom: '25px' }}>{isEditing ? 'Update Vendor' : 'Add New Vendor'}</h2>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: subText }}>Vendor Name</label>
                <input type="text" placeholder="Name" value={newVendor.name} onChange={(e) => setNewVendor({...newVendor, name: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${border}`, backgroundColor: darkMode ? '#3d3d3d' : '#f9f9f9', color: text, outline: 'none' }} />
                
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: subText }}>Phone Number</label>
                <input type="text" placeholder="Phone" value={newVendor.phone} onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${border}`, backgroundColor: darkMode ? '#3d3d3d' : '#f9f9f9', color: text, outline: 'none' }} />
                
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: subText }}>Location</label>
                <input type="text" placeholder="City" value={newVendor.location} onChange={(e) => setNewVendor({...newVendor, location: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${border}`, backgroundColor: darkMode ? '#3d3d3d' : '#f9f9f9', color: text, outline: 'none' }} />
                
                <button onClick={handleSave} style={{ marginTop: '10px', backgroundColor: '#ff6b00', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>{isEditing ? 'Update Partner' : 'Save Partner'}</button>
             </div>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL (Now with Dark Mode) --- */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1001 }}>
          <div style={{ backgroundColor: card, color: text, padding: '30px', borderRadius: '20px', width: '380px', textAlign: 'center', border: `1px solid ${border}` }}>
             <AlertTriangle color="#d63031" size={45} style={{ marginBottom: '15px' }} />
             <h3 style={{ margin: '0 0 10px' }}>Delete Vendor?</h3>
             <p style={{ color: subText, marginBottom: '25px', fontSize: '14px' }}>Are you sure you want to remove this partner?</p>
             <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleDelete} style={{ flex: 1, backgroundColor: '#d63031', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Yes, Delete</button>
                <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, backgroundColor: darkMode ? '#3d3d3d' : '#f5f5f5', color: text, border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
