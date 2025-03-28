
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "./Modal";

const TimerListContainer = styled.div`
  margin: 20px auto;
  padding: 20px;
  max-width: 600px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Category = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const CategoryHeader = styled.div`
  background-color: #e8e8e8;
  padding: 15px;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TimerItem = styled.div`
  padding: 15px;
  border-top: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const Button = styled.button`
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #4183d7;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  &:hover {
    background-color: ${(props) => (props.disabled ? "#4183d7" : "#3678c0")};
  }
`;

const ProgressBar = styled.div`
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin: 5px 0;
`;

const Progress = styled.div`
  background-color: ${(props) =>
    props.percentage === 100 ? "#4caf50" : "#65c3ba"};
  width: ${(props) => props.percentage}%;
  height: 10px;
`;

const TimerList = ({ timers, setTimers }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.status === "Running" && timer.remainingTime > 0) {
            const updatedTimer = {
              ...timer,
              remainingTime: timer.remainingTime - 1,
            };

            const elapsedPercentage =
              ((timer.duration - updatedTimer.remainingTime) / timer.duration) *
              100;

            if (Math.abs(elapsedPercentage - timer.alerts[0]) <= 0.5) {

              setModalMessage(
                `Alert: "${timer.name}" has reached ${timer.alerts[0]}% completion.`
              );
              setShowModal(true);
            }

            if (
              updatedTimer.remainingTime === 0 &&
              timer.status !== "Completed"
            ) {
              updatedTimer.status = "Completed";
              setShowModal(true);
              const completedTimers =
                JSON.parse(localStorage.getItem("completedTimers")) || [];
              const existing = completedTimers.find(
                (t) =>
                  t.name === updatedTimer.name &&
                  Date.now() - t.completedAt < 2000
              );

              if (!existing) {
                completedTimers.push({
                  name: updatedTimer.name,
                  category: updatedTimer.category,
                  completedAt: Date.now(),
                });
                localStorage.setItem(
                  "completedTimers",
                  JSON.stringify(completedTimers)
                );
                setModalMessage(`Timer "${timer.name}" has completed!`);
              }
            }

            return updatedTimer;
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [setTimers]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleCategoryAction = (category, action) => {
    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.category === category) {
          switch (action) {
            case "start":
              return { ...timer, status: "Running" };
            case "pause":
              return { ...timer, status: "Paused" };
            case "reset":
              return {
                ...timer,
                remainingTime: timer.duration,
                status: "Paused",
              };
            default:
              return timer;
          }
        }
        return timer;
      })
    );
  };

  const handleStart = (id) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id ? { ...timer, status: "Running" } : timer
      )
    );
  };

  const handlePause = (id) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id ? { ...timer, status: "Paused" } : timer
      )
    );
  };

  const handleReset = (id) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id
          ? { ...timer, remainingTime: timer.duration, status: "Paused" }
          : timer
      )
    );
  };

  const groupedTimers = timers?.reduce((groups, timer) => {
    (groups[timer.category] = groups[timer.category] || []).push(timer);
    return groups;
  }, {});

  return (
    <>
      <TimerListContainer>
        {groupedTimers && Object.keys(groupedTimers)?.map((category) => (
          <Category key={category}>
            <CategoryHeader onClick={() => toggleCategory(category)}>
              {category}
              <span>{expandedCategories[category] ? "-" : "+"}</span>
            </CategoryHeader>
            <ButtonContainer>
              <Button onClick={() => handleCategoryAction(category, "start")}>
                Start All
              </Button>
              <Button onClick={() => handleCategoryAction(category, "pause")}>
                Pause All
              </Button>
              <Button onClick={() => handleCategoryAction(category, "reset")}>
                Reset All
              </Button>
            </ButtonContainer>
            {expandedCategories[category] &&
              groupedTimers[category].map((timer) => {
                const percentage =
                  ((timer.duration - timer.remainingTime) / timer.duration) *
                  100;
                const disableButtons = timer.status === "Running";

                return (
                  <TimerItem key={timer.id}>
                    <div>
                      {timer.name} - {timer.remainingTime}s - {timer.status}
                    </div>
                    <ProgressBar>
                      <Progress percentage={percentage}></Progress>
                    </ProgressBar>
                    <ButtonContainer>
                      <Button
                        onClick={() => handleStart(timer.id)}
                        disabled={disableButtons}
                      >
                        Start
                      </Button>
                      <Button
                        onClick={() => handlePause(timer.id)}
                        disabled={disableButtons}
                      >
                        Pause
                      </Button>
                      <Button
                        onClick={() => handleReset(timer.id)}
                        disabled={disableButtons}
                      >
                        Reset
                      </Button>
                    </ButtonContainer>
                  </TimerItem>
                );
              })}
          </Category>
        ))}
      </TimerListContainer>
      {showModal && (
        <Modal message={modalMessage} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default TimerList;
