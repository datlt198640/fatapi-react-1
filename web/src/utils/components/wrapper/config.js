import Utils from "utils/Utils";

const urlMap = {
    base: {
        prefix: "noti/notification",
        endpoints: {
            pending: "pending"
        }
    }
};
export const urls = Utils.prefixMapValues(urlMap.base);
