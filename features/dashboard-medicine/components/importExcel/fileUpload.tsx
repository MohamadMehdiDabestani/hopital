import { Button, CircularProgress } from "@mui/material";

type FileUploaderProps = {
  loading: boolean;
  onFileSelect: (file: File) => void;
};

export const FileUploader = ({ loading, onFileSelect }: FileUploaderProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Button variant="contained" component="label" disabled={loading}>
      {loading ? <CircularProgress size={24} /> : "انتخاب فایل اکسل"}
      <input type="file" hidden accept=".xlsx,.xls" onChange={handleChange} />
    </Button>
  );
};
