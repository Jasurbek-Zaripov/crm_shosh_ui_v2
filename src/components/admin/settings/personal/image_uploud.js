import { UserOutlined, LoadingOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./style.module.css";
import './upload.css'

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
const ImageUpload = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <div className={styles.icon_box}>
      {loading ? (
        <LoadingOutlined style={{ fontSize: "45px", color: "#DDDDDD" }} />
      ) : (
        <UserOutlined style={{ fontSize: "65px", color: "#DDDDDD" }} />
      )}
      <div
        style={{
          marginTop: 8,
        }}
      ></div>
    </div>
  );
  return (
    <>
      <Upload
        id="image-upload"
        name="avatar"
        listType="picture-circle"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: "100%",
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
      <label htmlFor="image-upload" className={styles.upload_label}>
        {t("Settings.personal_data.5")}
      </label>
    </>
  );
};
export default ImageUpload;
