import * as React from "react";
import { FastField, ErrorMessage } from "formik";
import { Input } from "antd";
import Label from "../Label";
import Utils from "utils/Utils";

const { TextArea } = Input;

const allowedTypes = ["text", "password", "email", "textarea"];

/**
 * TextInput.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.label
 * @param {string} props.placeholder
 * @param {string} props.type
 * @param {boolean} props.padding
 * @param {boolean} props.autoFocus
 * @param {boolean} props.required
 * @param {boolean} props.disabled
 * @param {onBlur} props.onBlur
 * @param {onChange} props.onChange
 */
export default function TextInput({
    name,
    label = "",
    placeholder = "",
    type = "text",
    padding = true,
    autoFocus = false,
    required = false,
    disabled = false,
    onBlur: _onBlur,
    onChange: _onChange
}) {
    if (!allowedTypes.includes(type))
        throw new Error(`Invalid type, types allowed: ${allowedTypes.join(", ")}`);

    const onBlur = typeof _onBlur === "function" ? _onBlur : () => undefined;

    const onChange = (setFieldValue) => (e) => {
        const value = Utils.getValueFromEvent(e);

        setFieldValue(name, value);

        typeof _onChange === "function" && _onChange(value);
    };

    return (
        <div className={padding ? "form-group" : ""}>
            {label && <Label name={name} label={label} required={required} />}
            <FastField name={name}>
                {({ field, form }) => {
                    const props = {
                        id: name,
                        style: { width: "100%" },
                        placeholder: placeholder,
                        autoFocus: autoFocus,
                        disabled: disabled,
                        onBlur: onBlur,
                        value: field.value,
                        suffix: required ? (
                            label ? null : (
                                <span className="red">*</span>
                            )
                        ) : null,
                        onChange: onChange(form.setFieldValue)
                    };
                    const inputProps = { ...props, type: type };
                    const textareaProps = {
                        ...props,
                        autoSize: { minRows: 3, maxRows: 6 }
                    };
                    return type === "textarea" ? (
                        <TextArea {...textareaProps} />
                    ) : (
                        <Input {...inputProps} />
                    );
                }}
            </FastField>
            <ErrorMessage name={name} className="field-error-message" component="div" />
        </div>
    );
}
