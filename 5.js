/**
 *
 * 我们给 plan 和 changeState 改下名字好不好？
 * plan 改成 reducer，changeState 改成 dispatch！
 * 不管你同不同意，我都要换，因为新名字比较厉害（其实因为 redux 是这么叫的）!
 *
 */

/**
 * reducer 是一个计划函数，接收老的 state，按计划返回新的 state
 *
 * @param {*} state
 * @param {*} action
 * @returns
 */
function reducer(state, action) {
    switch (action.type) {
        case "INCREMENT":
            return {
                ...state,
                count: state.count + 1
            };
        case "DECREMENT":
            return {
                ...state,
                count: state.count - 1
            };
        default:
            return state;
    }
}
const createStore = function(reducer, initState) {
    let state = initState;
    let listeners = [];

    //订阅
    function subscribe(listener) {
        listeners.push(listener);
    }

    function dispatch(action) {
        //请按照我的计划修改 state
        state = reducer(state, action);
        //通知
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }
    }

    function getState() {
        return state;
    }

    return {
        subscribe,
        dispatch,
        getState
    };
};

let initState = {
    count: 0
};
let store = createStore(reducer, initState);
store.subscribe(() => {
    let state = store.getState();
    console.log(state.count);
});
//自增
store.dispatch({ type: "INCREMENT" });
//自减
store.dispatch({ type: "DECREMENT" });
//我想随便改 计划外的修改是无效的
store.dispatch({
    count: "abc"
});
