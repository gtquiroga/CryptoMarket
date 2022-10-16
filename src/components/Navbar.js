import config from '../config.json';
import { useDispatch, useSelector } from 'react-redux';
import {  NavLink } from 'react-router-dom';
import Blockies from 'react-blockies';
import { loadAccount } from '../store/interactions.js'
import logo from '../assets/logo.png';
import { XMarkIcon,Bars3BottomLeftIcon, Bars3Icon } from '@heroicons/react/24/solid'
import { useRef } from 'react';


const Navbar = () => {
    const account = useSelector(state => state.provider.account)
    const chainId = useSelector(state => state.provider.chainId)
    const provider = useSelector(state => state.provider.connection)
    const menuRef = useRef(null)
    const coverRef = useRef(null)

    const dispatch = useDispatch()

    const connectHandler = async () => {
        await loadAccount(provider, dispatch)
    }

    const toggleMenu = () => {
        if(menuRef.current.className ===  'menu__hidde'){
            menuRef.current.className = 'menu'
            coverRef.current.className = 'menu__cover'
        }else{
            menuRef.current.className = 'menu__hidde'
            coverRef.current.className = 'menu__hidde'
        }
    }

  
  return (
    <div className='navbar'>
        <div className='menu__hidde' onClick={toggleMenu} ref={coverRef}></div>
        <div className='menu__hidde' ref={menuRef}>
            <div className='menu__top'>
                <XMarkIcon className='menu__x' onClick={toggleMenu}/>
            </div>
            <NavLink className='menu__option' to="/" onClick={toggleMenu}>Home</NavLink>
            <NavLink className='menu__option' to="/exchange" onClick={toggleMenu}>Exchange</NavLink>
            <NavLink className='menu__option' to="/tokens" onClick={toggleMenu}>Tokens</NavLink>
        </div>
        <Bars3Icon className='menu__button' onClick={toggleMenu}/>
        <div className='navbar__options'>
            <NavLink to="/" className='navbar__logo flex'>
                <img src={logo} className='logo' alt='TKN'></img>
                <h1>Crypto Market</h1>
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'navbar__link__active' : 'navbar__link')} to="/exchange">Exchange</NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'navbar__link__active' : 'navbar__link')} to="/tokens">Tokens</NavLink>
        </div>
        <div className='account flex'>
            {account ? (
                <a 
                    href={config[chainId] ? `${config[chainId].explorerURL}/address/${account}` : '#'}
                    target='_blank'
                    rel='noreferrer'
                >
                    {account.slice(0,5)+'...'+account.slice(-4)}
                    <Blockies
                        seed={account}
                        size={10}
                        scale={3}
                        color="#2187D0"
                        bgColor="#F1F2F9"
                        spotColor="#767F92"
                        className="identicon"
                    />
                </a>
            ) : (
                <button className='button' onClick={connectHandler}>Connect Wallet</button>
            )}
        </div>
    </div>

  );
}

export default Navbar;