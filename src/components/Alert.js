import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import { myEventsSelector } from "../store/selectors";
import config from '../config.json'


const Alert = () => {
    const isPending = useSelector(state => state.exchange.transaction.isPending)
    const isError = useSelector(state => state.exchange.transaction.isError)
    const account = useSelector(state => state.provider.account)
    const network = useSelector(state => state.provider.network)
    const events = useSelector(myEventsSelector)

    const alertRef = useRef(null)

    useEffect(() => {
        if((events[0] || isPending || isError) && account){
            alertRef.current.className = 'alert'
        }
    }, [isPending, isError, account, events])

    const removeHandler = async (e) => {
        alertRef.current.className = 'alert--remove'
    }
    return (
        <div>
            {isPending ? (
                <div className="alert alert--remove" ref={alertRef} onClick={removeHandler}>
                    <h1>Transaction Pending...</h1>
                </div>
            ) : isError ? (
                <div className="alert alert--remove" ref={alertRef} onClick={removeHandler}>
                    <h1>Transaction Will Fail</h1>
                </div>
            ) : !isPending && events[0] ? (
                <div className="alert alert--remove" ref={alertRef} onClick={removeHandler}>
                    <h1>Transaction Successful</h1>
                    <a
                        href={config[network] ? `${config[network].exporerURL}/tx/${events[0].transactionHash}` : '#'}
                        target='_blank'
                        rel='noreferrer'
                    >
                        {events[0].transactionHash.slice(0, 6) + '...' + events[0].transactionHash.slice(60, 66)}
                    </a>
                </div>
            ) : (
                <div className="alert alert--remove" ref={alertRef} onClick={removeHandler}></div>
            )}
           
           
            <div className="alert alert--remove"></div>
        </div>
    );
  }
  
  export default Alert;