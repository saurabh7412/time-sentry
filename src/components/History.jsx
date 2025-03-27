// src/components/History.js

import React, { useEffect, useState } from "react";
import styled from "styled-components";

const HistoryContainer = styled.div`
  margin: 20px;
  padding: 20px;
  max-width: 600px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const TimerRecord = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
`;

const ExportButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4183d7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #3678c0;
  }
`;

const History = () => {
  const [completedTimers, setCompletedTimers] = useState([]);

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("completedTimers")) || [];
    setCompletedTimers(storedHistory);
  }, []);

  const handleExport = () => {
    exportToJsonFile(completedTimers);
  };

  const exportToJsonFile = (data) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "timer_history.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <HistoryContainer>
      <h2>Timer History</h2>
      {completedTimers.length > 0 ? (
        <>
          {completedTimers.map((timer, index) => (
            <TimerRecord key={index}>
              <span>{timer.name}</span>
              <span>{new Date(timer.completedAt).toLocaleString()}</span>
            </TimerRecord>
          ))}
          <ExportButton onClick={handleExport}>
            Export History as JSON
          </ExportButton>
        </>
      ) : (
        <p>No completed timers yet.</p>
      )}
    </HistoryContainer>
  );
};

export default History;
