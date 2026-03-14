import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Starfield from '../components/Starfield';
import './Dashboard.css';

// Animated count-up hook
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// --- Icons ---
const Icons = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  LayoutDashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>,
  Package: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Layers: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>,
  History: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/><polyline points="12 7 12 12 15 15"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  ArrowRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  AlertTriangle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  ArrowDownCircle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>,
  ArrowUpCircle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg>,
  ArrowLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
};
const historyData = [
  { id: 'TX-1001', product: 'Industrial Bearings', from: 'Vendor (SKF)', to: 'WH-A / Rack 12', qty: '+500', type: 'Receipt', date: '2026-03-14 09:30', status: 'Done' },
  { id: 'TX-1002', product: 'Safety Helmets (Yellow)', from: 'WH-B / Shelf 4', to: 'Site Alpha', qty: '-50', type: 'Delivery', date: '2026-03-14 10:15', status: 'Waiting' },
  { id: 'TX-1003', product: 'Copper Wire 12AWG', from: 'WH-A / Rack 4', to: 'WH-B / Shelf 1', qty: '100', type: 'Internal', date: '2026-03-13 15:45', status: 'Done' },
  { id: 'TX-1004', product: 'Hydraulic Valves', from: 'WH-A / Rack 18', to: 'Scrap', qty: '-4', type: 'Adjustment', date: '2026-03-13 11:20', status: 'Done' },
  { id: 'TX-1005', product: 'Packaging Tape', from: 'Vendor (3M)', to: 'WH-C', qty: '+200', type: 'Receipt', date: '2026-03-14 14:00', status: 'Scheduled' },
];

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userRole = (user?.role || 'Inventory Manager').trim();
  const isWarehouseStaff = userRole.toLowerCase().includes('warehouse staff');
  const [activeTab, setActiveTab] = useState(isWarehouseStaff ? 'operations' : 'dashboard');
  const [isDashboardUnlocked, setIsDashboardUnlocked] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState('');
  
  // Dashboard State
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const notifRef = useRef(null);

  // Close notifications on outside click
  useEffect(() => {
    if (!showNotifications) return;
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Icons.LayoutDashboard />, roles: ['Inventory Manager', 'Warehouse Staff', 'Admin'] },
    { id: 'operations', label: 'Operations', icon: <Icons.Layers />, roles: ['Inventory Manager', 'Warehouse Staff', 'Admin'] },
    { id: 'stock', label: 'Stock', icon: <Icons.Package />, roles: ['Inventory Manager', 'Warehouse Staff', 'Admin'] },
    { id: 'history', label: 'Move History', icon: <Icons.History />, roles: ['Inventory Manager', 'Warehouse Staff', 'Admin'] },
    { id: 'receipts', label: 'Receipts', icon: <Icons.ArrowDownCircle />, roles: ['Inventory Manager', 'Warehouse Staff', 'Admin'] },
    { id: 'delivery', label: 'Delivery', icon: <Icons.ArrowUpCircle />, roles: ['Inventory Manager', 'Warehouse Staff', 'Admin'] },
    { id: 'settings', label: 'Settings', icon: <Icons.Settings />, roles: ['Inventory Manager', 'Admin'] }
  ];

  const navItems = allNavItems.filter(item => 
    item.roles.some(role => role.toLowerCase().trim() === userRole.toLowerCase().trim())
  );

  return (
    <div className="db-layout w-full h-screen overflow-hidden flex">
      <Starfield />
      
      {/* --- SIDEBAR --- */}
      <aside className="db-sidebar flex-shrink-0" style={{width: '260px'}}>
        {/* Logo */}
        <div className="db-sidebar-header" style={{padding: '20px 24px 16px', borderBottom: '1px solid rgba(16,185,129,0.08)'}}>
          <Logo size="sm" />
        </div>

        {/* Nav */}
        <nav className="db-nav" style={{flex: 1, padding: '12px 12px', overflowY: 'auto'}}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`db-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="db-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {activeTab === item.id && <span className="nav-active-pill" />}
            </button>
          ))}
        </nav>

          {/* Notification Bell in Sidebar */}
          <div className="notif-wrapper sidebar-notif-wrapper" ref={notifRef}>
            <button 
              className="notif-bell-btn sidebar-notif-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Icons.Bell />
              <span className="sidebar-notif-label">Notifications</span>
              <span className="notif-dot sidebar-notif-dot" />
            </button>

            {showNotifications && (
              <div className="notif-panel sidebar-notif-panel animate-fade-in">
                <div className="notif-panel-header">
                  <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <span className="notif-panel-icon"><Icons.Bell /></span>
                    <span className="notif-panel-title">Alerts</span>
                    <span className="db-badge db-badge-error" style={{fontSize:'10px'}}>2</span>
                  </div>
                  <button className="notif-mark-read" onClick={() => setShowNotifications(false)}>Mark all read</button>
                </div>

                <div className="notif-list">
                  <div className="notif-item notif-item-error">
                    <div className="notif-item-icon">⚠</div>
                    <div className="notif-item-body">
                      <p className="notif-item-title">Low Stock: <strong>Safety Helmets</strong></p>
                      <p className="notif-item-sub">Only 12 units remaining · 10 mins ago</p>
                    </div>
                  </div>
                  <div className="notif-item notif-item-warning">
                    <div className="notif-item-icon">📦</div>
                    <div className="notif-item-body">
                      <p className="notif-item-title">Low Stock: <strong>Packaging Tape</strong></p>
                      <p className="notif-item-sub">Only 5 units remaining · 35 mins ago</p>
                    </div>
                  </div>
                  <div className="notif-item notif-item-info">
                    <div className="notif-item-icon">↔</div>
                    <div className="notif-item-body">
                      <p className="notif-item-title">Internal Transfer Scheduled</p>
                      <p className="notif-item-sub">WH-A to WH-B · 2 hours ago</p>
                    </div>
                  </div>
                  <div className="notif-item notif-item-success">
                    <div className="notif-item-icon">✓</div>
                    <div className="notif-item-body">
                      <p className="notif-item-title">Receipt Confirmed: SKF Bearings</p>
                      <p className="notif-item-sub">500 units logged to WH-A · 3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        {/* User card at bottom */}
        <div className="sidebar-user-card">
          <div className="sidebar-user-avatar">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name || 'User'}</span>
            <span className="sidebar-user-role">{user?.role || 'Manager'}</span>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="db-main flex-1 flex flex-col min-w-0 bg-transparent relative z-10 w-full">
        
        {/* TOP BAR */}
        <header className="db-topbar h-16 w-full flex items-center justify-between px-8 border-b border-white/5 bg-surface/30 backdrop-blur-xl shrink-0">
          <div className="db-search relative max-w-lg w-full flex items-center">
            <span className="absolute left-3 text-muted"><Icons.Search /></span>
            <input 
              type="text" 
              placeholder="Search products, records, or SKUs..." 
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Topbar right: only bell now, user is in sidebar */}
          <div className="db-topbar-actions flex flex-row items-center gap-4">
            {/* Back Button for non-dashboard views */}
            {activeTab !== 'dashboard' ? (
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="btn btn-outline btn-sm"
                style={{ borderRadius: '20px', borderColor: 'var(--color-border)' }}
              >
                <Icons.ArrowLeft /> Back to Dashboard
              </button>
            ) : (
              <span className="text-muted text-sm hidden md:block" style={{opacity: 0.5}}>
                {navItems.find(n => n.id === activeTab)?.label}
              </span>
            )}

          </div>
        </header>

        {/* DYNAMIC FILTERS (Persistent) */}
        {activeTab === 'dashboard' && (
          <div className="db-filters flex items-center justify-between p-4 px-8 border-b border-white/5 bg-surface/20 w-full shrink-0">
            <div className="db-filter-group flex items-center gap-4 w-full wrap">
              <div className="text-muted flex items-center gap-2"><Icons.Filter /> <span className="text-sm font-medium hidden sm:inline">Filters:</span></div>
              <select className="db-select text-sm p-1.5 min-w-[140px]" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">Document Type</option>
                <option value="Receipt">Receipts</option>
                <option value="Delivery">Deliveries</option>
                <option value="Internal">Internal Transfers</option>
                <option value="Adjustment">Adjustments</option>
              </select>
              <select className="db-select text-sm p-1.5 min-w-[140px]" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Status</option>
                <option value="Draft">Draft</option>
                <option value="Waiting">Waiting</option>
                <option value="Ready">Ready</option>
                <option value="Done">Done</option>
              </select>
              <select className="db-select text-sm p-1.5 min-w-[140px]" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
                <option value="">Location</option>
                <option value="WH-A">Warehouse A</option>
                <option value="WH-B">Warehouse B</option>
              </select>
              <select className="db-select text-sm p-1.5 min-w-[140px]" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">Category</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Finished Goods">Finished Goods</option>
                <option value="Spare Parts">Spare Parts</option>
              </select>
              <input
                type="date"
                className="db-select text-sm p-1.5"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                title="From date"
              />
              <input
                type="date"
                className="db-select text-sm p-1.5"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                title="To date"
              />
            </div>
            <button className="btn btn-ghost btn-sm whitespace-nowrap ml-4 text-muted hover:text-white" onClick={() => { setFilterType(''); setFilterStatus(''); setFilterLocation(''); setFilterCategory(''); setFilterDateFrom(''); setFilterDateTo(''); }}>Clear All</button>
          </div>
        )}

        {/* TAB CONTENT */}
        <div className="db-content-area">
          {/* DYNAMIC CONTENT VIEWS */}
          {activeTab === 'dashboard' && (
            isWarehouseStaff && !isDashboardUnlocked ? (
              <div className="tab-pane animate-fade-in flex flex-col items-center justify-center h-full" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                <div className="db-card" style={{ padding: '40px', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: 'white' }}>Restricted Access</h2>
                  <p className="text-muted mb-8 text-sm">
                    Dashboard analytics are locked for Warehouse Staff. 
                    Please enter the **Manager Passkey** to view sensitive inventory data.
                  </p>
                  
                  <div className="form-group mb-4">
                    <input 
                      type="password" 
                      className="login-input" 
                      placeholder="Enter Passkey" 
                      value={passkey} 
                      onChange={(e) => { setPasskey(e.target.value); setPasskeyError(''); }}
                      onKeyDown={(e) => { if(e.key === 'Enter') { if(passkey === 'CORE2026') setIsDashboardUnlocked(true); else setPasskeyError('Invalid Passkey'); } }}
                      style={{ textAlign: 'center', letterSpacing: '4px' }}
                    />
                    {passkeyError && <p className="text-error text-xs mt-2">{passkeyError}</p>}
                  </div>
                  
                  <button 
                    className="login-btn w-full" 
                    onClick={() => {
                      if (passkey === 'CORE2026') {
                        setIsDashboardUnlocked(true);
                      } else {
                        setPasskeyError('Invalid Passkey');
                      }
                    }}
                  >
                    Unlock Dashboard
                  </button>
                  
                  <p className="text-muted text-xs mt-6">
                    Need help? Contact your <strong>Inventory Manager</strong> for the one-time access key.
                  </p>
                </div>
              </div>
            ) : (
              <TabDashboard 
                searchQuery={searchQuery}
                filterType={filterType}
                filterStatus={filterStatus}
                filterLocation={filterLocation}
                filterCategory={filterCategory}
                filterDateFrom={filterDateFrom}
                filterDateTo={filterDateTo}
                onNavigate={setActiveTab}
              />
            )
          )}
          {activeTab === 'operations' && <TabOperations />}
          {activeTab === 'stock' && <TabStock searchQuery={searchQuery} />}
          {activeTab === 'history' && <TabHistory searchQuery={searchQuery} />}
          {activeTab === 'receipts' && <TabTransfer type="receipt" />}
          {activeTab === 'delivery' && <TabTransfer type="delivery" />}
          {activeTab === 'settings' && <TabSettings />}
        </div>
      </div>
    </div>
  );
}

// --- TAB COMPONENTS ---

function TabDashboard({ searchQuery, filterType, filterStatus, filterLocation, filterCategory, filterDateFrom, filterDateTo, onNavigate }) {
  // Apply filters to historyData
  const filteredHistory = historyData.filter(item => {
    let matchType = true;
    let matchStatus = true;
    let matchLocation = true;
    let matchSearch = true;
    let matchDate = true;

    if (filterType && item.type.toLowerCase() !== filterType.toLowerCase()) matchType = false;
    if (filterStatus && item.status.toLowerCase() !== filterStatus.toLowerCase()) matchStatus = false;
    
    // location matching 
    if (filterLocation) {
      matchLocation = item.from.includes(filterLocation) || item.to.includes(filterLocation);
    }

    if (searchQuery) {
      matchSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    item.id.toLowerCase().includes(searchQuery.toLowerCase());
    }

    let matchCategory = true;
    if (filterCategory) {
       if (filterCategory === 'Raw Materials' && !item.product.toLowerCase().includes('wire')) matchCategory = false;
       if (filterCategory === 'Spare Parts' && !item.product.toLowerCase().includes('bearing') && !item.product.toLowerCase().includes('valves')) matchCategory = false;
       if (filterCategory === 'Finished Goods' && !item.product.toLowerCase().includes('helmet') && !item.product.toLowerCase().includes('tape')) matchCategory = false;
    }

    // Date filtering — item.date format: 'YYYY-MM-DD HH:mm'
    const itemDateStr = item.date.split(' ')[0];
    if (filterDateFrom && itemDateStr < filterDateFrom) matchDate = false;
    if (filterDateTo   && itemDateStr > filterDateTo)   matchDate = false;

    return matchType && matchStatus && matchLocation && matchSearch && matchCategory && matchDate;
  });

  // Animated numbers
  const totalStock   = useCountUp(45892);
  const lowStock     = useCountUp(24);
  const pendReceipts = useCountUp(12);
  const pendDelivery = useCountUp(8);
  const transfers    = useCountUp(3);

  return (
    <div className="tab-pane animate-fade-in w-full">
      
      {/* KPI Row */}
      <div className="kpi-grid w-full">

        <div className="kpi-card kpi-clickable" onClick={() => onNavigate('stock')} title="View all stock">
          <div className="kpi-icon-badge" style={{background:'rgba(16,185,129,0.12)',color:'var(--color-accent)'}}><Icons.Package /></div>
          <div className="kpi-title">Total Products in Stock</div>
          <div className="kpi-value text-primary">{totalStock.toLocaleString()}</div>
          <div className="kpi-desc">Across 12 warehouses</div>
          <div className="kpi-cta">View Stock →</div>
        </div>

        <div className="kpi-card kpi-warning kpi-clickable" onClick={() => onNavigate('stock')} title="View low stock items">
          <div className="kpi-icon-badge" style={{background:'rgba(239,68,68,0.12)',color:'var(--color-error)'}}><Icons.AlertTriangle /></div>
          <div className="kpi-title">Low / Out of Stock</div>
          <div className="kpi-value text-error">{lowStock}</div>
          <div className="kpi-desc">Items below reorder level</div>
          <div className="kpi-cta" style={{color:'var(--color-error)'}}>Review Alerts →</div>
        </div>

        <div className="kpi-card kpi-clickable" onClick={() => onNavigate('operations')} title="Go to receiving queue">
          <div className="kpi-icon-badge" style={{background:'rgba(59,130,246,0.12)',color:'var(--color-info)'}}><Icons.History /></div>
          <div className="kpi-title">Pending Receipts</div>
          <div className="kpi-value text-white">{pendReceipts}</div>
          <div className="kpi-desc">Awaiting supplier delivery</div>
          <div className="kpi-cta" style={{color:'var(--color-info)'}}>Receive Stock →</div>
        </div>

        <div className="kpi-card kpi-clickable" onClick={() => onNavigate('operations')} title="Go to packing queue">
          <div className="kpi-icon-badge" style={{background:'rgba(245,158,11,0.12)',color:'var(--color-warning)'}}><Icons.Layers /></div>
          <div className="kpi-title">Pending Deliveries</div>
          <div className="kpi-value text-white">{pendDelivery}</div>
          <div className="kpi-desc">Awaiting shipment</div>
          <div className="kpi-cta" style={{color:'var(--color-warning)'}}>Pack &amp; Ship →</div>
        </div>

        <div className="kpi-card kpi-clickable" onClick={() => onNavigate('history')} title="View move history">
          <div className="kpi-icon-badge" style={{background:'rgba(99,102,241,0.12)',color:'#818cf8'}}><Icons.ArrowRight /></div>
          <div className="kpi-title">Internal Transfers</div>
          <div className="kpi-value" style={{color:'#818cf8'}}>{transfers}</div>
          <div className="kpi-desc">Scheduled transfers</div>
          <div className="kpi-cta" style={{color:'#818cf8'}}>View History →</div>
        </div>

      </div>

      {/* RECENT ACTIVITY TABLE */}
      <div className="db-card w-full mt-4">
        <div className="db-header-flex mb-6">
          <h2 className="db-section-title">Recent Activity Log</h2>
          {/* Filters are now in parent Dashboard for global accessibility */}
        </div>

        <div className="db-table-container">
          <table className="db-table w-full">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Product</th>
                <th>Location (From/To)</th>
                <th>Qty</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? filteredHistory.map(row => (
                <tr className="db-row-hoverable cursor-default" key={row.id}>
                  <td className="font-medium text-white">{row.id}</td>
                  <td className="text-white">{row.product}</td>
                  <td className="text-muted text-sm">{row.from} <br/><span className="text-white">→ {row.to}</span></td>
                  <td className={`font-medium ${row.qty.startsWith('-') ? 'text-error' : 'text-success'}`}>{row.qty}</td>
                  <td>{row.type}</td>
                  <td className="text-muted">{row.date}</td>
                  <td>
                    <span className={`db-badge ${
                      row.status === 'Done' ? 'db-badge-success' : 
                      row.status === 'Waiting' || row.status === 'Scheduled' ? 'db-badge-warning' : 'db-badge-neutral'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-muted italic">No records match your current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TabOperations() {
  const [activeOp, setActiveOp] = useState(null);

  if (activeOp === 'picking') return <PickingView onBack={() => setActiveOp(null)} />;
  if (activeOp === 'packing') return <PackingView onBack={() => setActiveOp(null)} />;
  if (activeOp === 'receiving') return <ReceivingView onBack={() => setActiveOp(null)} />;
  if (activeOp === 'count') return <CountView onBack={() => setActiveOp(null)} />;

  return (
    <div className="tab-pane animate-fade-in">
      <h1 className="db-page-title">My Tasks (Warehouse Operations)</h1>
      
      <div className="settings-grid">
        <div className="db-card db-card-hoverable">
          <div className="db-header-flex">
            <h3 style={{display:'flex', alignItems:'center', gap:'8px'}}><Icons.Package /> Picking Operations</h3>
            <span className="db-badge db-badge-warning">8 Pending</span>
          </div>
          <p className="text-muted text-sm mt-2">Pick listed items from shelves for outbound delivery.</p>
          <button 
            className="btn btn-primary btn-sm mt-4" 
            style={{width: '100%'}}
            onClick={() => setActiveOp('picking')}
          >
            Start Picking
          </button>
        </div>

        <div className="db-card db-card-hoverable">
          <div className="db-header-flex">
            <h3 style={{display:'flex', alignItems:'center', gap:'8px'}}><Icons.Layers /> Packing & Shipping</h3>
            <span className="db-badge db-badge-success">Ready</span>
          </div>
          <p className="text-muted text-sm mt-2">Pack picked items into boxes and print shipping labels.</p>
          <button className="btn btn-outline btn-sm mt-4" style={{width: '100%'}} onClick={() => setActiveOp('packing')}>Go to Packing</button>
        </div>

        <div className="db-card db-card-hoverable">
          <div className="db-header-flex">
            <h3 style={{display:'flex', alignItems:'center', gap:'8px'}}><Icons.History /> Receiving (Inbound)</h3>
            <span className="db-badge db-badge-info">Scheduled</span>
          </div>
          <p className="text-muted text-sm mt-2">Scan barcodes to receive new stock from suppliers directly.</p>
          <button className="btn btn-outline btn-sm mt-4" style={{width: '100%'}} onClick={() => setActiveOp('receiving')}>Receive Stock</button>
        </div>

        <div className="db-card db-card-hoverable">
          <div className="db-header-flex">
            <h3 style={{display:'flex', alignItems:'center', gap:'8px'}}><Icons.AlertTriangle /> Inventory Count</h3>
            <span className="db-badge db-badge-error">Location WH-B</span>
          </div>
          <p className="text-muted text-sm mt-2">Perform cycle counts to ensure physical stock matches system.</p>
          <button className="btn btn-outline btn-sm mt-4" style={{width: '100%'}} onClick={() => setActiveOp('count')}>Start Count</button>
        </div>
      </div>
    </div>
  );
}

function PickingView({ onBack }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('core_token');
      const res = await fetch('http://localhost:5000/api/tasks/picking', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePick = async (id) => {
    try {
      const token = localStorage.getItem('core_token');
      const res = await fetch(`http://localhost:5000/api/tasks/picking/${id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to complete task');
      
      // Update local state to remove the completed task
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="tab-pane animate-fade-in">
      <div className="db-header-flex" style={{marginBottom: '24px'}}>
        <h1 className="db-page-title" style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <button className="btn btn-outline btn-sm" onClick={onBack} aria-label="Go back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          Active Picking Session
        </h1>
        {tasks.length > 0 && <span className="db-badge db-badge-warning">{tasks.length} Remaining</span>}
      </div>

      {loading ? (
        <div className="db-card text-center p-8 text-muted"><span className="spinner" style={{borderColor: 'var(--color-accent)'}}/> Loading tasks...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="db-card text-center p-8">
          <div style={{color: 'var(--color-success)', fontSize: '48px', marginBottom: '16px'}}>✓</div>
          <h3 className="text-white">All Caught Up!</h3>
          <p className="text-muted mt-2">There are no pending picking tasks at the moment.</p>
          <button className="btn btn-primary mt-6" onClick={onBack}>Return to Operations</button>
        </div>
      ) : (
        <div className="db-table-container">
          <table className="db-table">
            <thead>
              <tr>
                <th>Item Details</th>
                <th>Location</th>
                <th>QTY to Pick</th>
                <th style={{textAlign: 'right'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="font-medium text-white">{task.item_name}</td>
                  <td className="text-muted">{task.location}</td>
                  <td className="font-bold text-white">{task.quantity}</td>
                  <td style={{textAlign: 'right'}}>
                    <button 
                      className="btn btn-sm" 
                      style={{backgroundColor: 'var(--color-success)', color: '#000', fontWeight: 'bold'}}
                      onClick={() => handlePick(task.id)}
                    >
                      Pick Items
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- PACKING VIEW ---
function PackingView({ onBack }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('core_token');
      const res = await fetch('http://localhost:5000/api/tasks/packing', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch packing tasks');
      setTasks(await res.json());
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handlePack = async (id) => {
    try {
      const token = localStorage.getItem('core_token');
      const res = await fetch(`http://localhost:5000/api/tasks/packing/${id}/complete`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to complete task');
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) { alert('Error: ' + err.message); }
  };

  return (
    <div className="tab-pane animate-fade-in">
      <div className="db-header-flex" style={{marginBottom: '24px'}}>
        <h1 className="db-page-title" style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <button className="btn btn-outline btn-sm" onClick={onBack} aria-label="Go back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          Packing &amp; Shipping Queue
        </h1>
        {tasks.length > 0 && <span className="db-badge db-badge-warning">{tasks.length} Orders Pending</span>}
      </div>
      {loading ? (
        <div className="db-card text-center p-8 text-muted">Loading packing orders...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="db-card text-center p-8">
          <div style={{color: 'var(--color-success)', fontSize: '48px', marginBottom: '16px'}}>✓</div>
          <h3 className="text-white">All Packed!</h3>
          <p className="text-muted mt-2">No pending packing orders.</p>
          <button className="btn btn-primary mt-6" onClick={onBack}>Return to Operations</button>
        </div>
      ) : (
        <div className="db-table-container">
          <table className="db-table">
            <thead><tr><th>Order Ref</th><th>Items</th><th>Destination</th><th>Created</th><th style={{textAlign:'right'}}>Action</th></tr></thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="font-medium text-white">{task.order_ref}</td>
                  <td className="font-bold text-white">{task.item_count} items</td>
                  <td className="text-muted">{task.destination}</td>
                  <td className="text-muted text-sm">{task.created_at?.slice(0,10)}</td>
                  <td style={{textAlign:'right'}}>
                    <button className="btn btn-sm" style={{backgroundColor:'var(--color-info)',color:'#fff',fontWeight:'bold'}} onClick={() => handlePack(task.id)}>Pack Order</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- RECEIVING VIEW ---
function ReceivingView({ onBack }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('core_token');
      const res = await fetch('http://localhost:5000/api/tasks/receiving', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch receiving tasks');
      setTasks(await res.json());
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleReceive = async (id) => {
    try {
      const token = localStorage.getItem('core_token');
      const res = await fetch(`http://localhost:5000/api/tasks/receiving/${id}/complete`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to confirm receipt');
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) { alert('Error: ' + err.message); }
  };

  return (
    <div className="tab-pane animate-fade-in">
      <div className="db-header-flex" style={{marginBottom: '24px'}}>
        <h1 className="db-page-title" style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <button className="btn btn-outline btn-sm" onClick={onBack} aria-label="Go back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          Inbound Receiving Queue
        </h1>
        {tasks.length > 0 && <span className="db-badge db-badge-info">{tasks.length} Deliveries Expected</span>}
      </div>
      {loading ? (
        <div className="db-card text-center p-8 text-muted">Checking dock schedule...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="db-card text-center p-8">
          <div style={{color: 'var(--color-success)', fontSize: '48px', marginBottom: '16px'}}>✓</div>
          <h3 className="text-white">All Received!</h3>
          <p className="text-muted mt-2">No pending inbound deliveries.</p>
          <button className="btn btn-primary mt-6" onClick={onBack}>Return to Operations</button>
        </div>
      ) : (
        <div className="db-table-container">
          <table className="db-table">
            <thead><tr><th>Supplier</th><th>Expected Items</th><th>Dock</th><th>Scheduled</th><th style={{textAlign:'right'}}>Action</th></tr></thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="font-medium text-white">{task.supplier}</td>
                  <td className="font-bold text-white">{task.expected_items} items</td>
                  <td><span className="db-badge db-badge-neutral">{task.dock}</span></td>
                  <td className="text-muted text-sm">{task.created_at?.slice(0,10)}</td>
                  <td style={{textAlign:'right'}}>
                    <button className="btn btn-sm" style={{backgroundColor:'var(--color-accent)',color:'#000',fontWeight:'bold'}} onClick={() => handleReceive(task.id)}>Confirm Receipt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- COUNT VIEW ---
function CountView({ onBack }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [counts, setCounts] = useState({});

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('core_token');
      const res = await fetch('http://localhost:5000/api/tasks/count', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch count tasks');
      setTasks(await res.json());
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleCount = async (id) => {
    try {
      const token = localStorage.getItem('core_token');
      const res = await fetch(`http://localhost:5000/api/tasks/count/${id}/complete`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to submit count');
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) { alert('Error: ' + err.message); }
  };

  return (
    <div className="tab-pane animate-fade-in">
      <div className="db-header-flex" style={{marginBottom: '24px'}}>
        <h1 className="db-page-title" style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <button className="btn btn-outline btn-sm" onClick={onBack} aria-label="Go back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          Inventory Cycle Count
        </h1>
        {tasks.length > 0 && <span className="db-badge db-badge-error">{tasks.length} Locations Left</span>}
      </div>
      {loading ? (
        <div className="db-card text-center p-8 text-muted">Loading count tasks...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="db-card text-center p-8">
          <div style={{color: 'var(--color-success)', fontSize: '48px', marginBottom: '16px'}}>✓</div>
          <h3 className="text-white">Count Complete!</h3>
          <p className="text-muted mt-2">All locations verified.</p>
          <button className="btn btn-primary mt-6" onClick={onBack}>Return to Operations</button>
        </div>
      ) : (
        <div className="db-table-container">
          <table className="db-table">
            <thead><tr><th>Location</th><th>System Qty</th><th>Your Count</th><th>Variance</th><th style={{textAlign:'right'}}>Action</th></tr></thead>
            <tbody>
              {tasks.map(task => {
                const counted = counts[task.id] !== undefined ? parseInt(counts[task.id]) : '';
                const variance = counted !== '' ? counted - task.system_qty : null;
                return (
                  <tr key={task.id}>
                    <td className="font-medium text-white">{task.location}</td>
                    <td className="text-muted">{task.system_qty}</td>
                    <td>
                      <input type="number" min="0" className="login-input"
                        style={{width:'100px',padding:'6px 10px',fontSize:'13px'}}
                        placeholder="Enter qty"
                        value={counts[task.id] ?? ''}
                        onChange={e => setCounts(prev => ({...prev, [task.id]: e.target.value}))}
                      />
                    </td>
                    <td className={variance === null ? 'text-muted' : variance === 0 ? 'text-success font-bold' : 'text-error font-bold'}>
                      {variance === null ? '—' : variance > 0 ? `+${variance}` : `${variance}`}
                    </td>
                    <td style={{textAlign:'right'}}>
                      <button className="btn btn-sm"
                        style={{backgroundColor:'var(--color-success)',color:'#000',fontWeight:'bold',opacity: counted === '' ? 0.5 : 1}}
                        disabled={counted === ''}
                        onClick={() => handleCount(task.id)}
                      >Submit Count</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TabStock({ searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', quantity: 0, location: '', category: '' });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('core_token');
      const res = await fetch('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('core_token');
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setNewProduct({ name: '', sku: '', quantity: 0, location: '', category: '' });
        fetchProducts();
      } else {
        const err = await res.json();
        alert('Failed to add product: ' + err.error);
      }
    } catch (err) { alert('Error adding product.'); }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('core_token');
      const res = await fetch(`http://localhost:5000/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editProduct)
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        setEditProduct(null);
        fetchProducts();
      } else {
        const err = await res.json();
        alert('Failed to update: ' + err.error);
      }
    } catch (err) { alert('Error updating product.'); }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('core_token');
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        fetchProducts();
      } else {
        const err = await res.json();
        alert('Failed to delete: ' + err.error);
      }
    } catch (err) { alert('Error deleting product.'); }
  };

  const filteredData = products.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ProductForm = ({ data, setData, onSubmit, onCancel, title, submitLabel }) => (
    <div className="db-modal-overlay">
      <div className="db-modal db-card">
        <h2 className="db-section-title">{title}</h2>
        <form onSubmit={onSubmit} style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
          <input type="text" className="login-input" placeholder="Product Name" value={data.name} onChange={e => setData({...data, name: e.target.value})} required />
          {!data.id && <input type="text" className="login-input" placeholder="SKU (e.g., BRG-1010)" value={data.sku} onChange={e => setData({...data, sku: e.target.value})} required />}
          <input type="number" className="login-input" placeholder="Quantity" value={data.quantity} onChange={e => setData({...data, quantity: parseInt(e.target.value) || 0})} required />
          <input type="text" className="login-input" placeholder="Location (e.g., WH-A / Rack 1)" value={data.location} onChange={e => setData({...data, location: e.target.value})} required />
          <select className="login-input login-select" value={data.category} onChange={e => setData({...data, category: e.target.value})} required>
            <option value="">Select Category</option>
            <option value="Raw Materials">Raw Materials</option>
            <option value="Finished Goods">Finished Goods</option>
            <option value="Spare Parts">Spare Parts</option>
            <option value="Consumables">Consumables</option>
          </select>
          <div className="db-header-flex mt-2">
            <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="tab-pane animate-fade-in relative">
      <div className="db-header-flex">
        <h1 className="db-page-title">Current Stock</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>+ Add Product</button>
      </div>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <ProductForm
          data={newProduct} setData={setNewProduct}
          onSubmit={handleAddProduct}
          onCancel={() => { setIsAddModalOpen(false); setNewProduct({ name: '', sku: '', quantity: 0, location: '', category: '' }); }}
          title="Add New Product" submitLabel="Save Product"
        />
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && editProduct && (
        <ProductForm
          data={editProduct} setData={setEditProduct}
          onSubmit={handleEditProduct}
          onCancel={() => { setIsEditModalOpen(false); setEditProduct(null); }}
          title="Edit Product" submitLabel="Update Product"
        />
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="db-modal-overlay">
          <div className="db-modal db-card" style={{maxWidth: '380px', textAlign: 'center'}}>
            <div style={{fontSize: '40px', marginBottom: '12px'}}>⚠️</div>
            <h2 className="db-section-title">Delete Product?</h2>
            <p className="text-muted text-sm mt-2 mb-6">This action is permanent and cannot be undone.</p>
            <div className="db-header-flex">
              <button className="btn btn-outline" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
              <button className="btn" style={{background: 'var(--color-error)', color: '#fff'}} onClick={() => handleDeleteProduct(deleteConfirmId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="db-card text-center p-8 text-muted">Loading stock...</div> : (
        <div className="db-table-container">
          <table className="db-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Category</th>
                <th>Status</th>
                <th style={{textAlign: 'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr className="db-row-hoverable" key={item.id}>
                  <td className="font-medium text-white">{item.name}</td>
                  <td className="text-muted font-mono text-xs">{item.sku}</td>
                  <td className={item.quantity < 20 ? 'text-error font-bold' : ''}>{item.quantity} units</td>
                  <td className="text-muted">{item.location}</td>
                  <td><span className="db-badge db-badge-neutral">{item.category}</span></td>
                  <td>
                    {item.low_stock ? (
                      <span className="db-badge db-badge-error">⚠ Low Stock</span>
                    ) : (
                      <span className="db-badge db-badge-success">In Stock</span>
                    )}
                  </td>
                  <td style={{textAlign: 'right'}}>
                    <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => { setEditProduct({...item}); setIsEditModalOpen(true); }}
                      >Edit</button>
                      <button
                        className="btn btn-sm"
                        style={{borderColor: 'var(--color-error)', color: 'var(--color-error)', background: 'transparent'}}
                        onClick={() => setDeleteConfirmId(item.id)}
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr><td colSpan="7" className="text-center p-8 text-muted">No products found{searchQuery ? ` matching "${searchQuery}"` : ''}.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TabHistory({ searchQuery }) {
  const filteredData = historyData.filter(item => 
    item.product.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Done': return 'db-badge-success';
      case 'Waiting': return 'db-badge-warning';
      case 'Scheduled': return 'db-badge-info';
      case 'Late': return 'db-badge-error';
      default: return 'db-badge-neutral';
    }
  };

  return (
    <div className="tab-pane animate-fade-in">
      <h1 className="db-page-title">Move History Ledger</h1>
      
      <div className="db-table-container">
        <table className="db-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date</th>
              <th>Type</th>
              <th>Product</th>
              <th>Source → Destination</th>
              <th>Qty</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id}>
                <td className="font-medium">{item.id}</td>
                <td className="text-muted">{item.date}</td>
                <td>{item.type}</td>
                <td className="text-white">{item.product}</td>
                <td className="text-muted">{item.from} <Icons.ArrowRight /> {item.to}</td>
                <td className={item.qty.startsWith('+') ? 'text-success' : item.qty.startsWith('-') ? 'text-error' : ''}>
                  {item.qty}
                </td>
                <td>
                  <span className={`db-badge ${getStatusBadge(item.status)}`}>{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabSettings() {
  const [warehouses, setWarehouses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ci_warehouses')) || ['WH-A (Main)', 'WH-B (Secondary)', 'WH-C (Overflow)']; }
    catch { return ['WH-A (Main)', 'WH-B (Secondary)', 'WH-C (Overflow)']; }
  });
  const [newWarehouse, setNewWarehouse] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState(() => localStorage.getItem('ci_low_stock_threshold') || '20');
  const [categories, setCategories] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ci_categories')) || ['Raw Materials', 'Finished Goods', 'Spare Parts', 'Consumables']; }
    catch { return ['Raw Materials', 'Finished Goods', 'Spare Parts', 'Consumables']; }
  });
  const [newCategory, setNewCategory] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  const saveWarehouses = () => {
    if (!newWarehouse.trim()) return;
    const updated = [...warehouses, newWarehouse.trim()];
    setWarehouses(updated);
    localStorage.setItem('ci_warehouses', JSON.stringify(updated));
    setNewWarehouse('');
  };

  const removeWarehouse = (i) => {
    const updated = warehouses.filter((_, idx) => idx !== i);
    setWarehouses(updated);
    localStorage.setItem('ci_warehouses', JSON.stringify(updated));
  };

  const saveThreshold = () => {
    localStorage.setItem('ci_low_stock_threshold', lowStockThreshold);
    setSaveMsg('Saved!'); setTimeout(() => setSaveMsg(''), 2000);
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    localStorage.setItem('ci_categories', JSON.stringify(updated));
    setNewCategory('');
  };

  const removeCategory = (i) => {
    const updated = categories.filter((_, idx) => idx !== i);
    setCategories(updated);
    localStorage.setItem('ci_categories', JSON.stringify(updated));
  };

  return (
    <div className="tab-pane animate-fade-in">
      <h1 className="db-page-title">System Settings</h1>
      <div className="settings-grid">

        {/* Warehouses */}
        <div className="db-card">
          <h3 style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
            <Icons.LayoutDashboard /> Warehouses
          </h3>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'12px'}}>
            {warehouses.map((wh, i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:'rgba(255,255,255,0.05)',borderRadius:'8px'}}>
                <span className="text-white text-sm">{wh}</span>
                <button onClick={() => removeWarehouse(i)} style={{background:'none',border:'none',color:'var(--color-error)',cursor:'pointer',fontSize:'16px'}}>×</button>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <input className="login-input" style={{flex:1,padding:'8px 12px',fontSize:'13px'}} placeholder="e.g. WH-D (Remote)" value={newWarehouse} onChange={e => setNewWarehouse(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveWarehouses()} />
            <button className="btn btn-primary btn-sm" onClick={saveWarehouses}>Add</button>
          </div>
        </div>

        {/* Inventory Rules */}
        <div className="db-card">
          <h3 style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
            <Icons.AlertTriangle /> Inventory Rules
          </h3>
          <label className="text-sm text-muted" style={{display:'block',marginBottom:'8px'}}>Low Stock Threshold (units)</label>
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            <input
              type="number" min="1" max="999"
              className="login-input"
              style={{flex:1,padding:'8px 12px',fontSize:'14px'}}
              value={lowStockThreshold}
              onChange={e => setLowStockThreshold(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={saveThreshold}>Save</button>
          </div>
          {saveMsg && <p style={{color:'var(--color-success)',fontSize:'13px',marginTop:'8px'}}>{saveMsg}</p>}
          <p className="text-muted text-xs mt-4">Products with quantity below this value will be flagged as Low Stock.</p>
        </div>

        {/* Product Categories */}
        <div className="db-card">
          <h3 style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
            <Icons.Package /> Product Categories
          </h3>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'12px'}}>
            {categories.map((cat, i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:'rgba(255,255,255,0.05)',borderRadius:'8px'}}>
                <span className="text-white text-sm">{cat}</span>
                <button onClick={() => removeCategory(i)} style={{background:'none',border:'none',color:'var(--color-error)',cursor:'pointer',fontSize:'16px'}}>×</button>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <input className="login-input" style={{flex:1,padding:'8px 12px',fontSize:'13px'}} placeholder="New category name" value={newCategory} onChange={e => setNewCategory(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCategory()} />
            <button className="btn btn-primary btn-sm" onClick={addCategory}>Add</button>
          </div>
        </div>

        {/* Storage Info */}
        <div className="db-card">
          <h3 style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
            <Icons.Layers /> Storage Info
          </h3>
          <p className="text-muted text-sm">Current storage configuration across all registered warehouses:</p>
          <div style={{marginTop:'16px',display:'flex',flexDirection:'column',gap:'10px'}}>
            {warehouses.map((wh, i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 12px',background:'rgba(255,255,255,0.04)',borderRadius:'8px',borderLeft:'3px solid var(--color-accent)'}}>
                <span className="text-white text-sm font-medium">{wh}</span>
                <span className="text-muted text-xs">{Math.floor(Math.random() * 50 + 10)} racks active</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function TabTransfer({ type }) {
  const isReceipt = type === 'receipt';
  const title = isReceipt ? 'Receipts' : 'Delivery Orders';
  const locationLabel = isReceipt ? 'Receive From' : 'Delivery Address';
  
  const [status, setStatus] = useState('draft'); // draft, ready, done
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [responsible, setResponsible] = useState('Admin User');
  const [location, setLocation] = useState(isReceipt ? 'Vendor XYZ' : 'Customer ABC');

  const handleToDo = () => setStatus('ready');
  const handleValidate = () => setStatus('done');
  const handleCancel = () => setStatus('draft');

  return (
    <div className="db-section animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="db-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isReceipt ? <Icons.ArrowDownCircle /> : <Icons.ArrowUpCircle />} {title}
        </h2>
      </div>

      <div className="db-card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Top Action Bar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {status === 'draft' && (
              <button className="btn btn-primary btn-sm" onClick={handleToDo}>Mark as To Do</button>
            )}
            {status === 'ready' && (
              <button className="btn btn-primary btn-sm" onClick={handleValidate} style={{ background: 'var(--color-success)', borderColor: 'var(--color-success)' }}>Validate</button>
            )}
            <button className="btn btn-outline btn-sm">Print</button>
            <button className="btn btn-outline btn-sm" onClick={handleCancel} style={{ color: 'var(--color-error)', borderColor: 'rgba(239,68,68,0.3)' }}>Cancel</button>
          </div>

          {/* Pipeline Status Bar */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className={`db-badge ${status === 'draft' ? 'db-badge-info' : 'db-badge-neutral'}`}>Draft</span>
            <Icons.ArrowRight />
            <span className={`db-badge ${status === 'ready' ? 'db-badge-warning' : 'db-badge-neutral'}`}>Ready</span>
            <Icons.ArrowRight />
            <span className={`db-badge ${status === 'done' ? 'db-badge-success' : 'db-badge-neutral'}`}>Done</span>
          </div>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '24px', maxWidth: '800px', marginBottom: '32px' }}>
            <div className="form-group">
              <label className="form-label">{locationLabel}</label>
              <input type="text" className="form-input" value={location} onChange={e => setLocation(e.target.value)} disabled={status === 'done'} />
            </div>
            <div className="form-group">
              <label className="form-label">Schedule Date</label>
              <input type="date" className="form-input" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} disabled={status === 'done'} />
            </div>
            <div className="form-group">
              <label className="form-label">Responsible</label>
              <input type="text" className="form-input" value={responsible} onChange={e => setResponsible(e.target.value)} disabled={status === 'done'} />
            </div>
            <div className="form-group">
              <label className="form-label">Source Document</label>
              <input type="text" className="form-input" placeholder="e.g. PO-00124" disabled={status === 'done'} />
            </div>
          </div>

          {/* Products List */}
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Products</h3>
          <div className="db-table-container">
            <table className="db-table w-full">
              <thead>
                <tr>
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-right p-4">Demand</th>
                  <th className="text-right p-4">Done</th>
                  <th className="text-center p-4">Unit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/5 db-row-hoverable">
                  <td className="p-4 font-medium text-white">Desk</td>
                  <td className="p-4 text-muted">Office/Executive Desk (Wood)</td>
                  <td className="p-4 text-right">5.00</td>
                  <td className="p-4 text-right">
                    {status === 'done' ? <span className="text-success">5.00</span> : <span className="text-muted">0.00</span>}
                  </td>
                  <td className="p-4 text-center">Units</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
