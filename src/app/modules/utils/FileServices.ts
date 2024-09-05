import axios from "axios";
const API_PATH = process.env.API_URL;
export const fileUpload = (file: any) => {
  const url = `${API_PATH}/file/upload`;
  const formData = new FormData();
  formData.append("file", file);
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.post(url, formData, config);
};

export const imageUpload = (file: any) => {
  const url = `${API_PATH}/image/upload`;
  const formData = new FormData();
  formData.append("image", file);
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.post(url, formData, config);
};

export const downLoadFile = (fileName: string) => {
  const url = `${API_PATH}/file/document?fileName=${fileName}`;
  return axios({
    url: url,
    method: "GET",
    responseType: "blob",
  });
};

export const downLoadFileById = (fileId: string) => {
  const url = `${API_PATH}/file/document/${fileId}`;
  return axios({
    url: url,
    method: "GET",
    responseType: "blob",
  });
};

export const getFile = (fileUrl :string)=>{
  return axios.get("https://res.cloudinary.com/dmbkjp7f1/image/upload/v1713710427/report/bvp4cgvfmunrty8o4lxe.pdf", { responseType: 'arraybuffer' });
}
