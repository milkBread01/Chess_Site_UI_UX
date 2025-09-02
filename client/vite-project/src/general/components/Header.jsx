import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header" role="banner">
        <div className="header-inner">
            <button
                className="hamburger"
                aria-label="Toggle navigation"
                aria-expanded={open}
                onClick={() => setOpen(v => !v)}
            >
                <span></span><span></span><span></span>
            </button>

            <a href="/" className="brand" aria-label="Home">
                <img src="/logo.jpg" alt="Site logo" />
            </a>

            <nav className={`nav ${open ? "open" : ""}`} role="navigation">
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/learn">Learn</a>
                <a href="/play">Play</a>
            </nav>

            {/* Dropdown menu for login/registration or pf data */}
            <div className = "profile-menu">
                <button className = "profile-btn" aria-label = "Account">
                    <i className = "fa fa-user-circle" aria-hidden = "true"></i>
                </button>

                <div className="dropdown">
                    <a href="/register">Register</a>
                    <a href="/login">Login</a>
                    <a href="/account">Account Info</a>
                </div>
            </div>

            
        </div>
    </header>
  );
}
