import { useState, useEffect } from "react";
import { Buffer } from "buffer";

const useLocalStorage2 = (key, defaultValue) => {
  const hook = useState(() => {
    let base64 = localStorage.getItem(key) || "";
    let ascii;
    let json = {};
    try {
      ascii = Buffer.from(base64, "base64").toString("utf8");
    } catch (e) {
      ascii = base64;
    }
    try {
      json = JSON.parse(ascii);
    } catch (e) {}
    return json || defaultValue;
  });

  useEffect(() => {
    if (hook[0] === defaultValue) return;
    let json = JSON.stringify(hook[0]);
    let base64;
    try {
      base64 = Buffer.from(json, "utf8").toString("base64");
    } catch (e) {
      base64 = json;
    }
    localStorage.setItem(key, base64);
  }, [hook[0]]);

  return hook;
};

export default useLocalStorage2;

