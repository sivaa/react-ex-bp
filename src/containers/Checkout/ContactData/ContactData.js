import React, {Component} from 'react';
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.css";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";

class ContactData extends Component {
    state = {
        formIsValid: false,
        loading: false,
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig:
                    {
                        type: "text",
                        placeholder: "Your Name",
                    },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                }
            },
            street: {
                elementType: 'input',
                elementConfig:
                    {
                        type: "text",
                        placeholder: "Street",
                    },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                }

            },
            zipCode: {
                elementType: 'input',
                elementConfig:
                    {
                        type: "text",
                        placeholder: "Postal Code",
                    },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                }

            },
            country: {
                elementType: 'input',
                elementConfig:
                    {
                        type: "text",
                        placeholder: "Country",
                    },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                }

            },
            email: {
                elementType: 'input',
                elementConfig:
                    {
                        type: "email",
                        placeholder: "Your Email",
                    },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                }
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig:
                    {
                        options: [
                            {value: 'fastest', displayValue: 'Fastest'},
                            {value: 'cheapest', displayValue: 'Cheapest'},
                        ]
                    },
                value: '',
                valid: true,
                validation: {}
            },
        },
    }

    orderHandler = (event) => {
        event.preventDefault();

        const formData = {};

        for (const formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        this.setState({loading: true});

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData,
        };

        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false});
                console.log(response);
                this.props.history.push('/');
            }).catch(response => {
            this.setState({loading: false});
            console.log(response);
        });
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {...this.state.orderForm}
        const updatedOrderFormElement = {...updatedOrderForm[inputIdentifier]};

        updatedOrderFormElement.value = event.target.value;

        updatedOrderFormElement.valid = this.checkValidity(updatedOrderFormElement.value, updatedOrderFormElement.validation);
        updatedOrderFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedOrderFormElement;

        let formIsValid = true;
        for (const inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    }

    checkValidity(value, rules) {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.trim().length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.trim().length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    render() {
        console.log(this.state.formIsValid);
        const formElements = [];

        for (const key in this.state.orderForm) {
            formElements.push({
                id: key,
                config: this.state.orderForm[key],
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {
                    formElements.map(element => {
                        return (<Input
                            key={element.id}
                            elementType={element.config.elementType}
                            elementConfig={element.config.elementConfig}
                            value={element.config.value}
                            invalid={!element.config.valid}
                            shouldValidte={element.config.validation}
                            touched={element.config.touched}
                            changed={(event) => this.inputChangedHandler(event, element.id)}
                        />)
                    })
                }
                <Button buttonType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );

        if (this.state.loading) {
            form = <Spinner/>;
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;