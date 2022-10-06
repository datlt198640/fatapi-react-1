import * as React from "react";
import { FastField } from "formik";
import Label from "../Label";
import { Select } from "antd";

const { Option, OptGroup } = Select;

const styles = {
    layout: {
        width: "100%"
    }
};

/**
 * GroupSelectInput.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.label
 * @param {Object[]} props.options
 * @param {boolean} props.allowClear
 * @param {boolean} props.isMulti
 * @param {boolean} props.isGroup
 * @param {boolean} props.disabled
 * @param {boolean} props.required
 * @returns {ReactElement}
 */
export default function GroupSelectInput({
    name,
    label,
    options,
    allowClear = false,
    isMulti = false,
    disabled = false,
    required = false
}) {
    const children = options.map((group) => {
        const { value, label, options } = group;
        return (
            <OptGroup key={value} label={label}>
                {options.map((option) => (
                    <Option key={option.value} value={option.value}>
                        {option.label}
                    </Option>
                ))}
            </OptGroup>
        );
    });

    return (
        <div className={"form-group"}>
            <Label name={name} label={label} required={required} />
            <FastField name={name}>
                {({ field, form }) => {
                    const value = field.value;
                    const renderErrorMessage = () => {
                        if (!form.touched[field.name] || !form.errors[field.name])
                            return null;
                        return <div className="red">{form.errors[field.name]}</div>;
                    };
                    return (
                        <>
                            <Select
                                showSearch
                                style={styles.layout}
                                allowClear={allowClear}
                                defaultValue={value}
                                mode={isMulti ? "multiple" : null}
                                disabled={disabled}
                                onChange={(value) => form.setFieldValue(name, value)}
                            >
                                {children}
                            </Select>
                            {renderErrorMessage()}
                        </>
                    );
                }}
            </FastField>
        </div>
    );
}
