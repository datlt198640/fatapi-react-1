import { useRecoilValue } from "recoil";
import { Form, Input, Select } from "antd";
import Utils from "utils/Utils";
import FormUtils from "utils/FormUtils";
import { urls, formLabels, emptyRecord } from "../config";
import { listGroupSt } from "../states";

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

const formName = "StaffForm";

/**
 * StaffForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 * @param {Object} props.formRef
 */
export default function StaffForm({ data, onChange }) {
  const [form] = Form.useForm();
  const listGroup = useRecoilValue(listGroupSt);

  const initialValues = Utils.isEmpty(data) ? emptyRecord : { ...data };
  const id = initialValues.id;
  const endPoint = id ? `${urls.crud}${id}` : urls.crud;
  const method = id ? "put" : "post";

  const formAttrs = {
    fullname: {
      name: "fullname",
      label: formLabels.fullname,
      rules: [FormUtils.ruleRequired()],
    },
    phone_number: {
      name: "phone_number",
      label: formLabels.phone_number,
      rules: [FormUtils.ruleRequired()],
    },
    email: {
      name: "email",
      label: formLabels.email,
      rules: [FormUtils.ruleRequired()],
    },
    password: {
      name: "password",
      label: formLabels.password,
    },
    gender: {
      name: "gender",
      label: formLabels.gender,
    },
  };

  return (
    <Form
      form={form}
      name={formName}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      initialValues={{ ...initialValues }}
      onFinish={(payload) =>
        FormUtils.submit(endPoint, payload, method)
          .then((data) => onChange(data, id))
          .catch(FormUtils.setFormErrors(form))
      }
    >
      <Form.Item {...formAttrs.fullname}>
        <Input />
      </Form.Item>
      <Form.Item {...formAttrs.phone_number}>
        <Input />
      </Form.Item>
      <Form.Item {...formAttrs.email}>
        <Input />
      </Form.Item>
      <Form.Item {...formAttrs.password}>
        <Input.Password />
      </Form.Item>
      <Form.Item {...formAttrs.gender}>
        <Select>
          <Option value="0">Female</Option>
          <Option value="1">Male</Option>
          <Option value="2">  </Option>
        </Select>
      </Form.Item>
    </Form>
  );
}

StaffForm.displayName = formName;
StaffForm.formName = formName;
