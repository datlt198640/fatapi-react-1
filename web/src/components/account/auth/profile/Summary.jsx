import { Row, Col } from "antd";
import Utils from "utils/Utils";


export default function ProfileSummary(data) {
  const authData = Utils.getStorageObj("auth");

  return (
    <div>
      <Row style={{ margin: "20px 0" }}>
        <Col span={6}>
          <strong>Username</strong>
        </Col>
        <Col span={18}>{data.username}</Col>
      </Row>
      <Row style={{ margin: "20px 0" }}>
        <Col span={6}>
          <strong>Email</strong>
        </Col>
        <Col span={18}>{data.email}</Col>
      </Row>
      <Row style={{ margin: "20px 0" }}>
        <Col span={6}>
          <strong>Fullname</strong>
        </Col>
        <Col span={18}>{data.full_name}</Col>
      </Row>
      <Row style={{ margin: "20px 0" }}>
        <Col span={6}>
          <strong>Type</strong>
        </Col>
        <Col span={18}>{authData.is_admin ? "admin" : "normal"}</Col>
      </Row>
    </div>
  );
}
ProfileSummary.displayName = "ProfileSummary";
