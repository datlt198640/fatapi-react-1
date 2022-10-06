import { useRecoilValue } from "recoil";
import { Form, Input } from "antd";
import FormUtils from "utils/FormUtils";
import { urls } from "../config";
import { authFlowVerifIdSt, authFlowOtpCodeSt } from "../states";

const formName = "ResetPwdConfirmForm";

/**
 * ResetPwdConfirmForm.
 *
 * @param {Object} props
 * @param {function} props.onChange
 */
export default function ResetPwdConfirmForm({ onChange }) {
    const [form] = Form.useForm();
    const verif_id = useRecoilValue(authFlowVerifIdSt);
    const otp_code = useRecoilValue(authFlowOtpCodeSt);
    const initialValues = { password: "", password_confirm: "" };
    const formAttrs = {
        password: {
            name: "password",
            label: "Mật khẩu",
            rules: [FormUtils.ruleRequired()]
        },
        password_confirm: {
            name: "password_confirm",
            label: "Mật khẩu nhập lại",
            rules: [FormUtils.ruleRequired()]
        }
    };

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ ...initialValues }}
            onFinish={(payload) =>
                FormUtils.submit(urls.resetPassword, { ...payload, verif_id, otp_code })
                    .then((data) => onChange(data))
                    .catch(FormUtils.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.password}>
                <Input autoFocus type="password" />
            </Form.Item>

            <Form.Item {...formAttrs.password_confirm}>
                <Input type="password" />
            </Form.Item>
        </Form>
    );
}

ResetPwdConfirmForm.displayName = formName;
ResetPwdConfirmForm.formName = formName;
