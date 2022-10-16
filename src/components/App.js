import { useEffect } from 'react';
import config from '../config.json';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, Link, NavLink } from 'react-router-dom';
import Exchange from '../routs/Exchange';

import { 
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange,
  subscribeToEvents,
  loadAllOrders
} from '../store/interactions.js'


import Navbar from './Navbar';
import Home from '../routs/Home';
import Tokens from '../routs/Tokens';




function App() {
  const dispatch = useDispatch()

  const laodBlockchainData = async () => {
    
    const provider = loadProvider(dispatch)
    const chainId = await loadNetwork(provider, dispatch)

    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    await loadAccount(provider, dispatch)

    window.ethereum.on('accountsChanged', () => {
      loadAccount(provider, dispatch)
    })
    
    
    await loadTokens(provider, [config[chainId].TKN.address, config[chainId].mETH.address], dispatch)

    const exchange = await loadExchange(provider, config[chainId].exchange.address, dispatch)

    loadAllOrders(provider, exchange, dispatch)

    subscribeToEvents(exchange, dispatch)
  }

  useEffect(() => {
    laodBlockchainData()
  })  
  
  return (
    <div>

      <Navbar/>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/exchange" element={<Exchange/>}/>
          <Route exact path="/tokens" element={<Tokens/>}/>
        </Routes>
    </div>
  );
}

export default App;