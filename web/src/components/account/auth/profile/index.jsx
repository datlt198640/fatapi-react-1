import { useEffect, useState } from "react";
import { Divider, Button } from "antd";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import Wrapper from "utils/components/wrapper";
import PageHeading from "utils/components/PageHeading";
import Utils from "utils/Utils";
import { accountUrls, messages } from "../config";
import Sumarry from "./Summary";
import UpdateProfile from "./update_profile";
import ChangePwd from "./change_pwd";

export const emptyProfile = {
    id: 0,
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    title_label: "",
    list_parent: []
};

export default function Profile() {
    const [profileData, setProfileData] = useState(emptyProfile);
    const [profileUrl, setProfileUrl] = useState("");
    useEffect(() => {
        const authData = Utils.getStorageObj("auth");
        const accountType = authData.account_type;
        const profileUrl = accountUrls[accountType]?.profile;
        setProfileUrl(profileUrl);
        Utils.apiCall(profileUrl).then((resp) => {
            setProfileData(resp.data);
        });
    }, []);
    return (
        <Wrapper>
            <>
                <PageHeading>
                    <>{messages.heading}</>
                </PageHeading>
                <div className="content">
                    <Sumarry {...profileData} />
                    <Divider />
                    <Button
                        htmlType="button"
                        type="primary"
                        icon={<UserOutlined />}
                        onClick={() => UpdateProfile.toggle(true, profileData)}
                    >
                        Update Profile
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                        htmlType="button"
                        icon={<KeyOutlined />}
                        onClick={() => ChangePwd.toggle()}
                    >
                        Change Password
                    </Button>
                    <UpdateProfile
                        profileUrl={profileUrl}
                        onChange={(data) => setProfileData(data)}
                    />
                    <ChangePwd />
                </div>
            </>
        </Wrapper>
    );
}

Profile.displayName = "Profile";
