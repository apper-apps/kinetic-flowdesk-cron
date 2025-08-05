import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "@/App";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = React.useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
const navigationItems = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Activities", href: "/activities", icon: "Activity" },
    { name: "Companies", href: "/companies", icon: "Building" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Deals", href: "/deals", icon: "Target" },
    { name: "Quotes", href: "/quotes", icon: "FileText" }
  ];
  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  const NavItem = ({ item }) => (
    <NavLink
      to={item.href}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
            : "text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700"
        }`
      }
    >
      <ApperIcon name={item.icon} className="mr-3 h-5 w-5" />
      {item.name}
    </NavLink>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 shadow-sm">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              FlowDesk
            </span>
          </div>
        </div>
        
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <NavItem item={item} />
              </li>
            ))}
          </ul>
          
          {/* User info and logout */}
          <div className="mt-auto border-t border-gray-200 pt-4 pb-4">
            {user && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.emailAddress}</p>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center space-x-2"
            >
              <ApperIcon name="LogOut" className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative flex w-full max-w-xs flex-1 flex-col bg-white shadow-xl"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={onClose}
                >
                  <ApperIcon name="X" className="h-6 w-6 text-white" />
                </button>
              </div>
              
              <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Zap" className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                      FlowDesk
                    </span>
                  </div>
                </div>
                
                <nav className="flex flex-1 flex-col">
                  <ul className="flex flex-1 flex-col gap-y-2">
                    {navigationItems.map((item) => (
                      <li key={item.name}>
                        <NavItem item={item} />
                      </li>
                    ))}
                  </ul>
                  
                  {/* User info and logout for mobile */}
                  <div className="mt-auto border-t border-gray-200 pt-4">
                    {user && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.emailAddress}</p>
                      </div>
                    )}
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <ApperIcon name="LogOut" className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </nav>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;