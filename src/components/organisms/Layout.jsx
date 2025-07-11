import { useLocation } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Don't show sidebar on auth pages
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
  
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;