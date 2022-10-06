import * as React from "react";
import { Divider } from "antd";

/**
    @param {Object} props
    @param {ReactElement} props.children
*/
export default function PageHeading({ children }) {
  return (
    <>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: "#fff",
        fontWeight: "bold",
        fontSize: "1.5rem",
      }}
    >
      {children}
    </div>
    <Divider />
    </>
  );
}

PageHeading.displayName = "PageHeading";
