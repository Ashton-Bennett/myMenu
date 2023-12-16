import { useState } from "react";
import recipeService from "../services/recipes";
const pdfjs = require("pdfjs-dist");

interface componentProps {
  setNewRecipe: Function;
}
const UserUploadFileInput = ({ setNewRecipe }: componentProps) => {
  const [loading, setLoading] = useState(false);
  const userUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        if (e.target) {
          const fileContents = e.target.result;

          if (file.type === "application/pdf") {
            try {
              pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

              const loadingTask = pdfjs.getDocument({ data: fileContents });
              const pdf = await loadingTask.promise;
              const numPages = pdf.numPages;
              let pdfText = "";

              for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
                const page = await pdf.getPage(pageNumber);
                const textContent = await page.getTextContent();
                pdfText += textContent.items
                  .map((item: any) => item.str)
                  .join("");
              }
              setLoading(true);
              const formattedRecipe = await recipeService.getFormattedRecipe(
                pdfText
              );
              setLoading(false);
              setNewRecipe(JSON.parse(formattedRecipe));
            } catch (error) {
              console.error("Error loading PDF:", error);
            }
          } else {
            console.log("File is not a PDF.");
          }
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.log("No file selected.");
    }
  };
  return (
    <div>
      <label htmlFor="fileInput">Upload recipe:</label>
      <input
        id="fileInput"
        onChange={userUploadFile}
        type="file"
        accept=".txt, .pdf, .docx, .doc, .html, .xml, .xlsx, .xls, .epub, .mobi"
      ></input>
      {loading ? <p>Loading, please give us a few mins...</p> : null}
    </div>
  );
};
export default UserUploadFileInput;
