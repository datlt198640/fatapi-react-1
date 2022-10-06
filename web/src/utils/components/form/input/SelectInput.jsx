import { FastField } from "formik";
import { Select } from "antd";
import Label from "../Label";

const { Option } = Select;

const styles = {
    layout: {
        width: "100%"
    }
};

/**
 * SelectInput.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.label
 * @param {Object[]} props.option
 * @param {string} props.blankLabel
 * @param {boolean} props.allowClear
 * @param {boolean} props.isMulti
 * @param {boolean} props.disabled
 * @param {boolean} props.required
 * @param {onChange} props.onChange
 * @returns {ReactElement}
 */
export default function SelectInput({
    name,
    label,
    options,
    blankLabel = "",
    allowClear = false,
    isMulti = false,
    disabled = false,
    required = false,
    onChange: _onChange
}) {
    const blankOption = {
        value: null,
        label: `--- ${blankLabel} ---`
    };
    const optionsWithBlankValue = (options) => {
        if (isMulti || !blankLabel) return options;
        return [blankOption, ...options];
    };

    const children = optionsWithBlankValue(options).map((item) => {
        const { value, label } = item;
        return (
            <Option key={value} value={value}>
                {label}
            </Option>
        );
    });

    return (
        <div
            className={"form-group"}
            style={{ marginTop: label === "_blank" ? 27 : 0 }}
        >
            <Label
                name={name}
                label={label === "_blank" ? "" : label}
                required={required}
            />
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
                                onChange={(value) => {
                                    form.setFieldValue(name, value);
                                    typeof _onChange === "function" && _onChange(value);
                                }}
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
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
