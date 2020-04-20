import React, {Component} from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Aux from "../../hoc/Aux/Aux";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";


const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7,
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false,
    }

    componentDidMount() {
        console.log(this.props);

        axios.get('https://react-my-burger-e561a.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error: true});
            })
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        const queryParams = [];
        for (const i in this.state.ingredients) {
            queryParams.push(encodeURI(i) + '=' + encodeURI(this.state.ingredients[i]));
        }
        queryParams.push('price='+this.state.totalPrice);

        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });

        //     this.setState({loading: true});
        //
        //     const order = {
        //         ingredients: this.state.ingredients,
        //         price: this.state.totalPrice,
        //         customer: {
        //             name: 'Siva',
        //             street: 'Street 1',
        //             zipCode: '234323',
        //             country: 'Germany',
        //         },
        //         email: 'test@test.com',
        //         deliveryMethod: 'fastest'
        //     };
        //
        //     axios.post('/orders.json', order)
        //         .then(response => {
        //             this.setState({loading: false, purchasing: false});
        //             console.log(response);
        //         }).catch(response => {
        //         this.setState({loading: false, purchasing: false});
        //         console.log(response);
        //     });
    }

    updatePurchaseState(ingredients) {
        const sum = Object.values(ingredients)
            .reduce((sum, count) => sum + count, 0);
        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = this.state.ingredients[type] + 1;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: this.state.totalPrice + INGREDIENT_PRICES[type],
        });
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const updatedIngredients = {...this.state.ingredients};
        if (this.state.ingredients[type] < 1) {
            return;
        }

        updatedIngredients[type] = this.state.ingredients[type] - 1;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: this.state.totalPrice - INGREDIENT_PRICES[type],
        });
        this.updatePurchaseState(updatedIngredients);
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (const key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] < 1
        }

        let orderSummary = null;

        if (this.state.ingredients) {
            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
            />;
        }

        if (this.state.loading) {
            orderSummary = <Spinner/>;
        }

        let burger = this.state.error ? <p>Ingredients can't be loaded </p> : <Spinner/>;

        if (this.state.ingredients) {

            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice}
                    />;
                </Aux>
            )
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}


export default withErrorHandler(BurgerBuilder, axios);