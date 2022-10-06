import { notification } from "antd";
import Utils from "utils/Utils";

export default class FormUtils {
    /**
     * removeEmptyKey.
     *
     * @param {Object} form - Antd hook instance
     * @param {Object} errorDict - {str: str[]}
     */

    static setFormErrors(form = null) {
        return (errorDict) => {
            if ("detail" in errorDict) {
                notification["error"]({
                    message: "Error",
                    description: errorDict.detail,
                    duration: 8
                });
                delete errorDict.detail;
            }
            form &&
                form.setFields(
                    Object.entries(errorDict).map(([name, errors]) => ({
                        name,
                        errors: typeof errors === "string" ? [errors] : errors
                    }))
                );
        };
    }

    /**
     * handleSubmit.
     *
     * @param {Object} payload
     */
    static submit(url, payload, method = "post") {
        Utils.toggleGlobalLoading();
        return new Promise((resolve, reject) => {
            Utils.apiCall(url, payload, method)
                .then((resp) => {
                    resolve(resp.data);
                })
                .catch((err) => {
                    reject(err.response.data);
                })
                .finally(() => Utils.toggleGlobalLoading(false));
        });
    }

    /**
     * getDefaultFieldName.
     *
     * @param {String} fieldName
     * @returns {String}
     */
    static getDefaultFieldName(fieldName) {
        return fieldName ? `"${fieldName}"` : "này";
    }

    /**
     * ruleRequired.
     *
     * @param {String} fieldName
     * @returns {Object} - Antd Form Rule Object
     */
    static ruleRequired(fieldName = "") {
        fieldName = FormUtils.getDefaultFieldName(fieldName);
        return {
            required: true,
            message: `Trường ${fieldName} là bắt buộc`
        };
    }

    /**
     * ruleMin.
     *
     * @param {Number} min
     * @param {String} fieldName
     * @returns {Object} - Antd Form Rule Object
     */
    static ruleMin(min, fieldName = "") {
        fieldName = FormUtils.getDefaultFieldName(fieldName);
        return {
            type: "number",
            min,
            message: `Trường "${fieldName}" có giá trị bé nhất là: ${min}`
        };
    }

    /**
     * ruleMax.
     *
     * @param {Number} max
     * @param {String} fieldName
     * @returns {Object} - Antd Form Rule Object
     */
    static ruleMax(max, fieldName = "") {
        fieldName = FormUtils.getDefaultFieldName(fieldName);
        return {
            type: "number",
            max,
            message: `Trường "${fieldName}" có giá trị lớn nhất là: ${max}`
        };
    }
}
