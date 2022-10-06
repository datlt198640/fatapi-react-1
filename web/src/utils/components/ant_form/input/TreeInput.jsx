import { Tree } from "antd";
import Utils from "utils/Utils";

export class Service {
    /**
     * parseInput.
     *
     * @param {number} value
     * @param {string} level
     * @returns {string[]}
     */
    static parseInput(value, level = null) {
        const result = level ? `${level}_${value}` : `${value}`;
        return [result];
    }
}

/**
 * TreeCheckInput.
 *
 * @param {Object} props
 * @param {number[]} props.value
 * @param {Object[]} props.options
 * @param {string} props.level - "department" | "title" | "staff"
 * @param {function} props.onChange
 */
export default function TreeCheckInput({ options, value, level = null, onChange }) {
    /**
     * onSelect.
     *
     * @param {number[]} values
     */
    function onSelect(value) {
        onChange(Utils.ensurePk(value));
    }

    return (
        <Tree
            defaultExpandAll
            autoExpandParent
            showLine={true}
            defaultSelectedKeys={Service.parseInput(value, level)}
            onSelect={onSelect}
            treeData={options}
        />
    );
}
