import React, { useState } from 'react';
import styled from 'styled-components';

const AddTimerContainer = styled.div`
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 100%;
  width: 400px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #4183d7;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #3678c0;
  }
`;

const AddTimer = ({ onAddTimer }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [alertPercentage, setAlertPercentage] = useState(50);

  const handleAddTimer = (e) => {
    e.preventDefault();

    if (alertPercentage < 1 || alertPercentage > 100) {
      alert("Alert percentage must be between 1 and 100.");
      return;
    }

    const newTimer = {
      id: Date.now(),
      name,
      duration: parseInt(duration, 10),
      category,
      remainingTime: parseInt(duration, 10),
      status: 'Paused',
      alerts: [alertPercentage],
    };
    onAddTimer(newTimer);
    setName('');
    setDuration('');
    setCategory('');
    setAlertPercentage(alertPercentage);
  };

  return (
    <AddTimerContainer>
      <h2>Add New Timer</h2>
      <form onSubmit={handleAddTimer}>
        <FormGroup>
          <Label htmlFor="name">Timer Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="alert-percentage">Alert Percentage</Label>
          <Input
            id="alert-percentage"
            type="number"
            value={alertPercentage}
            min="1"
            max="100"
            onChange={(e) => setAlertPercentage(parseInt(e.target.value, 10))}
            required
          />
        </FormGroup>
        <Button type="submit">Add Timer</Button>
      </form>
    </AddTimerContainer>
  );
};

export default AddTimer;
