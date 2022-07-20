// https://github.com/streamich/react-use
import { useState, useEffect, useCallback, useRef } from "react";

function useMountedState() {
  const mountedRef = useRef(false);
  const get = useCallback(() => mountedRef.current, []);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return get;
}

function useAsyncFn(fn, deps = [], initialState = { loading: false }) {
  const lastCallId = useRef(0);
  const isMounted = useMountedState();
  const [state, set] = useState(initialState);
  const callback = useCallback((...args) => {
    const callId = ++lastCallId.current;
    if (!state.loading) {
      set((prevState) =>
        Object.assign(Object.assign({}, prevState), { loading: true })
      );
    }
    return fn(...args).then(
      (value) => {
        isMounted() &&
          callId === lastCallId.current &&
          set({ value, loading: false });
        return value;
      },
      (error) => {
        isMounted() &&
          callId === lastCallId.current &&
          set({ error, loading: false });
        return error;
      }
    );
  }, deps);
  return [state, callback];
}

function useAsync(fn, deps = []) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });
  useEffect(() => {
    callback();
  }, [callback]);
  return state;
}

export default useAsync;
