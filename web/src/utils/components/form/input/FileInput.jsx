import * as React from "react";
import { useState } from "react";
import { FastField, ErrorMessage } from "formik";
import { Upload } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import Label from "../Label";

const { Dragger } = Upload;
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
 * FileInput.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.label
 * @param {string} props.placeholder
 * @param {boolean} props.padding
 * @param {boolean} props.required
 * @param {boolean} props.disabled
 * @param {onChange} props.onChange
 */
export default function FileInput({
    name,
    label = "",
    placeholder = "",
    padding = true,
    required = false,
    disabled = false,
    onChange: _onChange
}) {
    const [displayLabel, setDisplayLabel] = useState(placeholder);
    /**
     * onChange.
     *
     * @param {setFieldValue} setFieldValue
     */
    const onChange = (setFieldValue) => (value) => {
        setDisplayLabel(value.name);
        setFieldValue(name, value);

        typeof _onChange === "function" && _onChange(value);
    };

    function showDisplayLabel(value, displayLabel) {
        if (!value) {
            return displayLabel;
        }
        if (typeof value === "string") {
            const nameArr = value.split("/");
            return nameArr[nameArr.length - 1];
        }
        return value.name;
    }

    function getFileUrl(url) {
        if (!url || typeof url !== "string") return "";
        if (!url.startsWith("http")) return "";
        return url;
    }

    return (
        <div className={padding ? "form-group" : ""}>
            {label && <Label name={name} label={label} required={required} />}
            <FastField name={name}>
                {({ field, form }) => {
                    return (
                        <div className="file-input">
                            <Dragger
                                id={name}
                                disabled={disabled}
                                showUploadList={false}
                                name={name}
                                beforeUpload={onChange(form.setFieldValue)}
                            >
                                <div className="center" style={{ margin: "auto" }}>
                                    &nbsp; {showDisplayLabel(field.value, displayLabel)}
                                </div>
                            </Dragger>
                            {getFileUrl(field.value) && (
                                <div style={{ fontSize: 10 }}>
                                    <a
                                        href={getFileUrl(field.value)}
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        <LinkOutlined />
                                        &nbsp;
                                        <span>File URL</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    );
                }}
            </FastField>
            <ErrorMessage name={name} className="field-error-message" component="div" />
        </div>
    );
}
