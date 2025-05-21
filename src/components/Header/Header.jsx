import './header.css';
import logo from './../../images/header/Logo.png';
import fish from './../../images/header/fish.png';
import play from './../../images/header/play.png';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import gsap from 'gsap';

function Header() {
    useEffect(() => {
        gsap.to(".letter", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.2
        });
    }, []);

    return (
        <header className='header'>
            <div className="container">
                <div className="header__row">
                    <div className="header__logo">
                        <Link to="/"><img src={logo} alt="Logo" /></Link> 
                    </div>
                    <nav className="header__nav"> 
                        <ul>
                            <li><Link to="">Інструкція</Link></li>
                            <li><Link to="">Рибки</Link></li>
                            <li><Link to="/signup" className='header__nav-btv'>Sign Up</Link></li>
                            <li><Link to="/login" className='header__nav-btv'>Log In</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="animated-text-container">
                    <img src={fish} alt="Fish" className="fish" />
                    <div className="circle-red"></div>
                    <div className="circle-blue"></div>
                    <div className="text">
                        <span className="letter">F</span>
                        <span className="letter">I</span>
                        <span className="letter">S</span>
                        <span className="letter">H</span>
                        
                    </div>
                    <div className="link"></div>
                </div>
                <div className="glow-button">
                    <Link to="/fishing-game" className="glow-button3"> 
                        <img src={play} alt="" className='glow-button-img' />Play
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;