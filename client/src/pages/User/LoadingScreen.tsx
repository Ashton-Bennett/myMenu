import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Loading...</h1>
    </div>
  );
};

export default LoadingScreen;
