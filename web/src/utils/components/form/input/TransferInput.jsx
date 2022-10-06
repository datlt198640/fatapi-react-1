import * as React from "react";
import { FastField } from "formik";
import { Transfer } from "antd";
import Label from "../Label";

/**
 * @typedef {{key: string, title: string, description?: string}} Option
 */

/**
 * TransferInput.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {Option[]} props.options
 * @param {string} props.label
 * @param {boolean} props.disabled
 * @returns {ReactElement}
 */
export default function TransferInput({ name, options, label, disabled = false }) {
    return (
        <div className={"form-group"}>
            <Label name={name} label={label} />
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
                            <Transfer
                                showSearch
                                dataSource={options}
                                targetKeys={value}
                                disabled={disabled}
                                onChange={(value) => form.setFieldValue(name, value)}
                                filterOption={(input, option) => {
                                    return (
                                        option.description
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    );
                                }}
                                render={(item) =>
                                    item.description
                                        ? `${item.title} - ${item.description}`
                                        : item.title
                                }
                                listStyle={{
                                    width: 458,
                                    height: 512
                                }}
                            />
                            {renderErrorMessage()}
                        </>
                    );
                }}
            </FastField>
        </div>
    );
}
