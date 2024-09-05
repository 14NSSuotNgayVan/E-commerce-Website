export enum FILE_TYPE {
  PDF = ".pdf",
  DOC = ".doc",
  DOCX = ".docx",
  XLS = ".xls",
  XLSX = ".xlsx",
  JPG = ".jpg",
  JPEG = ".jpeg",
  PNG = ".png",
  BMP = ".bmp",
  SVG = ".svg",
  TXT = ".txt",
  CSV = ".csv"
}

export const actualFileType = [
  { id: FILE_TYPE.PDF, value: "application/pdf" },
  { id: FILE_TYPE.DOC, value: "application/msword" },
  { id: FILE_TYPE.DOCX, value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  { id: FILE_TYPE.XLS, value: "application/vnd.ms-excel" },
  { id: FILE_TYPE.XLSX, value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  { id: FILE_TYPE.JPG, value: "image/jpeg" },
  { id: FILE_TYPE.JPEG, value: "image/jpeg" },
  { id: FILE_TYPE.PNG, value: "image/png" },
  { id: FILE_TYPE.BMP, value: "image/bmp" },
  { id: FILE_TYPE.SVG, value: "image/svg+xml" },
  { id: FILE_TYPE.TXT, value: "text/plain" },
  { id: FILE_TYPE.CSV, value: "text/csv" },
];