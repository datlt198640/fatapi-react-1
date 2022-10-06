import * as React from "react";

/**
    @param {Object} props
    @param {string|number} props.value
    @param {string|number} props.default_value
*/
export default function PlaceHolder({ value, default_value = "Chưa có giá trị" }) {
    if (["", null, undefined].includes(value)) {
        return <span style={{ fontStyle: "italic" }}>{default_value}</span>;
    }
    return <span>{value}</span>;
}

PlaceHolder.displayName = "PlaceHolder";
