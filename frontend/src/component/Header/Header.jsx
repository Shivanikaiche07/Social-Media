import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import {
    Home,
    HomeOutlined,
    Add,
    AddOutlined,
    SearchOutlined,
    Search,
    AccountCircle,
    AccountCircleOutlined,
}from "@mui/icons-material";



const Header = () => {

  const [tab, setTab] = useState(window.location.pathname);
 
    return (
    
    <div className="header">
     <Link to ="/" onClick={()=>setTab("/")}>
        { tab==="/" ?<Home style={{color:"pink"}}/> : <HomeOutlined/> }
     </Link>

     <Link to="/newpost" onClick={()=>setTab("/newpost")}>
     { tab==="/newpost" ?<Add style={{color:"pink"}}/> : <AddOutlined/> }
     </Link>

     <Link to="/search" onClick={()=>setTab("/search")}>
     { tab==="/search" ?<Search style={{color:"pink"}}/> : <SearchOutlined/> }
     </Link>

     <Link to="/account" onClick={()=>setTab("/account")}>
     { tab==="/account" ?<AccountCircle style={{color:"pink"}}/> : <AccountCircleOutlined/> }
     </Link>
    </div>
    );
};


export default Header;