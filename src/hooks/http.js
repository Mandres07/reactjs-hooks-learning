import { useReducer, useCallback } from 'react';

const initialState = { isLoading: false, error: null, data: null, extra: null, identifier: null };

const httpReducer = (state, action) => {
   switch (action.type) {
      case 'SEND':
         return { isLoading: true, error: null, data: null, extra: null, identifier: action.identifier };
      case 'RESPONSE':
         return { ...state, isLoading: false, data: action.data, extra: action.extra };
      case 'ERROR':
         return { isLoading: false, error: action.error };
      case 'CLEAR':
         return initialState;
      default:
         return state;
   }
};

const useHttp = () => {
   const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

   const sendRequest = useCallback(async (url, method, body, extra, identifier) => {
      try {
         dispatchHttp({ type: 'SEND', identifier: identifier });
         const response = await fetch(url, {
            method: method, body: body, headers: {
               'Content-Type': 'application/json'
            }
         });
         const data = await response.json();
         dispatchHttp({ type: 'RESPONSE', data: data, extra: extra });
      }
      catch (err) {
         dispatchHttp({ type: 'ERROR', error: err.message });
      }
   }, []);

   const clear = useCallback(() => {
      dispatchHttp({ type: 'CLEAR' });
   }, []);

   return {
      isLoading: httpState.isLoading,
      error: httpState.error,
      data: httpState.data,
      sendRequest: sendRequest,
      extra: httpState.extra,
      identifier: httpState.identifier,
      clear: clear
   };

};

export default useHttp;