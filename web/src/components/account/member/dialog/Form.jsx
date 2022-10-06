import { useRecoilValue } from "recoil";
import { Form, Input } from "antd";
import Utils from "utils/Utils";
import FormUtils from "utils/FormUtils";
import SelectInput from "utils/components/ant_form/input/SelectInput";
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
  // const listGroup = useRecoilValue(listGroupSt);

  const initialValues = Utils.isEmpty(data) ? emptyRecord : { ...data };
  const id = initialValues.id;
  const endPoint = id ? `${urls.crud}${id}` : urls.crud;
  const method = id ? "put" : "post";

  const formAttrs = {
    memberUID: {
      name: "member_remote_id",
      label: formLabels.memberUID,
      rules: [FormUtils.ruleRequired()],
    },
    phone_number: {
      name: "phone_number",
      label: formLabels.phone_number,
    },
    email: {
      name: "email",
      label: formLabels.email,
    },
    password: {
      name: "password",
      label: formLabels.password,
      rules: [FormUtils.ruleRequired()],
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
      <Form.Item {...formAttrs.email}>
        <Input />
      </Form.Item>
      <Form.Item {...formAttrs.phone_number}>
        <Input />
      </Form.Item>
      <Form.Item {...formAttrs.memberUID}>
        <Input />
      </Form.Item>
      <Form.Item {...formAttrs.password}>
        <Input.Password />
      </Form.Item>
      {/* <Form.Item {...formAttrs.groups}>
        <SelectInput options={listGroup} mode="multiple" />
      </Form.Item> */}
    </Form>
  );
}

MemberForm.displayName = formName;
MemberForm.formName = formName;
