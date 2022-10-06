import * as React from "react";
import { useEffect, useState } from "react";
import { Row, Col, Button, Table } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Pagination, { defaultLinks } from "utils/components/table/Pagination";
import SearchInput from "utils/components/table/SearchInput";
import Utils from "utils/Utils";
import { urls, labels, messages } from "./config";
import {listServiceSt} from "./states";
import { useSetRecoilState } from "recoil";

export default function StayTable() {
    const [init, setInit] = useState(true);
    const [list, setList] = useState([]);
    const [ids, setIds] = useState([]);
    const [links, setLinks] = useState(defaultLinks);

    const setListService = useSetRecoilState(listServiceSt)

    const convertIdToLabel = (data) => {
        Utils.idToLabel(data.items, data.extra.list_service, "service");
        Utils.idToLabel(data.items, data.extra.list_member, "member");
    };

    const getList =
        (showLoading = true) =>
        (url = "", params = {}) => {
            showLoading && Utils.toggleGlobalLoading();
            Utils.apiCall(url ? url : urls.crud, params)
                .then((resp) => {
                    setLinks(resp.data.links);
                    convertIdToLabel(resp.data);
                    setListService(resp.data.extra.list_service);
                    setList(Utils.appendKey(resp.data.items));
                })
                .finally(() => {
                    setInit(false);
                    showLoading && Utils.toggleGlobalLoading(false);
                });
        };
    const searchList = (keyword) => {
        getList()("", keyword ? { search: keyword } : {});
    };

    useEffect(() => {
        getList(false)();
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

    const columns = [
        {
            key: "id",
            title: labels.id,
            dataIndex: "id",
            width: 50,
        },
        {
            key: "service",
            title: labels.service,
            dataIndex: "service",
            width: 120,
        },
        {
            key: "member",
            title: labels.member,
            dataIndex: "member",
            width: 120,
        },
        {
            key: "member_name",
            title: labels.memberName,
            dataIndex: "member_name",
            width: 120,
        },
        {
            key: "phone_number",
            title: labels.phoneNumber,
            dataIndex: "phone_number",
            width: 120,
        },
        {
            key: "email",
            title: labels.email,
            dataIndex: "email",
            width: 120,
        },
        {
            key: "deleted_at",
            title: labels.deletedAt,
            dataIndex: "deleted_at",
            width: 120,
        },
        {
            key: "date",
            title: labels.date,
            dataIndex: "date",
            width: 120,
        },
        {
            key: "time",
            title: labels.time,
            dataIndex: "time",
            width: 120,
        },
        {
            key: "participants",
            title: labels.participants,
            dataIndex: "participants",
            width: 120,
        },
        {
            key: "party_size",
            title: labels.partySize,
            dataIndex: "party_size",
            width: 120,
        },
        {
            key: "adult",
            title: labels.adult,
            dataIndex: "adult",
            width: 120,
        },
        {
            key: "childs",
            title: labels.childs,
            dataIndex: "childs",
            width: 120,
        },
        {
            key: "check_in",
            title: labels.checkIn,
            dataIndex: "check_in",
            width: 120,
        },
        {
            key: "check_out",
            title: labels.checkOut,
            dataIndex: "check_out",
            width: 120,
        },
        {
            key: "action",
            title: "",
            fixed: "right",
            width: 90,
            render: (_text, record) => (
                <span>
                    <Button
                        danger
                        type="default"
                        htmlType="button"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => onDelete(record.id)}
                    />
                </span>
            )
        }
    ];

    const rowSelection = {
        onChange: (ids) => {
            setIds(ids);
        }
    };

    return (
        <div>
            <Row style={{marginBottom: "30px"}} >
                <Col span={12} >
                <SearchInput onChange={searchList} />
                </Col>
                <Col span={12} className="right">
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
                    ...rowSelection
                }}
                columns={columns}
                dataSource={list}
                loading={init}
                scroll={{ x: 1000 }}
                pagination={false}
            />
            <Pagination next={links.next} prev={links.previous} onChange={getList()} />
        </div>
    );
}

BookingTable.displayName = "BookingTable";
