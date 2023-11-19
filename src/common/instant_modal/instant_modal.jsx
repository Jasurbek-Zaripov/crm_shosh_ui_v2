import { Modal } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import FormToInstantBooking from "./form_instant_modal";

export default function InstantBookingModal({ open, setOpen }) {
  const { t } = useTranslation();

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        title={t("chess.23")}
        open={open}
        onCancel={handleCancel}
        footer={null}
        centered
        width={"70%"}
      >
        <FormToInstantBooking />
      </Modal>
    </>
  );
}
