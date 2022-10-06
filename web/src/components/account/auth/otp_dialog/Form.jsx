import { useSetRecoilState, useRecoilValue } from "recoil";
import { Form, Input } from "antd";
import FormUtils from "utils/FormUtils";

import { verifUrls } from "../config";
import { authFlowUsernameSt, authFlowVerifIdSt, authFlowOtpCodeSt } from "../states";

const formName = "OTPDialogForm";

/**
 * OTPDialogForm.
 *
 * @param {Object} props
 * @param {string} props.verif_id
 * @param {string} props.username
 * @param {onChange} onChange
 * @returns {ReactElement}
 */
export default function OTPDialogForm({ onChange }) {
    const username = useRecoilValue(authFlowUsernameSt);
    const verifId = useRecoilValue(authFlowVerifIdSt);
    const setAuthFlowOtpCode = useSetRecoilState(authFlowOtpCodeSt);
    const [form] = Form.useForm();
    const initialValues = { otp_code: "" };

    const formAttrs = {
        otp_code: {
            name: "otp_code",
            label: "Mã OTP",
            rules: [FormUtils.ruleRequired()]
        }
    };
    return (
        <Form
            name={formName}
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ ...initialValues }}
            onFinish={(payload) => {
                setAuthFlowOtpCode(payload.otp_code);
                FormUtils.submit(verifUrls.check, { ...payload, verif_id: verifId })
                    .then((data) => onChange(data))
                    .catch(FormUtils.setFormErrors(form));
            }}
        >
            <p>Mã OTP đã được gửi đến: {username}</p>
            <Form.Item {...formAttrs.otp_code}>
                <Input autoFocus />
            </Form.Item>
        </Form>
    );
}

OTPDialogForm.displayName = formName;
OTPDialogForm.formName = formName;
