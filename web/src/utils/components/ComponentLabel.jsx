import * as React from "react";
import { useState } from "react";
import { DEV_MODE } from "utils/constants";

const style = {
    fontSize: 8,
    zIndex: 2,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 5,
    padding: 1,
    position: "absolute",
    lineHeight: "6px",
    top: 0,
    left: 0
};

/**
 * ComponentLabel.
 *
 * @param {Object} props
 * @param {string} props.label
 * @returns {ReactElement}
 */
export default function ComponentLabel({ label }) {
    const [visible, setVisible] = useState(true);
    if (!DEV_MODE) return null;
    if (!visible) {
        return null;
    }
    return (
        <span className="pointer" style={style} onClick={() => setVisible(false)}>
            {label}
        </span>
    );
}

ComponentLabel.displayName = "ComponentLabel";
