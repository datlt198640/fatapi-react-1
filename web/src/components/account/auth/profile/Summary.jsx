import { Row, Col } from "antd";

export default function ProfileSummary(data) {
  return (
    <div>
      <Row style={{ margin: "20px 0" }}>
        <Col span={6}>
          <strong>Email</strong>
        </Col>
        <Col span={18}>{data.email}</Col>
      </Row>
      <Row style={{ margin: "20px 0" }}>
        <Col span={6}>
          <strong>Số điện thoại</strong>
        </Col>
        <Col span={18}>{data.phone_number}</Col>
      </Row>
      <Row style={{ margin: "20px 0" }}>
        <Col span={6}>
          <strong>Họ và tên</strong>
        </Col>
        <Col span={18}>{data.fullname}</Col>
      </Row>
    </div>
  );
}
ProfileSummary.displayName = "ProfileSummary";
