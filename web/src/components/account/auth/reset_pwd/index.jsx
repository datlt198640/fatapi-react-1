import { useState, useEffect, useRef } from "react";
import { Modal } from "antd";
import Utils from "utils/Utils";
import Form from "./Form";

export class Service {
    static toggleEvent = "TOGGLE_RESET_PASSWORD_DIALOG";

    static toggle(open = true) {
        Utils.event.dispatch(Service.toggleEvent, { open });
    }
}

/**
 * @callback FormCallback
 * @param {string} verif_id
 * @param {string} username
 */

/**
 * ResetPwd.
 *
 * @param {Object} props
 * @param {FormCallback} props.onChange
 */
export default function ResetPwd({ onChange }) {
    const formRef = useRef();
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
            keyboard={false}
            maskClosable={false}
            destroyOnClose
            visible={open}
            okButtonProps={{ form: Form.formName, key: "submit", htmlType: "submit" }}
            onCancel={() => Service.toggle(false)}
            okText="OK"
            cancelText="Thoát"
            title="Khôi phục mật khẩu"
        >
            <Form
                onChange={(verif_id, username) => {
                    setOpen(false);
                    onChange(verif_id, username);
                }}
                formRef={formRef}
            />
        </Modal>
    );
}

ResetPwd.displayName = "ResetPwd";
ResetPwd.toggle = Service.toggle;
