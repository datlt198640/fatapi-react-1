import * as React from "react";
import { Tree } from "antd";
import { FastField } from "formik";
import Label from "../Label";

export class Service {
    /**
     * filter.
     *
     * @param {string} level
     */
    static filter(level) {
        /**
         * @param {number | string} pk
         * @returns {boolean}
         */
        return (pk) => {
            if (["staff", "title_level"].includes(level))
                return !String(pk).includes("_");
            return String(pk).includes(`${level}_`);
        };
    }

    /**
     * map.
     *
     * @param {string | number} level
     * @returns {number}
     */
    static map(pk) {
        const id = String(pk);
        if (!id.includes("_")) {
            return parseInt(id);
        }
        return parseInt(id.split("_")[1]);
    }
}

/**
 * TreeCheckInput.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {boolean} props.required
 * @param {string} props.label
 * @param {Object[]} props.options
 * @param {string} props.level - "department" | "title" | "staff"
 */
export default function TreeCheckInput({
    name,
    required = false,
    label,
    options,
    level
}) {
    return (
        <div className={"form-group"}>
            {label && <Label name={name} label={label} required={required} />}
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
                     * @param {number[]} values
                     */
                    const onSelect = (values) => {
                        const processedValues = values
                            .filter(Service.filter(level))
                            .map(Service.map);
                        form.setFieldValue(name, processedValues);
                    };

                    return (
                        <>
                            <Tree
                                checkable
                                defaultExpandAll
                                autoExpandParent
                                defaultCheckedKeys={value}
                                showLine={true}
                                onCheck={onSelect}
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
