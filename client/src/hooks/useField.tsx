import { useState } from "react";

const useField = (type: string) => {
  const [value, setValue] = useState<string>("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onResetHandler = () => {
    setValue("");
  };

  return [{ type, value, onChange }, onResetHandler];
};

export default useField;
