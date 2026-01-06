"use client";

import { useEffect, useState } from "react";
import { TestComponent } from "./TestComponent";

export interface RowType {
  test_table_id: number;
  test_table_text: string;
}

export default function Home() {
  const [firstMessage, setFirstMessage] = useState("");
  const [rows, setRows] = useState<RowType[]>([]);
  const [rowById, setRowById] = useState<RowType | null>(null);

  const getData = async () => {
    const responseMessage = await fetch("/api/first-page");
    const resultMessage = await responseMessage.json();
    setFirstMessage(resultMessage.message);

    const responseRows = await fetch("/api/first-page/db-test");
    const resultRows = await responseRows.json();
    setRows(resultRows.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h3>First Page</h3>
      <div>Message from page: Hello</div>
      <div>Message from backend: {firstMessage}</div>

      <div>Message from db:</div>
      <div>Rows:</div>
      {rows.map((row, index) => {
        return (
          <div key={index}>
            <div>Id: {row.test_table_id}</div>
            <div>Text: {row.test_table_text}</div>
          </div>
        );
      })}

      <button
        onClick={async () => {
          const responseRowById = await fetch("/api/first-page/db-test/2");
          const resultRowById = await responseRowById.json();
          console.log(resultRowById.data);

          if (resultRowById.data[0]) setRowById(resultRowById.data[0]);
        }}
      >
        Get ID 2
      </button>
      {rowById && (
        <div>
          <div>Row by id:</div>
          <div>
            ID: {rowById.test_table_id}, text: {rowById.test_table_text}
          </div>
        </div>
      )}

      <TestComponent counter={1} pruductPart={"qwertz1"} />
      <TestComponent counter={12} pruductPart={"qwertz2"} quantityTest={23} />
      <TestComponent counter={13} pruductPart={"qwertz3"} quantityTest={24} />
      <TestComponent counter={14} pruductPart={"qwertz4"} quantityTest={25} />
      <TestComponent counter={15} pruductPart={"qwertz5"} quantityTest={26} />
      <TestComponent counter={16} pruductPart={"qwertz6"} quantityTest={27} />
    </div>
  );
}
