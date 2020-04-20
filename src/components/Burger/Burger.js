import React from 'react';
import classes from './Burger.css'
import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";

const Burger = props => {
    let transformedIngredients = Object.keys(props.ingredients)
        .map(ingredientKey => {
            return [...Array(props.ingredients[ingredientKey])]
                .map((_, index) => {
                    return <BurgerIngredient type={ingredientKey} key={ingredientKey + index}/>
                })
        })
        .reduce((arr, element) => {
                return arr.concat(element);
            },
            []
        );

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

Burger.propTypes = {};

export default Burger;