import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientsReducer = (state, action) => {
   switch (action.type) {
      case 'SET':
         return action.ingredients;
      case 'ADD':
         return [...state, action.ingredient];
      case 'DELETE':
         return state.filter(ing => ing.id !== action.id);
      default:
         return state;
   }
};

function Ingredients() {
   const [ingredients, dispatch] = useReducer(ingredientsReducer, []);

   const { isLoading, error, data, sendRequest, extra, identifier, clear } = useHttp();

   useEffect(() => {
      if (!isLoading && identifier === 'REMOVE_INGREDIENT') {
         dispatch({ type: 'DELETE', id: extra })
      } else if (!isLoading && !error && identifier === 'ADD_INGREDIENT') {
         dispatch({ type: 'ADD', ingredient: { id: data.name, ...extra } });
      }
   }, [data, extra, identifier, isLoading, error]);

   const addIngredient = useCallback(async ingredient => {
      sendRequest('https://reacthooks-learning-989b9-default-rtdb.firebaseio.com/ingredients.json', 'POST', JSON.stringify(ingredient), ingredient, 'ADD_INGREDIENT');
   }, [sendRequest]);

   const removeIngredient = useCallback(async id => {
      sendRequest(`https://reacthooks-learning-989b9-default-rtdb.firebaseio.com/ingredients/${id}.json`, 'DELETE', null, id, 'REMOVE_INGREDIENT');
   }, [sendRequest]);

   const filteredIngredientsHandler = useCallback(filteredIngredients => {
      dispatch({ type: 'SET', ingredients: filteredIngredients });
   }, []);

   const ingredientList = useMemo(() => {
      return (
         <IngredientList ingredients={ingredients} onRemoveItem={removeIngredient} />
      );
   }, [ingredients, removeIngredient]);

   return (
      <div className="App">
         {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
         <IngredientForm onAddIngredient={addIngredient} loading={isLoading} />

         <section>
            <Search onLoadIngredients={filteredIngredientsHandler} />
            {ingredientList}
         </section>
      </div>
   );
}

export default Ingredients;
