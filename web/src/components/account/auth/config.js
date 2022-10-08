import Utils from "utils/Utils";

const urlMap = {
    base: {
        prefix: "auth",
        endpoints: {
            login: "login",
            logout: "logout",

            signup: "signup",
            signupConfirm: "signup-confirm",
            resetPassword: "reset-pwd",
            changePassword: "change-pwd"
        }
    },
    user: {
        prefix: "auth/users/",
        endpoints: {
            profile: "me/"
        }
    },
    verif: {
        prefix: "noti/verif",
        endpoints: {
            check: "check",
            resend: "resend"
        }
    }
};

export const urls = Utils.prefixMapValues(urlMap.base);
export const verifUrls = Utils.prefixMapValues(urlMap.verif);
export const accountUrls = {
    user: Utils.prefixMapValues(urlMap.user)
};

const headingTxt = "Profile";
export const messages = {
    heading: headingTxt
};
