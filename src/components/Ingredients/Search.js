import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
   const [text, setText] = useState('');
   const { onLoadIngredients } = props;
   const inputRef = useRef();

   const { isLoading, data, error, sendRequest, clear } = useHttp();

   useEffect(() => {
      const timer = setTimeout(() => {
         if (text === inputRef.current.value) { // compara si el valor almacenado en el text useState es igual al del valor del useRef
            const searchIngredients = async () => {
               const query = text.length === 0 ? '' : `?orderBy="title"&equalTo="${text}"`;
               sendRequest('https://reacthooks-learning-989b9-default-rtdb.firebaseio.com/ingredients.json' + query, 'GET');
            };
            searchIngredients();
         }
      }, 500);

      return () => {
         clearTimeout(timer);
      };

   }, [text, inputRef, sendRequest]);

   useEffect(() => {
      if (!isLoading && !error && data) {
         const fetchedIngredients = [];
         for (const key in data) {
            fetchedIngredients.push({ id: key, title: data[key].title, amount: data[key].amount });
         }
         onLoadIngredients(fetchedIngredients);
      }
   }, [data, isLoading, error, onLoadIngredients])

   return (
      <section className="search">
         {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
         <Card>
            <div className="search-input">
               <label>Filter by Title</label>
               {isLoading && <span>Loading...</span>}
               <input ref={inputRef} type="text" value={text} onChange={e => setText(e.target.value)} />
            </div>
         </Card>
      </section>
   );
});

export default Search;
