/*
 * 多文件协作
 * reducer 的拆分和合并
 */

//counterReducer, 一个子reducer
//注意：counterReducer 接收的 state 是 state.counter

function counterReducer(state, action) {
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

//InfoReducer，一个子reduce
//注意：InfoReducer 接收的 state 是 state.info

function InfoReducer(state, action) {
    switch (action.type) {
        case "SET_NAME":
            return {
                ...state,
                name: action.name
            };
        case "SET_DESCRIPTION":
            return {
                ...state,
                description: action.description
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

function combineReducers(reducers) {
    /* reducerKeys = ['counter', 'info']*/
    const reducerKeys = Object.keys(reducers);

    /*返回合并后的新的reducer函数*/
    return function combination(state = {}, action) {
        /*生成的新的state*/
        const nextState = {};

        /* 遍历执行所有的reducers，整合成为一个新的state  log(n)*/
        for (let i = 0; i < reducerKeys.length; i++) {
            const key = reducerKeys[i];
            const reducer = reducers[key];
            /*之前的 key 的 state*/
            const previousSateForKey = state[key];
            /*执行 分 reducer，获得新的state*/
            const nextStateForKey = reducer(previousSateForKey, action);
            nextState[key] = nextStateForKey;
        }
        return nextState;
    };
}
const reducer = combineReducers({
    counter: counterReducer,
    info: InfoReducer
});
let initState = {
    counter: {
        count: 0
    },
    info: {
        name: "前端九部",
        description: "我们都是前端爱好者"
    }
};
let store = createStore(reducer, initState);
store.subscribe(() => {
    let state = store.getState();
    console.log(state.counter.count, state.info.name, state.info.description);
});

//自增
store.dispatch({
    type: "INCREMENT"
});
//自增
store.dispatch({
    type: "DECREMENT"
});
/*修改 name*/
store.dispatch({
    type: "SET_NAME",
    name: "前端九部2好"
});
