import { Checkbox } from "antd";

/**
 * TreeCheckInput.
 *
 * @param {Object} props
 * @param {number[]} props.value
 * @param {function} props.onChange
 */
export default function CheckInput({ value, onChange }) {
    return <Checkbox checked={value} onChange={onChange} />;
}
