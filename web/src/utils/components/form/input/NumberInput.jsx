import * as React from "react";
import { FastField, ErrorMessage } from "formik";
import { InputNumber } from "antd";
import Label from "../Label";

/**
 * @callback setFieldValue
 * @param {string} name
 * @param {number} value
 */
/**
 * @callback onBlur
 * @returns {void}
 */
/**
 * @callback onChange
 * @param {number} value
 * @returns {void}
 */

/**
 * NumberInput.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.label
 * @param {string} props.placeholder
 * @param {boolean} props.padding
 * @param {boolean} props.autoFocus
 * @param {boolean} props.required
 * @param {boolean} props.disabled
 * @param {number} props.min
 * @param {number} props.max
 * @param {number} props.step
 * @param {onBlur} props.onBlur
 * @param {onChange} props.onChange
 */
export default function NumberInput({
    name,
    label = "",
    placeholder = "",
    padding = true,
    autoFocus = false,
    required = false,
    disabled = false,
    min = -Infinity,
    max = Infinity,
    step = 1,
    onBlur: _onBlur,
    onChange: _onChange
}) {
    const onBlur = typeof _onBlur === "function" ? _onBlur : () => undefined;

    /**
     * onChange.
     *
     * @param {setFieldValue} setFieldValue
     */
    const onChange = (setFieldValue) => (value) => {
        setFieldValue(name, value);

        typeof _onChange === "function" && _onChange(value);
    };

    return (
        <div className={padding ? "form-group" : ""}>
            {label && <Label name={name} label={label} required={required} />}
            <FastField name={name}>
                {({ field, form }) => {
                    return (
                        <InputNumber
                            id={name}
                            style={{ width: "100%" }}
                            placeholder={placeholder}
                            autoFocus={autoFocus}
                            disabled={disabled}
                            onBlur={onBlur}
                            value={field.value}
                            onChange={onChange(form.setFieldValue)}
                            min={min}
                            max={max}
                            step={step}
                        />
                    );
                }}
            </FastField>
            <ErrorMessage name={name} className="field-error-message" component="div" />
        </div>
    );
}
