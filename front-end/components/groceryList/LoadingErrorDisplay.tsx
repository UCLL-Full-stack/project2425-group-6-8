import React from "react";

type LoadingErrorDisplayProps = {
  type: "loading" | "error";
  message?: string;
};

const LoadingErrorDisplay: React.FC<LoadingErrorDisplayProps> = ({ type, message }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      {type === "loading" ? (
        <p className="text-lg text-gray-500">Loading...</p>
      ) : (
        <p className="text-lg text-red-500">{message || "An error occurred"}</p>
      )}
    </div>
  );
};

export default LoadingErrorDisplay;
