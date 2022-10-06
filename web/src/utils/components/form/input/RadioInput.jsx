import * as React from "react";
import { FastField, ErrorMessage } from "formik";
import { Radio } from "antd";
import Label from "../Label";

/**
 * @callback setFieldValue
 * @param {string} name
 * @param {string | number} value
 */

/**
 * RadioInput.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.label
 * @param {boolean} props.required
 * @param {boolean} props.disabled
 * @param {boolean} props.numbering
 * @param {boolean} props.newLine
 * @param {Object[]} props.options
 */
export default function RadioInput({
    name,
    label,
    required = false,
    options = [],
    disabled = false,
    numbering = false,
    newLine = false
}) {
    /**
     * onChange.
     *
     * @param {setFieldValue} setFieldValue
     */
    const onChange = (setFieldValue) => (e) => {
        const value = e.target.value;
        setFieldValue(name, value);
    };
    return (
        <div className="form-group">
            {label && <Label name={name} label={label} required={required} />}
            <FastField name={name}>
                {({ field, form }) => {
                    return (
                        <Radio.Group
                            disabled={disabled}
                            id={name}
                            name={name}
                            value={field.value}
                            onChange={onChange(form.setFieldValue)}
                        >
                            {options.map(({ value, label }, key) => (
                                <Wrapper
                                    wraperType={newLine ? "column" : "inline"}
                                    key={value}
                                >
                                    <Radio value={value}>
                                        {numbering ? `${key + 1}. ` : null}
                                        {label}
                                    </Radio>
                                </Wrapper>
                            ))}
                        </Radio.Group>
                    );
                }}
            </FastField>
            <ErrorMessage name={name} className="field-error-message" component="div" />
        </div>
    );
}

function Wrapper({ children, wraperType }) {
    if (wraperType === "inline") return <span>{children}</span>;
    if (wraperType === "column") return <div>{children}</div>;
    return children;
}
