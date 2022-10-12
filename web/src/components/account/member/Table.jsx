import * as React from "react";
import { useEffect, useState } from "react";
import { Row, Col, Button, Table, Typography, Upload } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ImportOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import Pagination, { defaultLinks } from "utils/components/table/Pagination";
import SearchInput from "utils/components/table/SearchInput";
import Utils from "utils/Utils";
import Dialog from "./dialog";
import { urls, columns, messages, urlMultiple } from "./config";

const { Text } = Typography;

export default function MemberTable() {
  const [init, setInit] = useState(true);
  const [list, setList] = useState([]);
  const [ids, setIds] = useState([]);
  const [links, setLinks] = useState(defaultLinks);
  const [isExporting, setIsExporting] = useState(false);
  const [rowUID, setRowUID] = useState([]);

  const props = {
    multiple: false,
    disableUpload: true,
    showUploadList: false,
    onChange({ file }) {
      const formData = new FormData();
      formData.append("file", file.originFileObj);
      Utils.apiCall(
        "http://0.0.0.0:8000/api/v1/user/import-user/",
        formData,
        "post"
      )
        .then((response) => {
          console.log("response", response);
        })
        .finally(() => Utils.toggleGlobalLoading(false));
    },
  };

  const convertBoolVal = (data) => {
    return data.map((item) => {
      if (item.is_active) {
        item["is_active"] = "active";
      } else {
        item["is_active"] = "inactive";
      }
      if (item.is_admin) {
        item["is_admin"] = "admin";
      } else {
        item["is_admin"] = "user";
      }
    });
  };

  const getList =
    (showLoading = false) =>
    (url = "", params = {}) => {
      showLoading && Utils.toggleGlobalLoading();
      Utils.apiCall(url ? url : urls.crud, params)
        .then((resp) => {
          setLinks(resp.data.links);
          convertBoolVal(resp.data.items);
          setList(Utils.appendKey(resp.data.items));
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
        setList([...list.filter((item) => item._id !== id)]);
      })
      .finally(() => Utils.toggleGlobalLoading(false));
  };

  const onBulkDelete = (rowUID) => {
    const r = window.confirm(messages.deleteMultiple);
    if (!r) return;

    Utils.toggleGlobalLoading(true);
    Utils.apiCall(`${urlMultiple.deleteList}${rowUID.join(",")}`, {}, "delete")
      .then(() => {
        setList([...list.filter((item) => !rowUID.includes(item._id))]);
      })
      .finally(() => Utils.toggleGlobalLoading(false));
  };

  const onChange = (data, id) => {
    if (!id) {
      setList([{ ...data, key: data._id }, ...list]);
    } else {
      const index = list.findIndex((item) => item._id === id);
      data.key = data._id;
      list[index] = data;
      setList([...list]);
    }
    getList()();
  };

  const onExport = async () => {
    setIsExporting(true);
    try {
      await Utils.handleDownloadLink(
        "http://0.0.0.0:8000/api/v1/user/download-all/"
      );
    } catch (e) {
      console.error(e);
    }

    setIsExporting(false);
  };

  columns[columns.length - 1].render = (_text, record) => (
    <div>
      <div style={{ marginBottom: 7 }}>
        <Button
          type="default"
          htmlType="button"
          icon={<EditOutlined />}
          size="small"
          onClick={() => Dialog.toggle(true, record._id)}
        />
        &nbsp;&nbsp;
        <Button
          danger
          type="default"
          htmlType="button"
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => onDelete(record._id)}
        />
      </div>
    </div>
  );

  const rowSelection = {
    onChange: (ids, selectedRows) => {
      const uids = [];
      setIds(ids);
      selectedRows.map((selectedRow) => uids.push(selectedRow._id));
      setRowUID(uids);
    },
  };

  return (
    <div>
      <Row style={{ marginBottom: "30px" }}>
        <Col span={12}>
          <Row justify="start" align="middle" style={{ marginBottom: 10 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => Dialog.toggle()}
              style={{ marginRight: "1vw" }}
            >
              Add
            </Button>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              disabled={!ids.length}
              onClick={() => onBulkDelete(rowUID)}
            >
              Delete
            </Button>
          </Row>
          <Row justify="start" align="middle">
            <Text strong style={{ width: "4em", minWidth: "4em" }}>
              {" "}
              Search:{" "}
            </Text>
            <Col span={19}>
              <SearchInput
                onChange={searchList}
                placeHolder="Search for member's full name, phone number, and email"
              />
            </Col>
          </Row>
        </Col>
        <Col span={12} className="right">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => Dialog.toggle()}
            style={{ marginRight: "1vw" }}
          >
            Add
          </Button>
          <Upload {...props}>
            <Button
              type="primary"
              icon={<ImportOutlined />}
              style={{ marginRight: "1vw" }}
            >
              Import
            </Button>
          </Upload>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => onExport()}
          >
            Export
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
      <Pagination
        next={links.next}
        prev={links.previous}
        onChange={getList(true)}
      />
      <Dialog onChange={onChange} />
    </div>
  );
}

MemberTable.displayName = "MemberTable";
