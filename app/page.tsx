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
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const calculateCorrectAnswer = () => {
    switch (operation.name) {
      case 'AND': return num1 & num2;
      case 'OR': return num1 | num2;
      case 'XOR': return num1 ^ num2;
      case 'Left Shift': return num1 << (num2 % 4); // Limit shift to prevent overflow
      case 'Right Shift': return num1 >> (num2 % 4); // Limit shift to prevent underflow
      case 'NOT': return ~num1 & 0xF; // Limit to 4 bits
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
      default:
        return '';
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-purple-900 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-pink-300">Bitwise Trainer</h1>
      <div className="mb-4">
        <p className="text-cyan-300">Num1: <span className="text-yellow-300">{num1.toString(2).padStart(4, '0')} ({num1})</span></p>
        {operation.name !== 'NOT' && (
          <p className="text-cyan-300">Num2: <span className="text-yellow-300">{num2.toString(2).padStart(4, '0')} ({num2})</span></p>
        )}
      </div>
      <div className="mb-4">
        <p className="text-cyan-300">Operation: <span className="text-pink-300">{operation.name} ({operation.symbol})</span></p>
        <p className="text-sm text-yellow-300">{operation.description}</p>
        <p className="text-sm text-green-300">Example: {operation.example}</p>
      </div>
      <Input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Enter your answer in binary"
        className="mb-4 bg-indigo-800 text-pink-300 border-pink-500"
      />
      <Button onClick={checkAnswer} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white mb-4">
        Submit
      </Button>
      <p className="text-xl mb-2 text-cyan-300">Score: <span className="text-yellow-300">{score}</span></p>
      <p className={`text-lg ${feedback.startsWith('Correct') ? 'text-green-400' : 'text-red-400'}`}>
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
  );
}