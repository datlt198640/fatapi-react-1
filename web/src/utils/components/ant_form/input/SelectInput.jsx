import { Select } from "antd";
const { Option } = Select;

/**
 * TreeCheckInput.
 *
 * @param {Object} props
 * @param {number[]} props.value
 * @param {Object[]} props.options
 * @param {string} props.mode - "multiple" | "tags"
 * @param {string} props.blankLabel
 * @param {boolean} props.allowClear
 * @param {boolean} props.disabled
 * @param {function} props.onChange
 */
export default function TreeCheckInput({
    value,
    options,
    mode = null,
    blankLabel = "",
    allowClear = false,
    disabled = false,
    onChange,
    style=style
}) {
    function optionsWithBlankValue(options) {
        const isMulti = mode === "multiple";
        if (isMulti || !blankLabel) return options;

        const blankOption = {
            value: null,
            label: `--- ${blankLabel} ---`
        };
        return [blankOption, ...options];
    }

    return (
        <Select
            showSearch
            allowClear={allowClear}
            value={value}
            mode={mode}
            disabled={disabled}
            onChange={onChange}
            filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={style}
        >
            {optionsWithBlankValue(options).map(({ value, label }) => (
                <Option key={value} value={value}>
                    {label}
                </Option>
            ))}
        </Select>
    );
}
