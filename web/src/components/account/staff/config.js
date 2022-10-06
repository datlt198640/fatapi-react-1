import Utils from "utils/Utils";

const urlMap = {
    base: {
        prefix: "account/staff",
        endpoints: {
            crud: "",
            upload: "upload",
            skillLevel: "skill-level"
        }
    },
    titleLevelEvaluate: {
        prefix: "ccf/title-level-evaluate",
        endpoints: {
            crud: ""
        }
    }
};
export const urls = Utils.prefixMapValues(urlMap.base);
export const titleLevelEvaluateUrls = Utils.prefixMapValues(urlMap.titleLevelEvaluate);

const headingTxt = "Nhân viên";
export const messages = {
    heading: headingTxt,
    deleteOne: `Bạn có muốn xoá ${headingTxt.toLowerCase()} này?`,
    deleteMultiple: `Bạn có muốn xoá những ${headingTxt.toLowerCase()} này?`
};

export const emptyRecord = {
    id: 0,
    uid: "",
    email: "",
    phone_number: "",
    last_name: "",
    first_name: "",
    department: "",
    title: "",
    subtitle: "",
    is_active: true,
    title_label: "",
    subtitle_label: "",
    title_level: null,
    type: 1,
    password: "",
    gender: 0,
};

export const formLabels = {
    fullname: "Full name",
    phone_number: "Phone number",
    email: "Email",
    password: "Passwords",
    gender: "Gender",
};

export const columns = [
    {
        key: "fullname",
        title: "Họ & tên",
        dataIndex: "fullname"
    },
    {
        key: "phone_number",
        title: "Số điện thoại",
        dataIndex: "phone_number"
    },
    {
        key: "email",
        title: "Email",
        dataIndex: "email"
    },
    {
        key: "group_labels",
        title: "Nhóm",
        dataIndex: "group_labels"
    },
    {
        key: "action",
        title: "",
        fixed: "right",
        width: 90
    }
];
