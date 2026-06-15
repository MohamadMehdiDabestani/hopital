import { useRef } from "react";
import { Button, CircularProgress } from "@mui/material";

type FileUploaderProps = {
  loading: boolean;
  onFileSelect: (file: File) => void;
};

export const FileUploader = ({ loading, onFileSelect }: FileUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);

    // برای اینکه اگر همان فایل دوباره انتخاب شد، onChange دوباره اجرا شود:
    e.target.value = "";
  };
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".xlsx,.xls"
        onChange={handleChange}
        disabled={loading}
      />
      <Button
        variant="contained"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? <CircularProgress size={24} /> : "انتخاب فایل اکسل"}
      </Button>
    </>
  );
};
