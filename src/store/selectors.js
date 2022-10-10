import { createSelector } from "reselect";
import { get, groupBy, reject, maxBy, minBy } from 'lodash';
import { ethers } from 'ethers';
import moment from "moment";

const GREEN = '#25CE8F'
const RED = '#F45353'
const tokens = state => get(state, 'tokens.contracts')
const allOrders = state => get(state, 'exchange.allOrders.data', [])
const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', [])
const filledOrders = state => get(state, 'exchange.filledOrders.data', [])

const openOrders = state => {
    const all = allOrders(state)
    const filled = filledOrders(state)
    const cancelled = cancelledOrders(state)

    const openOrders = reject(all, (order) => {
        const orderFilled = filled.some((o) => o.id.toString() === order.id.toString())
        const orderCancelled = cancelled.some((o) => o.id.toString() === order.id.toString())
        return(orderFilled || orderCancelled)
    })
    return openOrders
}

const decorateOrder = (order, tokens) => {
    let token0Amount, token1Amount

    if(order.tokenGive  === tokens[1].address) {
        token0Amount = order.amountGive
        token1Amount = order.amountGet
    } else {
        token0Amount = order.amountGet
        token1Amount = order.amountGive
    }

    let precicion = 100000
    let tokenPrice = (token1Amount / token0Amount)
    tokenPrice = Math.round(tokenPrice * precicion) /precicion

    return ({
        ...order,
        token0Amount: ethers.utils.formatUnits(token0Amount, 'ether'),
        token1Amount: ethers.utils.formatUnits(token1Amount, 'ether'),
        tokenPrice,
        FormattedTimestamp: moment.unix(order.timestamp).format('h:mm:ssa d MMM D')
    })
}

const decorateOrderBookOrder = (order, tokens) => {
    const orderType= order.tokenGive === tokens[1].address ? 'buy' : 'sell'
    return({
        ...order,
        orderType,
        orderTypeClass: (orderType ==='buy' ? GREEN : RED),
        orderFillAction: (orderType ==='buy' ? 'sell' : 'buy')
    })
}

const decorateOrdersBookOrder = (orders, tokens) => {
    return(
        orders.map((order) => {
            order = decorateOrder(order, tokens)
            order = decorateOrderBookOrder(order, tokens)
            return(order)
        })
    )
}


export const orderBookSelector = createSelector(openOrders, tokens, (orders, tokens) => {
    if(!tokens[0] || !tokens[1]) {return}
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)
    
    orders = decorateOrdersBookOrder(orders, tokens)
    orders = groupBy(orders, 'orderType')

    const buyOrders = get(orders, 'buy', [])
    const sellOrders = get(orders, 'sell', [])

    orders = {
        buyOrders: buyOrders.sort((a,b) => a.tokenPrice - b.tokenPrice),
        sellOrders: sellOrders.sort((a,b) => b.tokenPrice - a.tokenPrice)
    }

    return orders

})

//----------- Chart Selector ---------------


export const priceChartSelector = createSelector(filledOrders, tokens, (orders, tokens) => {
    if(!tokens[0] || !tokens[1]) {return}
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

    orders = orders.sort((a, b) => a.timestamp - b.timestamp)

    orders = orders.map((o) => decorateOrder(o, tokens))

    let secondLastOrder, lastOrder
    [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)

    const lastPrice = get(lastOrder, 'tokenPrice', 0)

    const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)

    return({
        lastPrice,
        lastPriceChange: (lastPrice >= secondLastPrice ? '+' : '-'),
        series: [{
            data: buildGraphData(orders)
        }]
    })
})

const buildGraphData = (orders) => {
    orders = groupBy(orders, (o) => moment.unix(o.timestamp).startOf('hour').format())
    const hours = Object.keys(orders)

    const graphData = hours.map((hour) => {
        const group = orders[hour]
        const open = group[0]
        const high = maxBy(group, 'tokenPrice')
        const low = minBy(group, 'tokenPrice')
        const close = group[group.length - 1]

        return({
            x: new Date(hour),
            y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
        })
    })

    return graphData
}

// --------- Filled Orders Selector ------------------

export const filledOrdersSelector = createSelector(filledOrders, tokens, (orders, tokens) => {
    if(!tokens[0] || !tokens[1]) {return}
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

    orders = orders.sort((a, b) => a.timestamp - b.timestamp)
    
    orders = decorateFilledOrders(orders, tokens)

    orders = orders.sort((a, b) => b.timestamp - a.timestamp)

    console.log(orders)

    return orders
})

const decorateFilledOrders = (orders, tokens) => {
    let previousOrder = orders[0]

    return(
        orders.map((order) =>{
            order = decorateOrder(order, tokens)
            order = decorateFilledOrder(order, previousOrder)
            previousOrder = order
            return order
        })
    )
}

const decorateFilledOrder = (order, previousOrder) => {
    let tokenPriceClass
    if(previousOrder.tokenPrice <= order.tokenPrice || order.id === previousOrder.id){
        tokenPriceClass = GREEN
    }else{
        tokenPriceClass = RED
    }
    return({
        ...order,
        tokenPriceClass
    })
}