import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Card, Button, notification } from "antd";
import Utils from "utils/Utils";
import Form from "./Form";

const styles = {
  wrapper: {
    marginTop: 20,
  },
};
export default function Login() {
  const history = useHistory();
  const navigateTo = Utils.navigateTo(history);

  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  useEffect(() => {
    Utils.getToken() && navigateTo();
  }, []);

  function onLogin(data) {
    const nextUrl = window.location.href.split("next=")[1] || "";
    if (data.token) {
      Utils.setStorage("auth", data);
      navigateTo(nextUrl);
    } else {
      openNotification("error", "Error", "Account does not exist !");
    }
  }

  return (
    <>
      <Row>
        <Col
          xs={{ span: 24 }}
          md={{ span: 12, offset: 6 }}
          lg={{ span: 8, offset: 8 }}
        >
          <Card title="Đăng nhập" style={styles.wrapper}>
            <Form onChange={onLogin}>
              <>
                <Button
                  type="link"
                  // onClick={() => ResetPwdDialog.toggle()}
                >
                  Quên mật khẩu
                </Button>
              </>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}
