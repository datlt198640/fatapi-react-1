import * as React from "react";
import { useEffect, useState } from "react";
import { Row, Col, Button, Table } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Pagination, { defaultLinks } from "utils/components/table/Pagination";
import SearchInput from "utils/components/table/SearchInput";
import Utils from "utils/Utils";
import Dialog from "./dialog";
import { urls, columns, messages } from "./config";

export default function RoleTable() {
    const [init, setInit] = useState(true);
    const [list, setList] = useState([]);
    const [ids, setIds] = useState([]);
    const [links, setLinks] = useState(defaultLinks);
    const [pems, setPems] = useState([]);

    const getList = (url = "", params = {}) => {
        Utils.apiCall(url ? url : urls.crud, params)
            .then((resp) => {
                setLinks(resp.data.links);
                setList(Utils.appendKey(resp.data.items));
                setPems(resp.data.extra.permissions);
            })
            .finally(() => {
                setInit(false);
            });
    };

    const searchList = (keyword) => {
        getList("", keyword ? { search: keyword } : {});
    };

    useEffect(() => {
        getList();
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
        <span>
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
        </span>
    );

    const rowSelection = {
        onChange: (ids) => {
            setIds(ids);
        }
    };

    return (
        <div>
            <Row>
                <Col span={12}>
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
                <Col span={12} className="right">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => Dialog.toggle()}
                    >
                        Thêm mới
                    </Button>
                </Col>
            </Row>

            <SearchInput onChange={searchList} />

            <Table
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection
                }}
                columns={columns}
                dataSource={list}
                loading={init}
                scroll={{ x: 1000 }}
                pagination={false}
            />
            <Pagination next={links.next} prev={links.previous} onChange={getList} />
            <Dialog pems={pems} onChange={onChange} />
        </div>
    );
}

RoleTable.displayName = "RoleTable";
