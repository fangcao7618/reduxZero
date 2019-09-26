const createStore = function(initState) {
    let state = initState;
    let listeners = [];

    //订阅
    function subscribe(listener) {
        listeners.push(listener);
    }

    function changeState(newState) {
        state = newState;
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
        changeState,
        getState
    };
};

let initState = {
    count: 0
};
let store = createStore(initState);
store.subscribe(() => {
    let state = store.getState();
    console.log(state.count);
});
//自增
store.changeState({
    count: store.getState().count + 1
});
//自减
store.changeState({
    count: store.getState().count - 1
});
//我想随便改
store.changeState({
    count: "abc"
});
