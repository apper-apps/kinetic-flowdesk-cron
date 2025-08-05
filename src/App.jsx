import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import Contacts from "@/components/pages/Contacts";
import Deals from "@/components/pages/Deals";
import Activities from "@/components/pages/Activities";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
          <Routes>
            <Route 
              path="/" 
              element={<Dashboard onMenuClick={handleMenuClick} />} 
            />
            <Route 
              path="/contacts" 
              element={<Contacts onMenuClick={handleMenuClick} />} 
            />
            <Route 
              path="/deals" 
              element={<Deals onMenuClick={handleMenuClick} />} 
            />
            <Route 
              path="/activities" 
              element={<Activities onMenuClick={handleMenuClick} />} 
            />
          </Routes>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            background: "linear-gradient(135deg, #6B46C1 0%, #9333EA 100%)",
            color: "white"
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;