import { useEffect } from 'react';
import config from '../config.json';
import { useSelector, useDispatch } from 'react-redux';

import { 
  claimTokens,
  loadAccountTokens
} from '../store/interactions.js'


const Tokens = () => {
    const dispatch = useDispatch()
    const provider = useSelector(state => state.provider.connection)
    const account = useSelector(state => state.provider.account)
    const chainId = useSelector(state => state.provider.chainId)
    const transferInProgress = useSelector(state => state.exchange.transferInProgress)
    const claimInProgress = useSelector(state => state.tokens.claimInProgress)
    const tokens = useSelector(state => state.tokens.tokens)

    const loadAccountData = async () => {
        await loadAccountTokens(provider, account, [config[chainId].TKN.address, config[chainId].mETH.address, config[chainId].mDAI.address], dispatch)
    }

    const handlerClaimToken = async (token) => {
        claimTokens(provider, token, dispatch)
    }

    useEffect(() => {
        if(provider && chainId && account){
            loadAccountData()
        }
    }, [chainId, account, claimInProgress, transferInProgress])  
    
    return (
        <div className='landing'>
            <h1>Claim Free Tokens</h1>
            <p>You can claim 100 of each token per account and use this tokens on the exchange.</p>
            {!account ? (
                <div className='wallet__required'>
                    <h2>Connect Wallet</h2>
                    <p>Wallet must be connected to be able to claim tokens</p>
                </div>
            ): (
                tokens.map((token, index) => {
                    return(
                        <div className='token' key={index}>
                            <div key={index} className='token__header'>
                                <h3>{token.symbol}</h3>
                                <p>Balance: {Number(token.balance).toFixed(1)}</p>
                            </div>
                            <button 
                                className={token.allowClaim ? 'button_active' : 'button_deactive'}
                                onClick={() => handlerClaimToken(token.contract)}
                            >
                                {token.allowClaim ? 'Claim tokens' : 'Already claimed'}
                            </button>
                        </div> 
                    )
                })
            )}
            <p className='disclaimer'>This tokes have no real value and are not related to any real token. They are only for testing purpose and must be used only on this website.</p>
        </div>
    );
}

export default Tokens;