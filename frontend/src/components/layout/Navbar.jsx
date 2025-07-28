import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, FileText, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-transparent backdrop-blur-sm px-4 py-3 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl text-green-800 hover:text-green-900 transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
          MindfulVision
        </Link>
        
        <div className="flex gap-2">
          <Link 
            to="/" 
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
              isActive("/")
                ? "bg-green-100 text-green-800 font-medium"
                : "bg-transparent text-green-800 hover:bg-green-50"
            )}
          >
            <Home size={18} className="text-green-800" />
            <span>Home</span>
          </Link>
          <Link 
            to="/practice" 
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
              isActive("/practice")
                ? "bg-green-100 text-green-800 font-medium"
                : "bg-transparent text-green-800 hover:bg-green-50"
            )}
          >
            <Activity size={18} className="text-green-800" />
            <span>Practice</span>
          </Link>
          <Link 
            to="/poses" 
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
              isActive("/poses")
                ? "bg-green-100 text-green-800 font-medium"
                : "bg-transparent text-green-800 hover:bg-green-50"
            )}
          >
            <FileText size={18} className="text-green-800" />
            <span>Pose Library</span>
          </Link>
          <Link 
            to="/settings" 
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
              isActive("/settings")
                ? "bg-green-100 text-green-800 font-medium"
                : "bg-transparent text-green-800 hover:bg-green-50"
            )}
          >
            <Settings size={18} className="text-green-800" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
