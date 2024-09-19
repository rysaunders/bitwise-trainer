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
    setNum2(Math.floor(Math.random() * 8)); // Bit position (0-7)
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
        index === highlightBit ? 'bg-yellow-500 text-black font-bold' : 'bg-gray-700'
      }`}>
        {bit}
      </span>
    ));
  };

  const getOperationDescription = () => {
    switch (operation.name) {
      case 'Set bit':
      case 'Clear bit':
      case 'Toggle bit':
      case 'Check if bit is set':
        return `${operation.description} (Bit position: ${num2})`;
      case 'Mask':
        return `${operation.description} (Mask: ${num2.toString(2).padStart(8, '0')})`;
      case 'Combine bytes':
        return `${operation.description} (Num1 as high byte, Num2 as low byte)`;
      default:
        return operation.description;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-purple-800 rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-center text-pink-300">Bitwise Trainer</h1>
        <div>
          <p className="text-cyan-300">Num1: <span className="text-yellow-300 font-mono">{num1.toString(2).padStart(8, '0')} ({num1})</span></p>
          <div className="my-2 flex justify-center">{getBitVisualization(num1, operation.requiresSecondOperand ? num2 : null)}</div>
          {operation.requiresSecondOperand && (
            <>
              <p className="text-cyan-300 mt-2">
                {operation.name === 'Mask' || operation.name === 'Combine bytes' 
                  ? `Num2: ${num2.toString(2).padStart(8, '0')} (${num2})`
                  : `Bit position: ${num2}`
                }
              </p>
              {(operation.name === 'Mask' || operation.name === 'Combine bytes') && (
                <div className="my-2 flex justify-center">{getBitVisualization(num2)}</div>
              )}
            </>
          )}
        </div>
        <div>
          <p className="text-cyan-300">Operation: <span className="text-pink-300 font-semibold">{operation.name}</span></p>
          <p className="text-sm text-yellow-300">{getOperationDescription()}</p>
        </div>
        <Input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter your answer in binary"
          className="bg-purple-700 text-pink-300 border-pink-500 placeholder-pink-400"
        />
        <Button onClick={checkAnswer} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
          Submit
        </Button>
        <p className="text-xl text-center text-cyan-300">Score: <span className="text-yellow-300">{score}</span></p>
        <p className={`text-lg text-center ${feedback.startsWith('Correct') ? 'text-green-400' : 'text-red-400'}`}>
          {feedback}
        </p>
      </div>
    </div>
  );
}