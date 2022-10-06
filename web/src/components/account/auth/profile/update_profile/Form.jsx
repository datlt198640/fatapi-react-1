import * as React from "react";
import { Form, Input } from "antd";
import FormUtils from "utils/FormUtils";

const formName = "UpdateProfileForm";

export default function UpdateProfileForm({ data, profileUrl, onChange }) {
    const [form] = Form.useForm();
    const formAttrs = {
        fullname: {
            name: "fullname",
            label: "Họ và tên",
            rules: [FormUtils.ruleRequired()]
        }
    };

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ ...data }}
            onFinish={(payload) =>
                FormUtils.submit(profileUrl, payload, "put")
                    .then((data) => onChange(data))
                    .catch(FormUtils.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.fullname}>
                <Input autoFocus />
            </Form.Item>
        </Form>
    );
}

UpdateProfileForm.displayName = formName;
UpdateProfileForm.formName = formName;
