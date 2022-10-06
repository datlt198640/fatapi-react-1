import { useState, useEffect } from "react";
import { Modal } from "antd";
import Utils from "utils/Utils";
import Form from "./Form";
import { emptyProfile } from "..";

export class Service {
    static get toggleEvent() {
        return "TOGGLE_UPDATE_PROFILE_DIALOG";
    }

    static toggle(open = true, data) {
        Utils.event.dispatch(Service.toggleEvent, { open, data });
    }
}

export default function UpdateProfile({ onChange, profileUrl }) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({ ...emptyProfile });

    const handleToggle = ({ detail: { open, data } }) => {
        setOpen(open);
        setData(data);
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
            title="Cập nhật tài khoản"
        >
            <Form
                profileUrl={profileUrl}
                data={data}
                onChange={(data) => {
                    setOpen(false);
                    onChange(data);
                }}
            />
        </Modal>
    );
}

UpdateProfile.displayName = "UpdateProfile";
UpdateProfile.toggle = Service.toggle;
