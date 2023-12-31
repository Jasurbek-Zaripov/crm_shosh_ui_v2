import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import AdditServiesComponent from "../../../components/admin/addit_services/index.jsx";
import UpdateOrderUser from "../../../components/admin/update_order_user/index.jsx";
import Sidebar from "../../../components/sidebar/index.jsx";
import {
  GetRooms,
  OrderGetById,
  OrderUpdateById,
} from "../../../service/axios.service.ts";

import { dataSidebarDirector } from "../../director/sidebar-data";
import { dataSidebarManager } from "../../manager/sidebar-data";
import { dataSidebar } from "../sidebar-data";
import "./style.css";

import calendarExt from "dayjs/plugin/calendar.js";
import localDateExt from "dayjs/plugin/localeData.js";
import weekDaysExt from "dayjs/plugin/weekday.js";
import RoomTab from "../../../components/admin/room/room-tab/roomTab.jsx";

dayjs.extend(weekDaysExt);
dayjs.extend(localDateExt);
dayjs.extend(calendarExt);

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const formRules = [{ required: true }];
const HH = (n) => String(n).padStart(2, "0");
const dateFormat = "YYYY-MM-DD HH:mm";

export default function UpdateOrder() {
  const [messageApi, contextHolder] = message.useMessage();
  const [refreshOrder, setRefreshOrder] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [order, setOrder] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const { t } = useTranslation();
  const { id: paramOrderId } = useParams();
  const [form] = Form.useForm();

  const successMsg = () =>
    messageApi.open({
      type: "success",
      content: "Success",
    });
  const errorMsg = () =>
    messageApi.open({
      type: "error",
      content: "Error",
    });

  const dayInMs = 24 * 60 * 60 * 1000;
  const changedDate = Form.useWatch("date", form);
  if (changedDate?.length == 2) {
    form.setFieldsValue({
      number_night:
        Math.ceil(
          (new Date(changedDate[1].$d).getTime() -
            new Date(changedDate[0].$d).getTime()) /
            dayInMs
        ) + 1,
    });
  }

  useEffect(() => {
    if (!refreshOrder) return;

    setLoadingForm(true);
    OrderGetById(paramOrderId)
      .catch(() => errorMsg())
      .then(([resOrder]) => {
        setOrder(resOrder);
        GetRooms()
          .catch(() => errorMsg())
          .then((resRoom) => {
            setLoadingForm(false);
            setRefreshOrder(false);
            successMsg();
            setRooms(resRoom);
          });
      });
  }, [refreshOrder]);

  const onFinish = (val) => {
    val.arrival_date = dayjs(val.date[0]).format(dateFormat);
    val.departure_date = dayjs(val.date[1]).format(dateFormat);
    val.date = undefined;
    val.definition = order.rooms.definition;
    val.sale = 0;
    val.booking = val.total_payable;
    val.paid = val.status_payment === "Долговое" ? 0 : val.total_payable;
    val.debt = val.status_payment === "Оплачено" ? 0 : val.total_payable;
    setLoadingForm(true);
    OrderUpdateById(paramOrderId, val)
      .then(() => successMsg())
      .catch(() => errorMsg())
      .finally(() => setLoadingForm(false));
  };

  const roomOptions = rooms
    .filter((item) => item)
    .map((item) => ({
      id: item.id,
      key: item.id,
      label: `${HH(item.rooms)} | ${item.type} | ${HH(item.count)}`,
      value: item.id,
    }));

  const data = JSON.parse(window.localStorage.getItem("AuthDataUser"));
  let items = null;
  switch (data?.role) {
    case "Admin":
      items = dataSidebar;
      break;
    case "manager":
      items = dataSidebarManager;
      break;
    case "director":
      items = dataSidebarDirector;
      break;
    default:
  }

  return (
    <Sidebar items={items}>
      <div>
        {contextHolder}
        {order && (
          <Form
            layout={"vertical"}
            form={form}
            className={"instant_booking_box_shadow"}
            name="instant-booking"
            onFinish={onFinish}
          >
            <Row gutter={[40, 0]}>
              <Col span={8}>
                <Form.Item
                  name="rooms"
                  initialValue={order?.rooms?.id}
                  rules={formRules}
                  label={t("application_add.0")}
                >
                  <Select options={roomOptions} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="date"
                  initialValue={[
                    dayjs(order?.arrival_date),
                    dayjs(order?.departure_date),
                  ]}
                  rules={formRules}
                  label={t("application_add.9")}
                >
                  <RangePicker
                    showTime={{ format: "HH:mm" }}
                    format={dateFormat}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="number_night"
                  initialValue={order?.number_night}
                  label={t("application_add.1")}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="type_payment"
                  initialValue={order?.type_payment}
                  label={t("application_add.3")}
                  rules={formRules}
                >
                  <Select
                    options={[
                      { value: "Наличные", label: t("application_add.35") },
                      { value: "Перечисление", label: t("application_add.34") },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="status_payment"
                  initialValue={order?.status_payment}
                  label={t("AdditServies.16")}
                  rules={formRules}
                >
                  <Select
                    options={[
                      {
                        value: "Долговое",
                        label: t("AdditServies.23"),
                      },
                      {
                        value: "Оплачено",
                        label: t("AdditServies.24"),
                      },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="country"
                  initialValue={order?.country}
                  label={t("application_add.15")}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="count_users"
                  initialValue={order?.count_users}
                  label={t("application_add.12")}
                >
                  <Input type={"number"} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="company"
                  initialValue={order?.company}
                  label={t("application_add.13")}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="phone"
                  initialValue={order?.phone}
                  rules={formRules}
                  label={t("application_add.16")}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="total_payable"
                  initialValue={order?.total_payable}
                  rules={formRules}
                  label={t("application_add.19")}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="company_details"
                  initialValue={order?.company_details}
                  label={t("application_add.36")}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="status_client"
                  initialValue={order?.status_client}
                  rules={formRules}
                  label={t("Room.37")}
                >
                  <Select
                    options={[
                      {
                        value: "active",
                        label: t("application_add.39"),
                      },
                      {
                        value: "not_active",
                        label: t("application_add.40"),
                      },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="comentary"
                  initialValue={order?.comentary}
                  label={t("application_add.14")}
                >
                  <TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                <Button
                  loading={loadingForm}
                  disabled={loadingForm}
                  type="primary"
                  htmlType="submit"
                >
                  <span>{t("сhess.17")}</span>
                </Button>
                <Button htmlType="button" onClick={() => form.resetFields()}>
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}

        <hr />

        {order && (
          <div className={"instant_booking_box_shadow"}>
            <UpdateOrderUser
              users={order.users}
              setRefreshOrder={setRefreshOrder}
            />
          </div>
        )}

        <hr />

        <div id={"AdditServiesComponent"}>
          {paramOrderId && <AdditServiesComponent order={paramOrderId} />}
        </div>
      </div>

      <hr />

      {order && <RoomTab id={paramOrderId} dataFind={[order]} />}
    </Sidebar>
  );
}
