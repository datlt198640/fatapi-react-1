import { useState } from "react";
import { Form, Input, Checkbox } from "antd";
import Utils from "utils/Utils";
import FormUtils from "utils/FormUtils";
import { urls, formLabels, emptyRecord } from "../config";
// import { listGroupSt } from "../states";

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

const formName = "MemberForm";

/**
 * MemberForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 * @param {Object} props.formRef
 */
export default function MemberForm({ data, onChange }) {
  const [form] = Form.useForm();

  const [isChecked, setIsChecked] = useState(false);

  const onCheckbox = (e) => {
    setIsChecked(e.target.checked);
  };

  const initialValues = Utils.isEmpty(data) ? emptyRecord : { ...data };
  const id = initialValues._id;

  const endPoint = id ? `${urls.crud}${id}` : urls.crud;
  const method = id ? "put" : "post";

  const onSubmit = (payload) => {
    payload.is_admin = isChecked;
    FormUtils.submit(endPoint, payload, method)
      .then((data) => onChange(data, id))
      .catch(FormUtils.setFormErrors(form));
  };

  const formAttrs = {
    username: {
      name: "username",
      label: formLabels.username,
      rules: [FormUtils.ruleRequired()],
    },
    email: {
      name: "email",
      label: formLabels.email,
    },
    fullName: {
      name: "full_name",
      label: formLabels.full_name,
    },
    password: {
      name: "password",
      label: formLabels.password,
      rules: [FormUtils.ruleRequired()],
    },
    isAdmin: {
      name: "is_admin",
      label: formLabels.isAdmin,
      checked: initialValues.is_admin,
    },
  };

  return (
    <Form
      form={form}
      name={formName}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      initialValues={{ ...initialValues }}
      onFinish={onSubmit}
    >
      {!id && (
        <Form.Item {...formAttrs.username}>
          <Input />
        </Form.Item>
      )}
      <Form.Item {...formAttrs.email}>
        <Input />
      </Form.Item>
      <Form.Item {...formAttrs.fullName}>
        <Input />
      </Form.Item>
      {!id && (
        <Form.Item {...formAttrs.password}>
          <Input.Password />
        </Form.Item>
      )}
      <Form.Item {...formAttrs.isAdmin}>
        <Checkbox onChange={onCheckbox} checked={isChecked} />
      </Form.Item>
    </Form>
  );
}

MemberForm.displayName = formName;
MemberForm.formName = formName;
