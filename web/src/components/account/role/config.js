import * as Yup from "yup";
import ErrMsgs from "utils/ErrMsgs";
import Utils from "utils/Utils";

const urlMap = {
    base: {
        prefix: "account/role",
        endpoints: {
            crud: ""
        }
    }
};
export const urls = Utils.prefixMapValues(urlMap.base);

const headingTxt = "Nhóm";
export const messages = {
    heading: headingTxt,
    deleteOne: `Bạn có muốn xoá ${headingTxt.toLowerCase()} này?`,
    deleteMultiple: `Bạn có muốn xoá những ${headingTxt.toLowerCase()} này?`
};

export const emptyRecord = {
    id: 0,
    name: "",
    permissions: []
};

export const schema = Yup.object().shape({
    name: Yup.string().required(ErrMsgs.REQUIRED),
    permissions: Yup.array().of(Yup.number())
});

export const formLabels = {
    name: "Tên nhóm",
    title: "Tên nhóm",
    permissions: "Quyền"
};

export const columns = [
    {
        key: "uid",
        title: "Tên nhóm",
        dataIndex: "name"
    },
    {
        key: "action",
        title: "",
        fixed: "right",
        width: 90
    }
];

export const pemGroupTrans = {
    group: "Nhóm",
    permission: "Quyền",
    staff: "Nhân viên",
    variable: "Cấu hình"
};

export const excludeGroups = ["user", "logentry", "token", "contenttype", "session"];
