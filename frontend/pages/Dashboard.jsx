import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Usersidebar } from "../components/Usersidebar"; // Assure-toi que le chemin est correct
import '../src/styleCss/dashboard.css'

export function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <div className="page-container">
      <Navbar onImageClick={toggleSidebar} />
      {showSidebar && <Usersidebar/>}



      <div className="container">
      



      </div>
      
    </div>
  );
}
