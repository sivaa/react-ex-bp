import React from 'react';
import classes from './Input.css';

const Input = (props) => {
    let inputElement;

    let inputClasses = [classes.InputElement];
    if(props.invalid && props.shouldValidte && props.touched) {
        inputClasses.push(classes.Invalid)
    }

    switch (props.elementType) {
        case('input') :
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                onChange={props.changed}
                value={props.value}/>
            break;
        case('select') :
            inputElement = <select
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}>
                {props.elementConfig.options.map(option =>
                    <option value={option.value} key={option.value}>{option.displayValue}</option>
                )}
            </select>;
            break;
        default:
            throw new Error('unknown element');
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>
    );
};

export default Input;