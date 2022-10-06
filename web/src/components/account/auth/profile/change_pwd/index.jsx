import { useState, useEffect } from "react";
import { Modal } from "antd";
import Utils from "utils/Utils";
import Form from "./Form";

export class Service {
    static get toggleEvent() {
        return "TOGGLE_CHANGE_PASSWORD_DIALOG";
    }

    static toggle(open = true) {
        Utils.event.dispatch(Service.toggleEvent, { open });
    }
}

export default function ChangePwd() {
    const [open, setOpen] = useState(false);

    const handleToggle = ({ detail: { open } }) => {
        setOpen(open);
    };

    useEffect(() => {
        Utils.event.listen(Service.toggleEvent, handleToggle);
        return () => {
            Utils.event.remove(Service.toggleEvent, handleToggle);
        };
    }, []);

    return (
        <Modal
            keyboard={false}
            maskClosable={false}
            destroyOnClose
            visible={open}
            okButtonProps={{ form: Form.formName, key: "submit", htmlType: "submit" }}
            okText="OK"
            onCancel={() => Service.toggle(false)}
            cancelText="Thoát"
            title="Đổi mật khẩu"
        >
            <Form
                onChange={() => {
                    setOpen(false);
                }}
            />
        </Modal>
    );
}

ChangePwd.displayName = "ChangePwd";
ChangePwd.toggle = Service.toggle;
