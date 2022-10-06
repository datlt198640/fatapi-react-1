import * as React from "react";
import { FastField, ErrorMessage } from "formik";
import { Checkbox } from "antd";

/**
 * @callback setFieldValue
 * @param {string} name
 * @param {boolean} value
 */
/**
 * CheckInput
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.label
 * @param {boolean} props.disabled
 * @returns {ReactElement}
 */
export default function CheckInput({ name, label, disabled = false }) {
    /**
     * @param {setFieldValue} setFieldValue
     */
    const onChange = (setFieldValue) => (e) => {
        const value = !!e.target.checked || false;
        setFieldValue(name, value);
    };
    return (
        <div className="form-group">
            <FastField name={name}>
                {({ field, form }) => {
                    return (
                        <Checkbox
                            disabled={disabled}
                            id={name}
                            name={name}
                            checked={!!field.value}
                            onChange={onChange(form.setFieldValue)}
                        >
                            {label}
                        </Checkbox>
                    );
                }}
            </FastField>
            <ErrorMessage name={name} className="field-error-message" component="div" />
        </div>
    );
}

CheckInput.displayName = "CheckInput";
