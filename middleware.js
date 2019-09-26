/**
 * 中间件 middleware
 * 中间件 middleware 是 redux 中最难理解的地方。但是我挑战一下用最通俗的语言来讲明白它。
 * 中间件是对 dispatch 的扩展，或者说重写，增强 dispatch 的功能！
 */
const createStore = function(reducer, initState) {
    let state = initState;
    let listeners = [];

    function subscribe(listener) {
        listeners.push(listener);
    }

    function dispatch(action) {
        state = reducer(state, action);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }
    }

    function getState() {
        return state;
    }

    /* 注意！！！只修改了这里，用一个不匹配任何计划的 type，来获取初始值 */
    dispatch({
        type: Symbol()
    });

    return {
        subscribe,
        dispatch,
        getState
    };
};
function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers);
    return function combination(state = {}, action) {
        const nextState = {};

        for (let i = 0; i < reducerKeys.length; i++) {
            const key = reducerKeys[i];
            const reducer = reducers[key];
            const previousSateForKey = state[key];
            const nextStateForKey = reducer(previousSateForKey, action);
            nextState[key] = nextStateForKey;
        }
        return nextState;
    };
}

/**
 * 调用
 */
let initState = {
    count: 0
};
function counterReducer(state, action) {
    /*注意：如果 state 没有初始值，那就给他初始值！！*/
    if (!state) {
        state = initState;
    }
    switch (action.type) {
        case "INCREMENT":
            return {
                count: state.count + 1
            };
        default:
            return state;
    }
}

const reducer = combineReducers({
    counter: counterReducer
});
const store = createStore(reducer);
/**
 * 记录日志
 * 我现在有一个需求，在每次修改 state 的时候，记录下来 修改前的 state ，为什么修改了，以及修改后的 state。我们可以通过重写 store.dispatch 来实现，
 * 直接看代码
 */
const next = store.dispatch;
/*重写了store.dispatch*/
store.dispatch = action => {
    console.log("this state", store.getState());
    console.log("action", action);
    next(action);
    console.log("next state", store.getState());
};
store.dispatch({
    type: "INCREMENT"
});
/**
 * 记录异常
 * 需要记录每次数据出错的原因，我们扩展下 dispatch
 */
store.dispatch = action => {
    try {
        next(action);
    } catch (err) {
        console.error("错误报告=====：", err);
    }
};
store.dispatch({
    type: "INCREMENT"
});
