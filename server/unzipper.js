const AdmZip = require("adm-zip");

const zip = new AdmZip("output/ExtractTextInfoFromPDF/testsome.zip"); // Specify the path to your zip file

zip.extractAllTo(/*target path*/ "unzippedPdf", /*overwrite*/ true);
