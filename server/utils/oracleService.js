const os = require("oci-objectstorage");
const common = require("oci-common");
const fs = require("fs");
const path = require("path");

const provider = new common.ConfigFileAuthenticationDetailsProvider(
  "Oracle/oracle.config",
  "DEFAULT"
);

const client = new os.ObjectStorageClient({
  authenticationDetailsProvider: provider,
});

//--------GET Image from Oracle Cloud--------
const getImageFromOracleCloud = async (getObjectRequest) => {
  try {
    getObjectRequest.namespaceName = "axgkqzms7vaf";

    const getObjectResponse = await client.getObject(getObjectRequest);
    console.log(
      "Get Object from Oracle executed successfully.",
      getObjectResponse.value
    );

    // Convert ReadableStream to Buffer
    const readableStream = getObjectResponse.value;
    const chunks = [];

    for await (const chunk of readableStream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    // Define output file path
    const outputPath = path.join(__dirname, "downloaded-image-dude.jpg");

    // Save buffer to file
    // fs.writeFileSync(outputPath, buffer);
    console.log("out:", outputPath);
    return outputPath;
    console.log("Image saved successfully to:", outputPath);
  } catch (error) {
    console.error("Error fetching image from oracle:", error);
  }
};

//--------PUT Image in Oracle Cloud--------
const putImageInOracleCloud = async (putObjectRequest) => {
  // Check if the file exists

  fs.access(putObjectRequest.fileLocation, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File not found or incorrect path:", err);
    } else {
      console.log("File exists and is accessible.");
    }
  });

  // Create stream to upload
  const stats = fs.statSync(putObjectRequest.fileLocation);
  const nodeFsBlob = new os.NodeFSBlob(
    putObjectRequest.fileLocation,
    stats.size
  );
  const objectData = await nodeFsBlob.getData();

  console.log("Now adding object to the Bucket.");

  putObjectRequest.putObjectBody = objectData;
  putObjectRequest.contentLength = stats.size;
  putObjectRequest.namespaceName = "axgkqzms7vaf";

  const putObjectResponse = await client.putObject(putObjectRequest);
  console.log("Put Object executed successfully" + putObjectResponse);
};

//--------DELETE Image from Oracle Cloud--------
const deleteImageInOracleCloud = async (deleteObjectRequest) => {
  console.log("Trying to delete obj from Oracle Cloud");
  deleteObjectRequest.namespaceName = "axgkqzms7vaf";
  try {
    const deleteObjectResponse = await client.deleteObject(deleteObjectRequest);
    console.log(
      "Delete Object In Oracle executed successfully:",
      deleteObjectResponse
    );
    return deleteObjectResponse;
  } catch (error) {
    console.error("Error deleting object in Oracle:", error);
  }
};

module.exports = {
  getImageFromOracleCloud,
  putImageInOracleCloud,
  deleteImageInOracleCloud,
};
