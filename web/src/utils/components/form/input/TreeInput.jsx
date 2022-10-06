import * as React from "react";
import { Tree } from "antd";
import { FastField } from "formik";
import Label from "../Label";
import Utils from "utils/Utils";

export class Service {
    /**
     * applyPrefix.
     *
     * @param {string[]} valueList
     * @param {string} prefix
     * @returns {string[]}
     */
    static applyPrefix(valueList, prefix) {
        const notNullList = valueList.filter((item) => item !== null);
        if (prefix) {
            return notNullList.map((item) => `${prefix}_${item}`);
        }
        return notNullList;
    }
}

/**
 * TreeInput.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.prefix
 * @param {string} props.label
 * @param {Object[]} props.options
 * @param {onChange} props.onChange
 * @returns {ReactElement}
 */
export default function TreeInput({
    name,
    prefix,
    label,
    options,
    onChange: _onChange
}) {
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
                    /**
                     * onSelect.
                     *
                     * @param {number[]} values - only have 1 item
                     */
                    const onSelect = ([value]) => {
                        const formatedValue = Utils.ensurePk(value);
                        form.setFieldValue(name, formatedValue);
                        typeof _onChange === "function" && _onChange(formatedValue);
                    };

                    const selectedKeys = Service.applyPrefix([value], prefix);

                    return (
                        <>
                            <Tree
                                defaultExpandAll
                                autoExpandParent
                                showLine={true}
                                defaultSelectedKeys={selectedKeys}
                                onSelect={onSelect}
                                treeData={options}
                            />
                            {renderErrorMessage()}
                        </>
                    );
                }}
            </FastField>
        </div>
    );
}
