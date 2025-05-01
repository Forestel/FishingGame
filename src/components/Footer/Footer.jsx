import React from 'react';
import telegram from './../../images/social/telegram.png';
import instagram from './../../images/social/instagram.png';
import github from './../../images/social/github.png';
import email from './../../images/social/email.png';
import logo from './../../images/header/Logo.png';
import ApplePay from './../../images/footer/ApplePay.png';
import GooglePay from './../../images/footer/GooglePay.png';
import MasterCard from './../../images/footer/Mastercard.png';
import Visa from './../../images/footer/Visa.png';
import PayPal from './../../images/footer/Paypal.png';
import Bitcoin from './../../images/footer/Bitcoin.png';
import Etherium from './../../images/footer/Etherium.png';
import Mono from './../../images/footer/Mono.png';
import Privat from './../../images/footer/privat.png';



import './Footer.css';
const Footer = () => {
    return ( <footer className="Footer">
        <div className="container">
        <div className="footer__information">
            <div className="social">
                
            <img src={logo} alt="" srcset="" />

            <div className="social_icons">
                <a href="https://t.me/roma_kovalskiy">
                <img src={telegram} alt="" srcset="" />
                </a>
                <a href="https://www.instagram.com/roma._.kovalskiy/">
                <img src={instagram} alt="" srcset="" />
                </a>
                <a href="https://github.com/Forestel">
                <img src={github} alt="" srcset="" />
                </a>
                <a href="https://github.com/Forestel">
                <img src={email} alt="" srcset="" />
                </a>
            </div>
            </div>

            <div className="text__information">

                <div className="hotline_text">
                    <p className='hotline_h1'>Hotline</p>
                    <p className='hotline_number'>+38(098) 414-68-24</p>
                    <p className='hotline_number'>+38(097) 011-39-24</p>
                </div>

                <div className="Email_text">
                <p className='Email_h1'>Email</p>
                    <p className='Email_name'>roma.kovalskiy2005@gmail.com</p>
                    
                </div>

            </div>
            <div className="text__information">

                <div className="hotline_text">
                    <p className='hotline_h1'>Our creator</p>
                    <p className='hotline_number'>Roman Kovalskiy</p>
                    
                </div>

                <div className="Email_text">
                <p className='Email_h1'>GitHub</p>
                    <p className='Email_name'>Forestel</p>
                    
                </div>

            </div>
            <div className="form">
        <div className="chat-box">
            <p>Have questions?</p>
            <div className="input-container">
                <input type="text" placeholder="Can I have...?" />
                <button className="send-button">Send</button>
            </div>
        </div>
        </div>
        </div>
        <div className="pay">
            <p>© 2025 Alternativa Game Ltd. All rights reserved. Published by APL Publishing Ltd.</p>
            <div className="pay__servises">
           <a href="https://www.apple.com/apple-pay/"> <img src={ApplePay} alt="Apple Pay" /></a>
            <a href="https://pay.google.com/"> <img src={GooglePay} alt="Google Pay" /></a>
            <a href="https://www.paypal.com/"> <img src={PayPal} alt="PayPal" /></a>
            <a href="https://www.mastercard.com/"> <img src={MasterCard} alt="MasterCard" /></a>
            <a href="https://www.visa.com/"> <img src={Visa} alt="Visa" /></a>
          
            <a href="https://bitcoin.org/"> <img src={Bitcoin} alt="Bitcoin" /></a>
            <a href="https://ethereum.org/"> <img src={Etherium} alt="Ethereum" /></a>
            <a href="https://monobank.ua/"> <img src={Mono} alt="Monobank" /></a>
           <a href="https://next.privat24.ua/money-transfer/card"> <img src={Privat} alt="" srcset="" /></a>

            </div>
        </div>
        
       
       
    </div>
</footer> );
}
 
export default Footer;
