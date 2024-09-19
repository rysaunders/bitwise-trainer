'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const operations = [
  { 
    name: 'AND', 
    symbol: '&', 
    description: 'Perform bitwise AND operation',
    example: '1010 & 1100 = 1000'
  },
  { 
    name: 'OR', 
    symbol: '|', 
    description: 'Perform bitwise OR operation',
    example: '1010 | 1100 = 1110'
  },
  { 
    name: 'XOR', 
    symbol: '^', 
    description: 'Perform bitwise XOR operation',
    example: '1010 ^ 1100 = 0110'
  },
  { 
    name: 'Left Shift', 
    symbol: '<<', 
    description: 'Shift bits to the left',
    example: '1010 << 2 = 101000'
  },
  { 
    name: 'Right Shift', 
    symbol: '>>', 
    description: 'Shift bits to the right',
    example: '1010 >> 2 = 0010'
  },
  { 
    name: 'NOT', 
    symbol: '~', 
    description: 'Invert all bits',
    example: '~1010 = 0101 (ignoring leading 1s)'
  },
  {
    name: 'Set Bit',
    symbol: '|=',
    description: 'Set a specific bit to 1',
    example: '1010 |= (1 << 1) = 1110'
  },
  {
    name: 'Clear Bit',
    symbol: '&= ~',
    description: 'Clear a specific bit to 0',
    example: '1010 &= ~(1 << 1) = 1000'
  },
  {
    name: 'Toggle Bit',
    symbol: '^=',
    description: 'Toggle a specific bit',
    example: '1010 ^= (1 << 1) = 1000'
  }
];

export default function BitwiseTrainer() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState(operations[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);

  const generateQuestion = () => {
    setNum1(Math.floor(Math.random() * 16)); // 4-bit number for simplicity
    setNum2(Math.floor(Math.random() * 16)); // 4-bit number for simplicity
    setOperation(operations[Math.floor(Math.random() * operations.length)]);
    setShowExplanation(false);
    setUserAnswer('');
    setFeedback('');
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const calculateCorrectAnswer = () => {
    switch (operation.name) {
      case 'AND': return num1 & num2;
      case 'OR': return num1 | num2;
      case 'XOR': return num1 ^ num2;
      case 'Left Shift': return (num1 << (num2 % 4)) & 0xF; // Limit to 4 bits
      case 'Right Shift': return num1 >> (num2 % 4);
      case 'NOT': return (~num1) & 0xF; // Limit to 4 bits
      case 'Set Bit': return num1 | (1 << (num2 % 4));
      case 'Clear Bit': return num1 & ~(1 << (num2 % 4));
      case 'Toggle Bit': return num1 ^ (1 << (num2 % 4));
      default: return 0;
    }
  };

  const checkAnswer = () => {
    const correctAnswer = calculateCorrectAnswer();
    if (parseInt(userAnswer, 2) === correctAnswer) {
      setScore(score + 1);
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect. The correct answer is ${correctAnswer.toString(2).padStart(4, '0')}.`);
    }
    setShowExplanation(true);
    setUserAnswer('');
  };

  const getExplanation = () => {
    const correctAnswer = calculateCorrectAnswer();
    switch (operation.name) {
      case 'AND':
        return `${num1.toString(2).padStart(4, '0')} AND ${num2.toString(2).padStart(4, '0')} results in ${correctAnswer.toString(2).padStart(4, '0')} because each bit is 1 only if both input bits are 1.`;
      case 'OR':
        return `${num1.toString(2).padStart(4, '0')} OR ${num2.toString(2).padStart(4, '0')} results in ${correctAnswer.toString(2).padStart(4, '0')} because each bit is 1 if either input bit is 1.`;
      case 'XOR':
        return `${num1.toString(2).padStart(4, '0')} XOR ${num2.toString(2).padStart(4, '0')} results in ${correctAnswer.toString(2).padStart(4, '0')} because each bit is 1 only if the input bits are different.`;
      case 'Left Shift':
        return `${num1.toString(2).padStart(4, '0')} shifted left by ${num2 % 4} positions becomes ${correctAnswer.toString(2).padStart(4, '0')}. This is equivalent to multiplying by 2^${num2 % 4}.`;
      case 'Right Shift':
        return `${num1.toString(2).padStart(4, '0')} shifted right by ${num2 % 4} positions becomes ${correctAnswer.toString(2).padStart(4, '0')}. This is equivalent to integer division by 2^${num2 % 4}.`;
      case 'NOT':
        return `NOT ${num1.toString(2).padStart(4, '0')} results in ${correctAnswer.toString(2).padStart(4, '0')} because each bit is flipped (0 becomes 1, and 1 becomes 0).`;
      case 'Set Bit':
        return `Setting bit ${num2 % 4} in ${num1.toString(2).padStart(4, '0')} results in ${correctAnswer.toString(2).padStart(4, '0')}. The specified bit is set to 1, while others remain unchanged.`;
      case 'Clear Bit':
        return `Clearing bit ${num2 % 4} in ${num1.toString(2).padStart(4, '0')} results in ${correctAnswer.toString(2).padStart(4, '0')}. The specified bit is set to 0, while others remain unchanged.`;
      case 'Toggle Bit':
        return `Toggling bit ${num2 % 4} in ${num1.toString(2).padStart(4, '0')} results in ${correctAnswer.toString(2).padStart(4, '0')}. The specified bit is flipped, while others remain unchanged.`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-purple-800 rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-center text-pink-300">Bitwise Trainer</h1>
        <div>
          <p className="text-cyan-300">Num1: <span className="text-yellow-300 font-mono">{num1.toString(2).padStart(4, '0')} ({num1})</span></p>
          <p className="text-cyan-300">Num2: <span className="text-yellow-300 font-mono">{num2.toString(2).padStart(4, '0')} ({num2})</span></p>
        </div>
        <div>
          <p className="text-cyan-300">Operation: <span className="text-pink-300 font-semibold">{operation.name} ({operation.symbol})</span></p>
          <p className="text-sm text-yellow-300">{operation.description}</p>
          <p className="text-sm text-green-300">Example: {operation.example}</p>
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
        {showExplanation && (
          <div className="mt-4 p-2 bg-indigo-800 rounded">
            <p className="text-sm text-yellow-300">{getExplanation()}</p>
          </div>
        )}
        <Button onClick={generateQuestion} className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
          Next Question
        </Button>
      </div>
    </div>
  );
}