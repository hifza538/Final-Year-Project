import React from 'react';
import { ShoppingBag, Users, Store, DollarSign } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import RevenueGraph from '../components/RevenueGraph';
import OrdersTable from '../components/OrdersTable';
import { useTheme } from '../ThemeContext'; // 1. Theme bulayein

const Dashboard = () => {
  const { text, subText } = useTheme(); // 2. Text aur SubText ke rang nikaalein

  return (
    <div style={{ padding: '5px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '30px' }}>
        {/* Yahan hum 'text' variable use kar rahe hain jo dark mode mein white ho jata hai */}
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: text }}>Dashboard Overview</h1>
        <p style={{ color: subText, marginTop: '5px' }}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* 4 Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '25px', 
        marginBottom: '40px' 
      }}>
        <StatsCard title="Total Revenue" value="$12,450" icon={<DollarSign size={24}/>} color="#ff6b00" trend="+12.5%" />
        <StatsCard title="Active Vendors" value="85" icon={<Store size={24}/>} color="#4CAF50" trend="+3 new" />
        <StatsCard title="Total Customers" value="1,240" icon={<Users size={24}/>} color="#2196F3" trend="+18 today" />
        <StatsCard title="Total Orders" value="3,150" icon={<ShoppingBag size={24}/>} color="#9C27B0" trend="+5.2%" />
      </div>

      <RevenueGraph />
      <OrdersTable />
    </div>
  );
};

export default Dashboard;
