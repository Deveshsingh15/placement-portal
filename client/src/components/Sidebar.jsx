// components/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Code2, MessageSquare, FileText,
  Settings, LogOut, ShieldCheck, BarChart3, Users, BookOpen, ChevronRight
} from 'lucide-react';

const StudentNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dsa', icon: Code2, label: 'DSA Tracker' },
  { to: '/interview', icon: MessageSquare, label: 'Interview Questions' },
  { to: '/resume', icon: FileText, label: 'Resume' },
  { to: '/profile', icon: Settings, label: 'Profile' },
];

const AdminNav = [
  { to: '/admin', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/students', icon: Users, label: 'Students' },
  { to: '/admin/questions', icon: BookOpen, label: 'Questions' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? AdminNav : StudentNav;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)', width: '240px', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 50 }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={18} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>PlacePro</div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Placement Portal</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'white', fontFamily: 'Syne' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: isAdmin ? '#f59e0b' : 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{isAdmin ? '⚡ Admin' : '🎓 Student'}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 8px 4px', fontWeight: 600 }}>
          {isAdmin ? 'Admin Panel' : 'Navigation'}
        </div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/dashboard' || to === '/admin'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
              fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
              color: isActive ? 'white' : 'var(--text-secondary)',
              background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(6,182,212,0.1))' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
            })}>
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
        <button onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', fontSize: 13, fontWeight: 500, transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
