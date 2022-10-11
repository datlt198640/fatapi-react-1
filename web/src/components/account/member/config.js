import Utils from "utils/Utils";


const urlMap = {
    base: {
      prefix: "user",
      endpoints: {
        crud: "",
      },
    },
};

export const urls = Utils.prefixMapValues(urlMap.base);

const headingTxt = "Member ";
export const messages = {
    heading: headingTxt,
    deleteOne: `Do you want to delete this ${headingTxt.toLowerCase()}?`,
    deleteMultiple: `Do you want to delete these ${headingTxt.toLowerCase()} ?`
};

export const emptyRecord = {
    _id: "",
    phone_number: "",
    email: "",
    password: "",
    fullName: "",
    groups: "",
    gender: "",
    dob: "",
    occupation: "",
    address: "",
    member_remote_id: "",
};

export const formLabels = {
    username: "Username",
    email: "Email",
    password: "Password",
    full_name: "Full name",
    avatar: "Group",
    createdAt: "Gender",
    updatedAt: "Date of birth",
    isAdmin: "Occupation",
    isActive: "Address",
};

export const columns = [
    {
        key: "full_name",
        title: "Full name",
        dataIndex: "full_name"
    },
    {
        key: "username",
        title: "Username",
        dataIndex: "username"
    },
    {
        key: "email",
        title: "Email",
        dataIndex: "email",
        width: 250
    },
    {
        key: "is_active",
        title: "Is active",
        dataIndex: "is_active",
        width: 100
    },
    {
        key: "is_admin",
        title: "Is admin",
        dataIndex: "is_admin",
        width: 100
    },
    {
        key: "action",
        title: "",
        fixed: "right",
        width: 90
    }
];
