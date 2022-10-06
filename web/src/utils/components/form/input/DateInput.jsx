import * as React from "react";
import { DatePicker } from "antd";
import { FastField } from "formik";
import Utils from "utils/Utils";
import Label from "../Label";

/**
 * DateInput.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.label
 * @param {boolean} props.required
 * @returns {ReactElement}
 */
export default function DateInput({ name, label, required = false }) {
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

                    const onChange = (_value, dateString) => {
                        const dateStr = Utils.dateStrReadableToIso(dateString);
                        form.setFieldValue(name, dateStr);
                    };
                    return (
                        <>
                            <DatePicker
                                defaultValue={value}
                                onChange={onChange}
                                format={Utils.DATE_REABLE_FORMAT}
                                style={{ width: "100%" }}
                            />
                            {renderErrorMessage()}
                        </>
                    );
                }}
            </FastField>
        </div>
    );
}
