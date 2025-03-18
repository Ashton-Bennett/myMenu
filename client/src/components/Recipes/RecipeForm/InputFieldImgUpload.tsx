interface InputFieldImgUploadProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

const InputFieldImgUpload: React.FC<InputFieldImgUploadProps> = ({
  selectedFile,
  setSelectedFile,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      console.error("No file selected");
      return;
    }

    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div>
      <label htmlFor="image">Upload Image</label>
      <input
        id="image"
        name="image"
        type="file"
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
      />
    </div>
  );
};

export default InputFieldImgUpload;
