// api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston"
});

export const executeCode = async (sourceCode) => {
  try {
    const response = await API.post("/execute", {
      language: "java",
      version: "15.0.2",
      files: [
        {
          content: sourceCode,
        },
      ],
    });
    return response.data;
  } catch (error) {
    console.error("Error executing code:", error);
    throw error;
  }
};
