import React from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  title, 
  onMenuClick, 
  searchValue, 
  onSearchChange, 
  showSearch = false,
  actions = [] 
}) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" className="h-5 w-5" />
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {showSearch && (
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search contacts..."
                className="w-64 hidden sm:block"
              />
            )}
            
            <div className="flex items-center space-x-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "primary"}
                  size="sm"
                  onClick={action.onClick}
                  className="flex items-center space-x-2"
                >
                  {action.icon && <ApperIcon name={action.icon} className="h-4 w-4" />}
                  <span className="hidden sm:inline">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;