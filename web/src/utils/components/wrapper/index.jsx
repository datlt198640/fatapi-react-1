import * as React from "react";
import { useState } from "react";
import { useHistory, useLocation, NavLink } from "react-router-dom";
import { Layout, Menu, Row, Col, Popconfirm } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  SettingFilled,
  UsergroupAddOutlined,
  CheckOutlined,
  CalendarOutlined,
  AccountBookOutlined,
} from "@ant-design/icons";
import { LOGO_TEXT } from "utils/constants";
import Utils from "utils/Utils";
import "./styles.css";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const text = "Are you sure to log out?";
/**
 * Wrapper.
 *
 * @param {Object} props
 * @param {ReactElement} props.children
 */
export default function Wrapper({ children }) {
  const history = useHistory();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const visibleMenus = Utils.getVisibleMenus();

  const logout = Utils.logout(history);

  /**
   * processSelectedKey.
   *
   * @param {string} pathname
   * @returns {string}
   */
  const processSelectedKey = (pathname) => {
    if (pathname.startsWith("/staff")) return "/staff";
    return pathname;
  };

  return (
    <Layout className="wrapper-container" style={{ height: "120vh" }}>
      <Sider
        trigger={null}
        breakpoint="lg"
        collapsedWidth="80"
        collapsible
        collapsed={collapsed}
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            width: "100%",
            height: "10vh",
            fontSize: "30px",
          }}
        >
          RAY
        </div>
        {/* <Divider /> */}
        <Menu
          className="sidebar-nav"
          selectedKeys={[processSelectedKey(location.pathname)]}
          theme="dark"
          mode="inline"
          defaultOpenKeys={["company", "", "ccf", "campaign", "survey"]}
        >
          <Menu.Item key="/" style={{ margin: "30px auto" }}>
            <NavLink exact to="/">
              <UserOutlined />
              <MenuLabel collapsed={collapsed} label="Profile" />
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/member" style={{ margin: "30px auto" }}>
            <NavLink to="/member">
              <TeamOutlined />
              <MenuLabel collapsed={collapsed} label="Nhân viên" />
            </NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-header" style={{ padding: 0 }}>
          <Row>
            <Col span={12}>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: toggle,
                }
              )}
            </Col>
            <Col span={12} className="right" style={{ paddingRight: 20 }}>
              <Popconfirm
                placement="left"
                title={text}
                onConfirm={logout}
                okText="Yes"
                cancelText="No"
              >
                <span className="pointer">
                  <span>{Utils.getStorageObj("auth").fullname}</span>
                  &nbsp;&nbsp;
                  <LogoutOutlined />
                </span>
              </Popconfirm>
            </Col>
          </Row>
        </Header>
        <Content
          className="site-layout-content"
          style={{ padding: "20px 20px" }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

/**
 * MenuLabel.
 *
 * @param {Object} props
 * @param {boolean} props.collapsed
 * @param {string} props.label
 * @returns {ReactElement}
 */
function MenuLabel({ collapsed, label }) {
  if (collapsed) return null;
  return <span>&nbsp;{label}</span>;
}
