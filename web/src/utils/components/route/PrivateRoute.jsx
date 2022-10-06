import * as React from "react";
import { Route, Redirect } from "react-router-dom";
import Utils from "utils/Utils";

export default function PrivateRoute(props) {
    if (Utils.getToken()) return <Route {...props} />;
    const redirectProps = {
        pathname: "/login",
        state: { from: props.location }
    };
    return <Redirect push={true} to={redirectProps} />;
}

PrivateRoute.displayName = "PrivateRoute";
