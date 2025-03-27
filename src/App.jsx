// src/App.js

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import styled, {
  ThemeProvider as StyledThemeProvider,
} from "styled-components";
import AddTimer from "./components/AddTimer";
import TimerList from "./components/TimerList";
import History from "./components/History";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { lightTheme, darkTheme } from "./themes";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.color};
  padding: 20px;
`;

const Nav = styled.nav`
  width: 50%;
  display: flex;
  justify-content: space-around;
`;

const NavLink = styled(Link)`
  margin: 0 15px;
  text-decoration: none;
  color: #4183d7;
  font-weight: bold;

  &:hover {
    color: #3678c0;
  }
`;

const SwitcherButton = styled.button`
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 6px 12px;
  background-color: ${(props) => props.theme.buttonBackground};
  color: ${(props) => props.theme.color};
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.buttonHover};
  }
`;

const AppWrapper = () => {
  const [timers, setTimers] = useState([]);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const storedTimers = JSON.parse(localStorage.getItem("timers")) || [];
    setTimers(storedTimers);
  }, []);

  const addTimer = (newTimer) => {
    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    localStorage.setItem("timers", JSON.stringify(updatedTimers));
  };

  return (
    <StyledThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <AppContainer>
        <SwitcherButton
          onClick={toggleTheme}
          style={
            theme === "light"
              ? { color: "white" }
              : { color: "black", backgroundColor: "white" }
          }
        >
          {theme === "light" ? "Dark" : "Light"} Mode
        </SwitcherButton>
        <Router>
          <Nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/history">History</NavLink>
          </Nav>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h2
                    style={
                      theme === "light"
                        ? { color: "black" }
                        : { color: "white" }
                    }
                  >
                    TimeSentry
                  </h2>
                  <AddTimer onAddTimer={addTimer} />
                  <TimerList timers={timers} setTimers={setTimers} />
                </>
              }
            />
            <Route path="/history" element={<History />} />
          </Routes>
        </Router>
      </AppContainer>
    </StyledThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppWrapper />
    </ThemeProvider>
  );
}

export default App;
