"use client";

import { useEffect, useState } from "react";
import { RowType } from "../first-page/page";

export default function Home() {
  const [secondMessage, setSecondMessage] = useState("");
  const [a, setA] = useState<RowType[]>([]);

  const getMessage = async () => {
    const response = await fetch("/api/second-page");
    const result = await response.json();

    console.log("reslt", result);

    setSecondMessage(result.message);
  };

  useEffect(() => {
    getMessage();
  }, []);

  return (
    <div>
      <h3>Second Page</h3>
      <div>{secondMessage}</div>
    </div>
  );
}
