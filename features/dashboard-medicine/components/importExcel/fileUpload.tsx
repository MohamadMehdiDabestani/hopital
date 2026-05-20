import { Button } from "@mui/material";

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
    <Button variant="contained" component="label" loading={loading}>
      انتخاب فایل اکسل
      <input type="file" hidden accept=".xlsx,.xls" onChange={handleChange} />
    </Button>
  );
};
