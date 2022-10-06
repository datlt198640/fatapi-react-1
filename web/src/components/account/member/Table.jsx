import * as React from "react";
import { useEffect, useState } from "react";
import { Row, Col, Button, Table, Typography } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, FileExcelFilled, EyeOutlined } from "@ant-design/icons";
import Pagination, { defaultLinks } from "utils/components/table/Pagination";
import SearchInput from "utils/components/table/SearchInput";
import Utils from "utils/Utils";
import Dialog from "./dialog";
import { urls, columns, messages } from "./config";


const {Text} = Typography

export default function MemberTable() {
  const [init, setInit] = useState(true);
  const [list, setList] = useState([]);
  const [ids, setIds] = useState([]);
  const [links, setLinks] = useState(defaultLinks);

  // const convertIdToLabel = (data) => {

  //   const genderValue =  [
  //       {value: 0, label: 'Male'},
  //       {value: 1, label: 'Female'},
  //   ]

  //   Utils.idToLabel(data.items, data.extra.list_membership_type, "membership_type");
  //   Utils.idToLabel(data.items, genderValue, "gender");
  // };

  console.log("list", list)

  const getList =
    (showLoading = false) =>
    (url = "", params = {}) => {
      showLoading && Utils.toggleGlobalLoading();
      Utils.apiCall(url ? url : urls.crud, params)
        .then((resp) => {
          // setLinks(resp.data.links);
          // convertIdToLabel(resp.data)
          setList(Utils.appendKey(resp.data));
        })
        .finally(() => {
          setInit(false);
          showLoading && Utils.toggleGlobalLoading(false);
        });
    };

  const searchList = (keyword) => {
    getList(true)("", keyword ? { search: keyword } : {});
  };

  useEffect(() => {
    getList()();
  }, []);

  const onDelete = (id) => {
    const r = window.confirm(messages.deleteOne);
    if (!r) return;

    Utils.toggleGlobalLoading(true);
    Utils.apiCall(`${urls.crud}${id}`, {}, "delete")
      .then(() => {
        setList([...list.filter((item) => item.id !== id)]);
      })
      .finally(() => Utils.toggleGlobalLoading(false));
  };

  const onBulkDelete = (ids) => {
    const r = window.confirm(messages.deleteMultiple);
    if (!r) return;

    Utils.toggleGlobalLoading(true);
    Utils.apiCall(`${urls.crud}?ids=${ids.join(",")}`, {}, "delete")
      .then(() => {
        setList([...list.filter((item) => !ids.includes(item.id))]);
      })
      .finally(() => Utils.toggleGlobalLoading(false));
  };

  const onChange = (data, id) => {
    if (!id) {
      setList([{ ...data, key: data.id }, ...list]);
    } else {
      const index = list.findIndex((item) => item.id === id);
      data.key = data.id;
      list[index] = data;
      setList([...list]);
    }
  };

  columns[columns.length - 1].render = (_text, record) => (
    <div>
      <div style={{ marginBottom: 7 }}>
        <Button
          type="default"
          htmlType="button"
          icon={<EditOutlined />}
          size="small"
          onClick={() => Dialog.toggle(true, record.id)}
        />
        &nbsp;&nbsp;
        <Button
          danger
          type="default"
          htmlType="button"
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => onDelete(record.id)}
        />
      </div>
    </div>
  );

  const rowSelection = {
    onChange: (ids) => {
      setIds(ids);
    },
  };

  return (
    <div>
      <Row style={{ marginBottom: "30px" }}>
        <Col span={12}>
          <Row justify="start" align="middle">
            <Text strong style={{ width: "4em", minWidth: "4em" }}>
              {" "}
              Search:{" "}
            </Text>
            <Col span={19}>
              <SearchInput
                onChange={searchList}
                placeHolder="Search for member's name, email, phone number, and email"
              />
            </Col>
          </Row>
        </Col> 
        <Col span={12} className="right">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => Dialog.toggle()} style={{ marginRight: "1vw" }}>
            Thêm mới
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            disabled={!ids.length}
            onClick={() => onBulkDelete(ids)}
          >
            Xoá chọn
          </Button>
        </Col>
      </Row>

      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={list}
        loading={init}
        scroll={{ x: 1000 }}
        pagination={false}
      />
      {/* <Pagination next={links.next} prev={links.previous} onChange={getList(true)} /> */}
      <Dialog onChange={onChange} />
    </div>
  );
}

MemberTable.displayName = "MemberTable";
