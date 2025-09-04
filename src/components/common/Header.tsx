import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ShoppingBag } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <ShoppingBag className="logo-icon" />
          <h1 className="logo-text">Shop Manager</h1>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <User size={20} />
            <span>{user?.name}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="logout-btn"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
