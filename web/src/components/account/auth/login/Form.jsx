import { Button, Row, Col, Form, Input } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import FormUtils from "utils/FormUtils";
import { urls } from "../config";

const formName = "VariableForm";

export default function LoginForm({ onChange, children }) {
    const [form] = Form.useForm();
    const initialValues = { username: "", password: "" };

    const formAttrs = {
        username: {
            name: "username",
            label: "Tên đăng nhập",
            rules: [FormUtils.ruleRequired()]
        },
        password: {
            name: "password",
            label: "Mật khẩu",
            rules: [FormUtils.ruleRequired()]
        }
    };

    return (
        <Form
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ ...initialValues }}
            onFinish={(payload) =>
                FormUtils.submit(urls.login, payload)
                    .then((data) => onChange(data))
                    .catch(FormUtils.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.username}>
                <Input autoFocus />
            </Form.Item>

            <Form.Item {...formAttrs.password}>
                <Input type="password" />
            </Form.Item>

            <br />
            <Row>
                <Col span={12}>{children}</Col>
                <Col span={12} className="right">
                    <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                        Đăng nhập
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}
LoginForm.displayName = formName;
LoginForm.formName = formName;
