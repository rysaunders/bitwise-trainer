'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const operations = [
  { name: 'Set bit', requiresSecondOperand: true, description: 'Set a specific bit to 1' },
  { name: 'Clear bit', requiresSecondOperand: true, description: 'Set a specific bit to 0' },
  { name: 'Toggle bit', requiresSecondOperand: true, description: 'Flip a specific bit' },
  { name: 'Check if bit is set', requiresSecondOperand: true, description: 'Check if a specific bit is 1' },
  { name: 'Mask', requiresSecondOperand: true, description: 'Apply a bit mask' },
  { name: 'Combine bytes', requiresSecondOperand: true, description: 'Combine two bytes into a 16-bit value' },
  { name: 'Extract low byte', requiresSecondOperand: false, description: 'Get the least significant byte' },
  { name: 'Extract high byte', requiresSecondOperand: false, description: 'Get the most significant byte' },
  { name: 'Multiply by 8', requiresSecondOperand: false, description: 'Multiply by 8 (left shift by 3)' },
  { name: 'Divide by 4', requiresSecondOperand: false, description: 'Divide by 4 (right shift by 2)' },
  { name: 'Check if power of 2', requiresSecondOperand: false, description: 'Check if the number is a power of 2' },
];

export default function BitwiseTrainer() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState(operations[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const generateNumbers = () => {
    setNum1(Math.floor(Math.random() * 256)); // 8-bit number
    setNum2(Math.floor(Math.random() * 256)); // 8-bit number
    setOperation(operations[Math.floor(Math.random() * operations.length)]);
  };

  useEffect(() => {
    generateNumbers();
  }, []);

  const calculateCorrectAnswer = () => {
    const bitPosition = num2 % 8;
    switch (operation.name) {
      case 'Set bit':
        return num1 | (1 << bitPosition);
      case 'Clear bit':
        return num1 & ~(1 << bitPosition);
      case 'Toggle bit':
        return num1 ^ (1 << bitPosition);
      case 'Check if bit is set':
        return (num1 & (1 << bitPosition)) !== 0 ? 1 : 0;
      case 'Mask':
        return num1 & num2;
      case 'Combine bytes':
        return (num1 << 8) | num2;
      case 'Extract low byte':
        return num1 & 0xFF;
      case 'Extract high byte':
        return (num1 >> 8) & 0xFF;
      case 'Multiply by 8':
        return num1 << 3;
      case 'Divide by 4':
        return num1 >> 2;
      case 'Check if power of 2':
        return (num1 & (num1 - 1)) === 0 ? 1 : 0;
      default:
        return 0;
    }
  };

  const checkAnswer = () => {
    const correctAnswer = calculateCorrectAnswer();
    if (parseInt(userAnswer, 2) === correctAnswer) {
      setScore(score + 1);
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect. The correct answer is ${correctAnswer.toString(2).padStart(8, '0')} (${correctAnswer}).`);
    }
    setUserAnswer('');
    generateNumbers();
  };

  const getBitVisualization = (num: number, highlightBit: number | null = null) => {
    return num.toString(2).padStart(8, '0').split('').map((bit, index) => (
      <span key={index} className={`inline-block w-8 text-center p-1 m-1 rounded ${
        index === highlightBit ? 'bg-yellow-500 text-black' : 'bg-gray-700'
      }`}>
        {bit}
      </span>
    ));
  };

  const getOperationDescription = () => {
    const bitPosition = num2 % 8;
    switch (operation.name) {
      case 'Set bit':
      case 'Clear bit':
      case 'Toggle bit':
      case 'Check if bit is set':
        return `${operation.description} (Bit position: ${bitPosition})`;
      default:
        return operation.description;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-lg border border-pink-500 shadow-lg shadow-pink-500/50 p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-pink-500 tracking-wider">Bitwise Trainer</h1>
        
        <div className="mb-6">
          <p className="text-cyan-300 mb-2">Num1: {num1.toString(2)} ({num1})</p>
          <div className="grid grid-cols-8 gap-1 mb-4">
            {num1.toString(2).padStart(8, '0').split('').map((bit, index) => (
              <div key={index} className={`w-8 h-8 flex items-center justify-center rounded ${bit === '1' ? 'bg-pink-500' : 'bg-gray-700'} text-white`}>
                {bit}
              </div>
            ))}
          </div>
          <p className="text-cyan-300">Operation: {operation}</p>
          <p className="text-cyan-300 text-sm">{getOperationDescription()}</p>
        </div>
        
        <Input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter your answer in binary"
          className="mb-4 bg-gray-800 text-white border-pink-500 focus:ring-cyan-300"
        />
        
        <Button 
          onClick={checkAnswer}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </Button>
        
        <p className="mt-4 text-center text-cyan-300">Score: {score}</p>
      </div>
    </div>
  );
}