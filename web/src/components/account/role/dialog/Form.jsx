import * as React from "react";
import { Form, Input } from "antd";
import Utils from "utils/Utils";
import FormUtils from "utils/FormUtils";
import TransferInput from "utils/components/ant_form/input/TransferInput";
import { urls, formLabels, emptyRecord } from "../config";

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

export class Service {
    /**
     * handleSubmit.
     *
     * @param {FormCallback} onChange
     * @param {number} id
     */
    static handleSubmit(onChange, id) {
        return (data, formikBag) => {
            Utils.toggleGlobalLoading();
            const endPoint = id ? `${urls.crud}${id}` : urls.crud;
            const method = id ? "put" : "post";
            Utils.apiCall(endPoint, data, method)
                .then((resp) => {
                    const { data } = resp;
                    onChange(data, id);
                })
                .catch((err) => {
                    const errors = err.response.data;
                    const formatedErrors = Utils.setFormErrors(errors);
                    formikBag.setErrors(formatedErrors);
                })
                .finally(() => Utils.toggleGlobalLoading(false));
        };
    }
}

const formName = "RoleForm";

/**
 * RoleForm.
 *
 * @param {Object} props
 * @param {Object[]} props.pems
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 * @param {Object} props.formRef
 */
export default function RoleForm({ pems, data, onChange }) {
    const [form] = Form.useForm();
    const initValues = Utils.isEmpty(data) ? emptyRecord : data;
    const id = initValues.id;
    const url = id ? `${urls.crud}${id}` : urls.crud;
    const method = id ? "put" : "post";

    const formAttrs = {
        name: {
            name: "name",
            label: formLabels.name,
            rules: [FormUtils.ruleRequired()]
        },
        permissions: {
            name: "permissions",
            label: formLabels.permissions,
            rules: [FormUtils.ruleRequired()]
        }
    };

    return (
        <Form
            form={form}
            name={formName}
            layout="vertical"
            initialValues={{ ...initValues }}
            onFinish={(payload) =>
                FormUtils.submit(url, payload, method)
                    .then((data) => onChange(data, id))
                    .catch(FormUtils.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.name}>
                <Input autoFocus />
            </Form.Item>

            <Form.Item {...formAttrs.permissions}>
                <TransferInput options={pems} />
            </Form.Item>
        </Form>
    );
}

RoleForm.displayName = formName;
RoleForm.formName = formName;
