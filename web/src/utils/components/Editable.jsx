import * as React from "react";
import { useState } from "react";
import { Button, Popover, notification } from "antd";
import { Formik, Form } from "formik";

import Utils from "utils/Utils";

import TextInput from "utils/components/form/input/TextInput";
import NumberInput from "utils/components/form/input/NumberInput";
import FormLevelErrMsg from "utils/components/form/FormLevelErrMsg";

export class Service {
    /**
     * emptyCallback.
     *
     * @param {Object} _data
     * @param {number} _id
     * @returns {void}
     */
    static emptyCallback(_data, _id) {
        // Empty callback
    }

    /**
     * emptyCallback.
     *
     * @param {function} onChange
     * @param {function} setVisible
     * @param {number} id
     * @param {string} endPoint
     * @param {string} method
     * @returns {void}
     */
    static handleSubmit(onChange, setVisible, id, endPoint, method) {
        /**
         * @param {FormikValues} data
         * @return {void}
         */
        return (data) => {
            Utils.toggleGlobalLoading();
            const url = id ? `${endPoint}${id}` : endPoint;
            Utils.apiCall(url, data, method)
                .then((resp) => {
                    const { data } = resp;
                    onChange(data, id);
                    setVisible(false);
                })
                .catch((err) => {
                    console.log(err);
                    const errors = err.response.data;
                    notification.error({ message: Object.values(errors)[0] });
                })
                .finally(() => Utils.toggleGlobalLoading(false));
        };
    }
}

/**
 * Editable.
 *
 * @param {Object} props
 * @param {ReactElement} props.children
 * @param {number} props.id
 * @param {string} props.name
 * @param {string | string[] | number} props.value
 * @param {number} props.step
 * @param {Object} props.extraParams
 * @param {string} props.endPoint
 * @param {string} props.placeholder
 * @param {string} props.type
 * @param {string} props.method
 * @param {function} props.onChange
 * @param {boolean} props.disabled
 * @param {boolean} props.underline
 * @returns {ReactElement}
 */
export default function Editable({
    children,
    id,
    name,
    value,
    step = 1,
    extraParams = {},
    endPoint,
    placeholder = "",
    type = "text",
    method = "put",
    onChange = Service.emptyCallback,
    disabled = false,
    underline = true
}) {
    const [visible, setVisible] = useState(false);
    const props = {
        visible: visible,
        trigger: "click",
        onVisibleChange: setVisible,
        destroyTooltipOnHide: true,
        content: (
            <Content
                id={id}
                name={name}
                value={value}
                step={step}
                extraParams={extraParams}
                type={type}
                endPoint={endPoint}
                method={method}
                onChange={onChange}
                setVisible={setVisible}
            />
        )
    };
    const styledChildren = React.cloneElement(children, {
        className:
            (children.props.className || "") +
            (disabled || !underline ? "" : " editable")
    });
    return (
        <Popover {...props}>
            {!placeholder || ![null, undefined, ""].includes(value) ? (
                styledChildren
            ) : (
                <em className={underline ? "editable" : ""}>{placeholder}</em>
            )}
        </Popover>
    );
}

/**
 * Content.
 *
 * @param {Object} props
 * @param {number} props.id
 * @param {string} props.name
 * @param {string | string[] | number} props.value
 * @param {number} props.step
 * @param {Object} props.extraParams
 * @param {string} props.type
 * @param {string} props.endPoint
 * @param {string} props.method
 * @param {function} props.onChange
 * @param {function} props.setVisible
 * @returns {ReactElement}
 */
function Content({
    id,
    name,
    value,
    step = 1,
    extraParams = {},
    type,
    endPoint,
    method,
    onChange,
    setVisible
}) {
    const { handleSubmit } = Service;
    return (
        <Formik
            initialValues={{ [name]: value, ...extraParams }}
            onSubmit={handleSubmit(onChange, setVisible, id, endPoint, method)}
        >
            {(props) => (
                <Form>
                    {type === "text" && <TextInput name={name} padding={false} />}
                    {type === "number" && (
                        <NumberInput step={step} name={name} padding={false} />
                    )}
                    <div className="center" style={{ marginTop: 10 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </div>
                    <FormLevelErrMsg errors={props.errors.detail} />
                </Form>
            )}
        </Formik>
    );
}
