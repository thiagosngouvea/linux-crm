import React, { useState, useEffect, useCallback } from "react";
import { FaUpload } from "react-icons/fa";
import {
  InboxOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { message, Upload, Result, Button, Typography } from "antd";
import { propertiesService } from "@/services/properties.service";

const { Dragger } = Upload;
const { Paragraph, Text } = Typography;

const AnaliseExcel = React.memo(function AnaliseExcel() {
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessages, setInfoMessages] = useState(null);

  const [isFinished, setIsFinished] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  const handleUpload = useCallback(async () => {
    setLoading(true);
    setDownloadLink("");
    const formData = new FormData();

    formData.append("file", file.originFileObj);

    try {
      const response = await propertiesService.uploadExcel(formData);
      setShowMessage(true);
      setErrorOrSuccessMessage("success");
      setDownloadLink(response.data.file_path);
    } catch (error) {
      setShowMessage(true);
      setErrorOrSuccessMessage("error");
    } finally {
      setLoading(false);
      setFile(null);
      setIsFinished(true);
    }
  }, [file]);

  const handleDownload = useCallback(async () => {
    window.open(`https://${downloadLink}`, "_blank", "noopener,noreferrer");
  }, [downloadLink]);

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative mx-auto mt-5 animate-[propel_2s_infinite]">
        <FaUpload className="text-6xl text-orange-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-500 xs:text-center">
        Analise dos dados do Excel
      </h1>
      <Dragger
        name="file"
        multiple={false}
        accept=".xlsx"
        disabled={!!file}
        style={{
          padding: "10px",
          border: "2px dashed #ffa940",
          borderRadius: "10px",
        }}
        onChange={(info) => {
          setFile(info.file);
        }}
        onRemove={() => {
          setFile(null);
        }}
        fileList={file ? [{ ...file, status: "done" }] : []}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Clique ou arraste o arquivo para esta área
        </p>
        <p className="ant-upload-hint">
          Um unico arquivo .xlsx com os campos: <br />
        </p>
        <p className="ant-upload-hint">
          <ul>
            <li>Link_Captação</li>
            <li>Link_Captação_Situação</li>
            <li>Link_Site</li>
            <li>Link_Site_Situação</li>
          </ul>
        </p>
      </Dragger>
      {!loading && (
        <div className="flex gap-2">
            <button
            className="w-32 rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-400"
            onClick={() => setFile(null)}
            >
            Cancelar
            </button>
            <button
            className={`${
                !file ? "cursor-not-allowed opacity-50" : ""
            } w-32 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-400`}
            onClick={handleUpload}
            disabled={!file}
            >
            Analisar
            </button>
        </div>
      )}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-10 gap-2">
            <div className="animate-spin rounded-full h-20 w-20 border-b-8 border-orange-500"></div>
            <p className="text-orange-400 text-lg">Analisando, aguarde enquanto os links são analisados...</p>
        </div>
      )}
      {downloadLink !== "" &&  !!downloadLink && (
        <div className="flex gap-2">
          <button
            className={`${
              !downloadLink ? "cursor-not-allowed opacity-50" : ""
            } w-32 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-400`}
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
});

export default AnaliseExcel;
