'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the Operation interface
interface Operation {
  name: string;
  symbol: string;
  description: string;
  example: string;
}

// Define the available operations
const operations: Operation[] = [
  {
    name: 'AND',
    symbol: '&',
    description: 'Perform bitwise AND operation',
    example: '1010 & 1100 = 1000',
  },
  {
    name: 'OR',
    symbol: '|',
    description: 'Perform bitwise OR operation',
    example: '1010 | 1100 = 1110',
  },
  {
    name: 'XOR',
    symbol: '^',
    description: 'Perform bitwise XOR operation',
    example: '1010 ^ 1100 = 0110',
  },
  {
    name: 'Left Shift',
    symbol: '<<',
    description: 'Shift bits to the left',
    example: '1010 << 2 = 101000',
  },
  {
    name: 'Right Shift',
    symbol: '>>',
    description: 'Shift bits to the right',
    example: '1010 >> 2 = 0010',
  },
  {
    name: 'NOT',
    symbol: '~',
    description: 'Invert all bits',
    example: '~1010 = 0101 (ignoring leading 1s)',
  },
  {
    name: 'Set Bit',
    symbol: '|=',
    description: 'Set a specific bit to 1 (e.g., turning on an LED)',
    example: 'PORTA |= (1 << 2); // Set bit 2 to turn on LED',
  },
  {
    name: 'Clear Bit',
    symbol: '&= ~',
    description: 'Clear a specific bit to 0 (e.g., turning off an LED)',
    example: 'PORTA &= ~(1 << 2); // Clear bit 2 to turn off LED',
  },
  {
    name: 'Toggle Bit',
    symbol: '^=',
    description: 'Toggle a specific bit',
    example: '1010 ^= (1 << 1) = 1000',
  },
];

export default function BitwiseTrainer() {
  // State variables with types
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [operation, setOperation] = useState<Operation>(operations[0]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [selectedOperations, setSelectedOperations] = useState<string[]>(operations.map(op => op.name));
  const [numberBase, setNumberBase] = useState<'binary' | 'decimal' | 'hexadecimal'>('binary');
  const [bitWidth, setBitWidth] = useState<number>(4);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  // Define function types
  type UnaryOperation = (a: number) => number;
  type BinaryOperation = (a: number, b: number) => number;

  
  // Generate a new question
  const generateQuestion = (): void => {
    if (selectedOperations.length === 0) {
      setFeedback('Please select at least one operation to practice.');
      return;
    }
    setNum1(Math.floor(Math.random() * Math.pow(2, bitWidth)));
    setNum2(Math.floor(Math.random() * bitWidth));
    const availableOperations = operations.filter(op => selectedOperations.includes(op.name));
    setOperation(availableOperations[Math.floor(Math.random() * availableOperations.length)]);
    setShowExplanation(false);
    setUserAnswer('');
    setFeedback('');
  };

  useEffect((): void => {
    generateQuestion();
  }, []);

  // Bitwise operations mapping with explicit types
  const bitwiseOperations: { [key: string]: UnaryOperation | BinaryOperation } = {
    AND: (a: number, b: number): number => a & b,
    OR: (a: number, b: number): number => a | b,
    XOR: (a: number, b: number): number => a ^ b,
    'Left Shift': (a: number, b: number): number => (a << (b % bitWidth)) & (Math.pow(2, bitWidth) - 1),
    'Right Shift': (a: number, b: number): number => a >> (b % bitWidth),
    NOT: (a: number): number => ~a & (Math.pow(2, bitWidth) - 1),
    'Set Bit': (a: number, b: number): number => a | (1 << b),
    'Clear Bit': (a: number, b: number): number => a & ~(1 << b),
    'Toggle Bit': (a: number, b: number): number => a ^ (1 << b),
  };

  // Calculate the correct answer with proper type handling
  const calculateCorrectAnswer = (): number => {
    const operationFunction = bitwiseOperations[operation.name];
    if (operation.name === 'NOT') {
      return (operationFunction as UnaryOperation)(num1);
    } else {
      return (operationFunction as BinaryOperation)(num1, num2);
    }
  };

  // Format numbers based on the selected base
  const formatNumber = (number: number): string => {
    const padLength = bitWidth;
    switch (numberBase) {
      case 'binary':
        return number.toString(2).padStart(padLength, '0');
      case 'decimal':
        return number.toString(10);
      case 'hexadecimal':
        return number.toString(16).toUpperCase().padStart(Math.ceil(padLength / 4), '0');
      default:
        return number.toString(2).padStart(padLength, '0');
    }
  };

  // Parse user's answer
  const parseUserAnswer = (): number => {
    const base: number = numberBase === 'binary' ? 2 : numberBase === 'decimal' ? 10 : 16;
    return parseInt(userAnswer, base);
  };

  // Check the user's answer
  const checkAnswer = (): void => {
    const correctAnswer: number = calculateCorrectAnswer();
    const parsedAnswer: number = parseUserAnswer();
    setTotalQuestions(totalQuestions + 1);
    if (parsedAnswer === correctAnswer) {
      setScore(score + 1);
      setCorrectAnswers(correctAnswers + 1);
      const messages: string[] = ['Great job!', 'Well done!', 'You got it!', 'Excellent!'];
      setFeedback(messages[Math.floor(Math.random() * messages.length)]);
    } else {
      setFeedback(`Incorrect. The correct answer is ${formatNumber(correctAnswer)}.`);
    }
    setShowExplanation(true);
    setUserAnswer('');
  };

  // Get operation description
  const getOperationDescription = (): string => {
    switch (operation.name) {
      case 'Set Bit':
        return `Set bit ${num2} to 1 (e.g., turning on an LED)`;
      case 'Clear Bit':
        return `Clear bit ${num2} to 0 (e.g., turning off an LED)`;
      case 'Toggle Bit':
        return `Toggle bit ${num2}`;
      default:
        return operation.description;
    }
  };

  // Get detailed explanation
  const getExplanation = (): string => {
    const correctAnswer: number = calculateCorrectAnswer();
    const num1Formatted: string = formatNumber(num1);
    const num2Formatted: string = formatNumber(num2);
    const resultFormatted: string = formatNumber(correctAnswer);
    const num1Bits: string[] = num1Formatted.split('');
    const num2Bits: string[] = num2Formatted.split('');
    const resultBits: string[] = resultFormatted.split('');
    let steps: string = '';

    switch (operation.name) {
      case 'AND':
      case 'OR':
      case 'XOR':
        steps += `Bitwise ${operation.name} operation:\n`;
        for (let i = 0; i < bitWidth; i++) {
          steps += `Bit ${i}: ${num1Bits[i]} ${operation.symbol} ${num2Bits[i]} = ${resultBits[i]}\n`;
        }
        break;
      case 'Left Shift':
      case 'Right Shift':
        steps += `${num1Formatted} shifted ${operation.name === 'Left Shift' ? 'left' : 'right'} by ${num2 % bitWidth} positions results in ${resultFormatted}.\n`;
        steps += `This is equivalent to ${operation.name === 'Left Shift' ? 'multiplying' : 'dividing'} by 2^${num2 % bitWidth}.`;
        break;
      case 'NOT':
        steps += `Bitwise NOT operation on ${num1Formatted}:\n`;
        for (let i = 0; i < bitWidth; i++) {
          steps += `Bit ${i}: ~${num1Bits[i]} = ${resultBits[i]}\n`;
        }
        break;
      case 'Set Bit':
      case 'Clear Bit':
      case 'Toggle Bit':
        steps += `${operation.description} at bit position ${num2}:\n`;
        steps += `Original: ${num1Formatted}\n`;
        steps += `Result:   ${resultFormatted}`;
        break;
      default:
        steps = '';
    }

    return steps;
  };

  // Toggle operation selection
  const toggleOperation = (operationName: string): void => {
    setSelectedOperations((prev: string[]) => {
      if (prev.includes(operationName)) {
        return prev.filter((name) => name !== operationName);
      } else {
        return [...prev, operationName];
      }
    });
  };

  // Get indices of changed bits
  const getChangedBits = (): number[] => {
    const num1Bits: string[] = formatNumber(num1).split('');
    const resultBits: string[] = formatNumber(calculateCorrectAnswer()).split('');
    const changedIndices: number[] = [];
    for (let i = 0; i < bitWidth; i++) {
      if (num1Bits[i] !== resultBits[i]) {
        changedIndices.push(i);
      }
    }
    return changedIndices;
  };

  // Component to display bits
  interface BitDisplayProps {
    number: number;
    highlightBits?: number[];
  }

  const BitDisplay: React.FC<BitDisplayProps> = ({ number, highlightBits = [] }) => {
    const bits: string[] = formatNumber(number).split('');
    return (
      <div className="flex space-x-1 justify-center">
        {bits.map((bit: string, index: number) => (
          <div
            key={index}
            className={`w-6 h-6 flex items-center justify-center border ${
              highlightBits.includes(index) ? 'bg-green-500' : 'bg-purple-700'
            }`}
          >
            <span className="text-pink-300">{bit}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-purple-800 rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-center text-pink-300">Bitwise Trainer</h1>

        {/* Settings */}
        <div>
          <div className="mb-2">
            <label className="text-cyan-300">Select Operations:</label>
            {operations.map((op: Operation) => (
              <label key={op.name} className="block text-pink-300">
                <input
                  type="checkbox"
                  checked={selectedOperations.includes(op.name)}
                  onChange={() => toggleOperation(op.name)}
                  className="mr-2"
                />
                {op.name}
              </label>
            ))}
          </div>
          <div className="mb-2">
            <label className="text-cyan-300">Number Base:</label>
            <select
              value={numberBase}
              onChange={(e) => setNumberBase(e.target.value as 'binary' | 'decimal' | 'hexadecimal')}
              className="bg-purple-700 text-pink-300 border-pink-500"
            >
              <option value="binary">Binary</option>
              <option value="decimal">Decimal</option>
              <option value="hexadecimal">Hexadecimal</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="text-cyan-300">Bit Width:</label>
            <select
              value={bitWidth}
              onChange={(e) => setBitWidth(parseInt(e.target.value))}
              className="bg-purple-700 text-pink-300 border-pink-500"
            >
              <option value={4}>4-bit</option>
              <option value={8}>8-bit</option>
              <option value={16}>16-bit</option>
            </select>
          </div>
        </div>

        {/* Display Numbers and Operation */}
        <div>
          <p className="text-cyan-300">
            Num1: <span className="text-yellow-300 font-mono">{formatNumber(num1)} ({num1})</span>
          </p>
          {!['Set Bit', 'Clear Bit', 'Toggle Bit', 'NOT'].includes(operation.name) && (
            <p className="text-cyan-300">
              Num2: <span className="text-yellow-300 font-mono">{formatNumber(num2)} ({num2})</span>
            </p>
          )}
        </div>
        <div>
          <p className="text-cyan-300">
            Operation: <span className="text-pink-300 font-semibold">{operation.name} ({operation.symbol})</span>
          </p>
          <p className="text-sm text-yellow-300">{getOperationDescription()}</p>
          <p className="text-sm text-green-300">Example: {operation.example}</p>
        </div>

        {/* User Input */}
        <Input
          type="text"
          value={userAnswer}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserAnswer(e.target.value)}
          placeholder={`Enter your answer in ${numberBase}`}
          className="bg-purple-700 text-pink-300 border-pink-500 placeholder-pink-400"
        />

        {/* Submit Button */}
        <Button
          onClick={checkAnswer}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
        >
          Submit
        </Button>

        {/* Score and Feedback */}
        <p className="text-xl text-center text-cyan-300">
          Score: <span className="text-yellow-300">{score}</span> <br />
          Accuracy: {totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : '0.00'}%
        </p>
        {feedback && (
          <p
            className={`text-lg text-center ${
              feedback.startsWith('Correct') || feedback.startsWith('Great') ? 'text-green-400 animate-bounce' : 'text-red-400'
            }`}
          >
            {feedback}
          </p>
        )}

        {/* Explanation and Visualization */}
        {showExplanation && (
          <div className="mt-4 p-2 bg-indigo-800 rounded">
            <p className="text-sm text-yellow-300">Result:</p>
            <BitDisplay number={calculateCorrectAnswer()} highlightBits={getChangedBits()} />
            <pre className="text-sm text-yellow-300 whitespace-pre-wrap mt-2">{getExplanation()}</pre>
          </div>
        )}

        {/* Next Question Button */}
        <Button
          onClick={generateQuestion}
          className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
        >
          Next Question
        </Button>
      </div>
    </div>
  );
}
