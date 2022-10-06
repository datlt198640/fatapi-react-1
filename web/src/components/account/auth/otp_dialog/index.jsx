import * as React from "react";
import { useState, useEffect } from "react";
import { Modal } from "antd";
import Utils from "utils/Utils";
import Form from "./Form";

export class Service {
    static toggleEvent = "TOGGLE_OTP_DIALOG";

    static toggle(open = true) {
        Utils.event.dispatch(Service.toggleEvent, { open });
    }
}

/**
 * @callback onChange
 * @param {string} verif_id
 */

/**
 * OTPDialog.
 *
 * @param {Object} props
 * @param {onChange} props.onChange
 *
 */
export default function OTPDialog({ onChange }) {
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
            title="Xác thực OTP"
        >
            <Form
                onChange={(verif_id) => {
                    setOpen(false);
                    onChange(verif_id);
                }}
            />
        </Modal>
    );
}

OTPDialog.displayName = "OTPDialog";
OTPDialog.toggle = Service.toggle;
