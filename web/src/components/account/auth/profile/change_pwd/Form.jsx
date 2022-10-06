import * as React from "react";
import { Row, Col, Form, Input } from "antd";
import FormUtils from "utils/FormUtils";
import { urls } from "../../config";

const formName = "ChangePwdForm";

export default function ChangePwdForm({ onChange }) {
    const [form] = Form.useForm();
    const initValues = {
        password: "",
        old_password: "",
        password_confirm: ""
    };

    const formAttrs = {
        old_password: {
            name: "old_password",
            label: "Mật khẩu cũ",
            rules: [FormUtils.ruleRequired()]
        },
        password: {
            name: "password",
            label: "Mật khẩu mới",
            rules: [FormUtils.ruleRequired()]
        },
        password_confirm: {
            name: "password_confirm",
            label: "Mật mới nhập lại",
            rules: [FormUtils.ruleRequired()]
        }
    };

    return (
        <Form
            layout="vertical"
            form={form}
            name={formName}
            initialValues={{ ...initValues }}
            onFinish={(payload) =>
                FormUtils.submit(urls.changePassword, payload)
                    .then((data) => onChange(data))
                    .catch(FormUtils.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.old_password}>
                <Input autoFocus type="password" />
            </Form.Item>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item {...formAttrs.password}>
                        <Input type="password" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item {...formAttrs.password_confirm}>
                        <Input type="password" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

ChangePwdForm.displayName = formName;
ChangePwdForm.formName = formName;
