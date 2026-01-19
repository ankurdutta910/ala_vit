import React, {useState, useEffect} from 'react'
import logo from "../assets/image/logotop.png";
import { Link } from "react-router-dom";
import "../../App.css";

function Header() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() =>setDate(new Date()), 1000)
  
    return function cleanup() {
      clearInterval(timer)
    }
  })


  return (
    <>

      <nav
        class="navbar navbar-expand-lg navbar-dark fixed-top"
        style={{ backgroundColor: "black", minHeight: "90px" }}
      >
        <div className="container-fluid" style={{ maxWidth: "210vh" }}>
          <Link className="navbar-brand" to="/">
            <img id="logoimg" src={logo} alt="" />
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto">
            <li class="nav-item">
            <p style={{textAlign:'right',color: 'white',marginTop:'9px'}}>{date.toLocaleDateString()} | {date.toLocaleTimeString()}</p>
        </li>
            </ul>
          </div>
        </div>
      </nav>

  
      
    </>
  )
}

export default Header
