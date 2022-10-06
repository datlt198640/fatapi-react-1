import * as React from "react";
import { useSetRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { Row, Col, Button, Table, message } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import Pagination, { defaultLinks } from "utils/components/table/Pagination";
import SearchInput from "utils/components/table/SearchInput";
import Utils from "utils/Utils";
import Dialog from "./dialog";
import {
    positionTreeSt,
    listGroupSt,
    staffTypeOptionsSt,
    titleLevelOptionsSt
} from "./states";
import { urls, titleLevelEvaluateUrls, columns, messages } from "./config";

export default function StaffTable() {
    const [init, setInit] = useState(true);
    const [list, setList] = useState([]);
    const [ids, setIds] = useState([]);
    const [links, setLinks] = useState(defaultLinks);

    const setPositionTree = useSetRecoilState(positionTreeSt);
    const setListGroup = useSetRecoilState(listGroupSt);
    const setStaffTypeOptions = useSetRecoilState(staffTypeOptionsSt);
    const setTitleLevelOptions = useSetRecoilState(titleLevelOptionsSt);

    const getList =
        (showLoading = false) =>
        (url = "", params = {}) => {
            showLoading && Utils.toggleGlobalLoading();
            Utils.apiCall(url ? url : urls.crud, params)
                .then((resp) => {
                    setLinks(resp.data.links);
                    setList(Utils.appendKey(resp.data.items));
                    setPositionTree(resp.data.extra.position_tree);
                    setListGroup(resp.data.extra.list_group);
                    setStaffTypeOptions(resp.data.extra.type_options);
                    setTitleLevelOptions(resp.data.extra.title_level_options);
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

    function createEvaluate(id) {
        const r = window.confirm(
            "Bạn có muốn tạo phiên đánh giá cho bậc chức danh này?"
        );
        if (!r) return;
        Utils.toggleGlobalLoading(true);
        Utils.apiCall(titleLevelEvaluateUrls.crud, { receiver: id }, "post")
            .then((resp) => {
                const { data } = resp;
                const index = list.findIndex((item) => item.id === data.id);
                data.key = data.id;
                list[index] = data;
                setList([...list]);
            })
            .catch((err) => {
                const errors = err.response.data;
                message.error(errors.detail);
            })
            .finally(() => Utils.toggleGlobalLoading(false));
    }

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
        }
    };

    const uploadProps = {
        showUploadList: false,
        name: "file",
        beforeUpload: (file) => {
            Utils.toggleGlobalLoading();
            Utils.apiCall(urls.upload, { file }, "post")
                .then(() => getList()())
                .catch(() => alert("Không thể upload, bạn vui lòng thử lại sau"))
                .finally(() => Utils.toggleGlobalLoading(false));
            return false;
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
            <Pagination
                next={links.next}
                prev={links.previous}
                onChange={getList(true)}
            />
            <Dialog onChange={onChange} />
        </div>
    );
}

StaffTable.displayName = "StaffTable";
