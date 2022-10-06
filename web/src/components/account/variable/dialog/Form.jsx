import { Form, Input } from "antd";
import Utils from "utils/Utils";
import FormUtils from "utils/FormUtils";
import { urls, labels, emptyRecord } from "../config";

const formName = "VariableForm";

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * VariableForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function VariableForm({ data, onChange }) {
    const [form] = Form.useForm();
    const initialValues = Utils.isEmpty(data) ? emptyRecord : data;
    const id = initialValues.id;

    const endPoint = id ? `${urls.crud}${id}` : urls.crud;
    const method = id ? "put" : "post";

    const formAttrs = {
        uid: {
            name: "uid",
            label: labels.uid,
            rules: [FormUtils.ruleRequired()]
        },
        value: {
            name: "value",
            label: labels.value
        }
    };

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ ...initialValues }}
            onFinish={(payload) =>
                FormUtils.submit(endPoint, payload, method)
                    .then((data) => onChange(data, id))
                    .catch(FormUtils.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.uid}>
                <Input autoFocus />
            </Form.Item>

            <Form.Item {...formAttrs.value}>
                <Input />
            </Form.Item>
        </Form>
    );
}

VariableForm.displayName = formName;
VariableForm.formName = formName;
