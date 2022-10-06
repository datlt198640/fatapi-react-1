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
    id: 0,
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
    email: "Email",
    password: "Password",
    fullName: "Full name",
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
        dataIndex: "email"
    },
    {
        key: "is_active",
        title: "Is active",
        dataIndex: "is_active"
    },
    {
        key: "is_admin",
        title: "Is admin",
        dataIndex: "is_admin"
    },
    {
        key: "created_at",
        title: "Created at",
        dataIndex: "created_at",
        width: 100
    },
    {
        key: "updated_at",
        title: "Updated at",
        dataIndex: "updated_at",
        width: 100
    },
    {
        key: "action",
        title: "",
        fixed: "right",
        width: 90
    }
];
