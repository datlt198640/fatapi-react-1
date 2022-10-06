import React, { useState } from "react";
import { Drawer, Avatar, Divider, Col, Row, Typography, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./style.module.css";

const { Text, Title } = Typography;

export const DrawerAnt = (props) => {
  const title = `${props.data.fullName}'s Profile`;
  return (
    <>
      <Drawer
        title={title}
        closable={false}
        placement={props.placement}
        onClose={props.onClose}
        visible={props.visible}
        width={400}
      >
        <Row justify="center" align="middle" style={{ margin: "10px auto" }} >
          <Avatar src={props.data.avatar} size={{ xs: 64, sm: 72, md: 80, lg: 104, xl: 120, xxl: 140 }} icon={<UserOutlined />} />
        </Row>
        <Row justify="center" align="middle" >
          <Col>
            <Title level={2} > {props.data.fullName}</Title>
          </Col>
        </Row>
        <Row justify="center" align="middle" style={{ marginBottom: "10px" }} >
          <Col>
            <Title level={3} > {props.data.membership_type}</Title>
          </Col>
        </Row>
        <Divider />
        <Title level={4}>About</Title>
        <ul className={styles.ul}>
          <li>
            <Text>Gender: {props.data.gender}</Text>
          </li>
        </ul>
        <ul>
          <li>
            <Text>Date of birth: {props.data.dob}</Text>
          </li>
        </ul>
        <ul className={styles.ul}>
          <li>
            <Text>Occupation: {props.data.occupation}</Text>
          </li>
        </ul>
        <ul>
          <li>
            <Text>Address: {props.data.address}</Text>
          </li>
        </ul>
        <Divider />
        <Title level={4}>Contact</Title>
        <ul>
          <li>
            <Text>Email: {props.data.email}</Text>
          </li>
        </ul>
        <ul>
          <li>
            <Text>Phone number: {props.data.phoneNumber}</Text>
          </li>
        </ul>
        <Divider />
        <Title level={4}>Duration</Title>
        <ul>
          <li>
            <Text>Member since: {props.data.register_date}</Text>
          </li>
        </ul>
        <ul>
          <li>
            <Text>Expire at: {props.data.expire_date}</Text>
          </li>
        </ul>
      </Drawer>
    </>
  );
};
