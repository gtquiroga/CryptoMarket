import { useSelector, useDispatch } from 'react-redux';
import eth from '../assets/eth.svg';

import config from '../config.json';


const ExhangeNavbar = () => {
    const balance = useSelector(state => state.provider.balance)
    const chainId = useSelector(state => state.provider.chainId)

    const networkHandler = async (e) => {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: e.target.value }]
        })
    }

    return(
      <div className='exchange__header grid'>
        <div className='exchange__header--brand flex'>
            {/* <img src={logo} className='logo' alt='TKN'></img> */}
            <h1>Token Exchange</h1>
        </div>
  
        <div className='exchange__header--networks flex'>
            <img src={eth} className='Eth Logo' alt='ETH Logo'></img>
            {chainId && (
                <select name='networks' id='networks' value={config[chainId] ? `0x${chainId.toString(16)}` : '0'} onChange={networkHandler}>
                    <option value='0' disabled>Select Network</option>
                    <option value='0x7A69' >Localhost</option>
                    <option value='0x5' >Goerli</option>
                </select>
            )}
            
        </div>
  
        <div className='exchange__header--account flex'>
            <p><small>My Balance</small>{balance ? Number(balance).toFixed(4) : 0} ETH</p>
        </div>
      </div>
    )
  }
  
  export default ExhangeNavbar;