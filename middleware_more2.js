/**
 * 中间件 middleware(多中间件合作模式)
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
 * 如果又来一个需求怎么办？接着改 dispatch 函数？那再来10个需求呢？到时候 dispatch 函数肯定庞大混乱到无法维护了！这个方式不可取呀！
 * 我们需要考虑如何实现扩展性很强的多中间件合作模式
 * 记录报错
 * 在打印日志之前输出当前的时间戳
 */
const next = store.dispatch;
// import loggerMiddleware from "./loggerMiddleware.js";
// import { exceptionMiddleware } from "./exceptionMiddleware.js";

const loggerMiddleware = store => next => action => {
    console.log("this state", store.getState());
    console.log("action", action);
    console.log("====loggerMiddleware====");
    next(action);
    console.log("next state", store.getState());
};
const exceptionMiddleware = store => next => action => {
    try {
        console.log("====exceptionMiddleware====");
        next(action);
    } catch (error) {
        console.error("错误报告: ", error);
    }
};
const timeMiddleware = store => next => action => {
    console.log("====timeMiddleware====");
    console.log("time", new Date().getTime());
    next(action);
};
const time = timeMiddleware(store);
const logger = loggerMiddleware(store);
const exception = exceptionMiddleware(store);
store.dispatch = exception(time(logger(next)));

store.dispatch({
    type: "INCREMENT"
});
