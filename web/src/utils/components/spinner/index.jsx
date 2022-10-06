import * as React from "react";
import { useState, useEffect } from "react";
import { Spin } from "antd";
import Utils from "utils/Utils";

export default function Component() {
    const [spinning, setSpinning] = useState(false);

    const eventHandler = ({ detail: spinning }) => setSpinning(spinning);

    useEffect(() => {
        Utils.event.listen("TOGGLE_SPINNER", eventHandler);
        return () => {
            Utils.event.remove("TOGGLE_SPINNER", eventHandler);
        };
    }, []);

    if (!spinning) return null;
    return (
        <div className="backdrop">
            <Spin tip="Loading..." />
        </div>
    );
}
