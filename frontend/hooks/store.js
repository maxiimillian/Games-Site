import { useSyncExternalStore, useCallback } from "react";

const createStore = (initialState) => {
    let state = initialState;
    const getState = () => state;
    const listeners = new Set();
    const setState = (fn) => {
        state = fn(state);
        listeners.forEach((listener) => listener());
    };
    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };
    return { getState, setState, subscribe };
}

const useStore = (store, selector) => {
    return useSyncExternalStore(
        store.subscribe,
        useCallback(() => selector(
            store.getState(), 
            [store, selector]
        ))
    )
}