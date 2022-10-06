import { Tree } from "antd";

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

    /**
     * parseInput.
     *
     * @param {number[]} values
     * @param {string} level
     * @returns {string[]}
     */
    static parseInput(values, level = null) {
        if (!level) {
            return values.map((id) => `${id}`);
        }
        return values.map((id) => `${level}_${id}`);
    }

    /**
     * parseOutput.
     *
     * @param {string[]} values
     * @param {string} level
     * @returns {number[]}
     */
    static parseOutput(values, level) {
        return values.filter(Service.filter(level)).map(Service.map);
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
export default function TreeCheckInput({ options, level, value, onChange }) {
    /**
     * onSelect.
     *
     * @param {number[]} values
     */
    function onSelect(values) {
        onChange(Service.parseOutput(values, level));
    }

    return (
        <Tree
            checkable
            defaultExpandAll
            autoExpandParent
            showLine={true}
            defaultCheckedKeys={Service.parseInput(value, level)}
            onCheck={onSelect}
            treeData={options}
        />
    );
}
