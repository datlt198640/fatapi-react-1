import { useState, useEffect } from "react";
import { Modal } from "antd";
import Utils from "utils/Utils";
import Form from "./Form";

export class Service {
    static toggleEvent = "TOGGLE_RESET_PASSWORD_CONFIRM_DIALOG";

    static toggle(open = true) {
        Utils.event.dispatch(Service.toggleEvent, { open });
    }
}

export default function ResetPwdConfirm() {
    const [open, setOpen] = useState(false);

    const handleToggle = ({ detail: { open } }) => setOpen(open);

    useEffect(() => {
        Utils.event.listen(Service.toggleEvent, handleToggle);
        return () => {
            Utils.event.remove(Service.toggleEvent, handleToggle);
        };
    }, []);

    return (
        <Modal
            destroyOnClose={true}
            visible={open}
            okButtonProps={{ form: Form.formName, key: "submit", htmlType: "submit" }}
            okText="OK"
            onCancel={() => Service.toggle(false)}
            cancelText="Thoát"
            title="Khôi phục mật khẩu"
        >
            <Form
                onChange={() => {
                    setOpen(false);
                }}
            />
        </Modal>
    );
}

ResetPwdConfirm.displayName = "ResetPwdConfirm";
ResetPwdConfirm.toggle = Service.toggle;
