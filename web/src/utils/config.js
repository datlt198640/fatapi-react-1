import Utils from "utils/Utils";

const downloadSessionUrlMap = {
    base: {
        prefix: "assist/download-session",
        endpoints: {
            crud: ""
        }
    }
};
export const downloadSessionUrls = Utils.prefixMapValues(downloadSessionUrlMap.base);
