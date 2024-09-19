"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SunIcon } from "lucide-react"

const operations = [
  { name: 'Set bit', description: 'value |= (1 << bit_position)' },
  { name: 'Clear bit', description: 'value &= ~(1 << bit_position)' },
  { name: 'Toggle bit', description: 'value ^= (1 << bit_position)' },
  { name: 'Check if bit is set', description: 'if (value & (1 << bit_position))' },
  { name: 'Mask', description: 'masked_value = value & mask' },
  { name: 'Combine bytes', description: 'combined = (high_byte << 8) | low_byte' },
  { name: 'Extract low byte', description: 'low_byte = value & 0xFF' },
  { name: 'Extract high byte', description: 'high_byte = (value >> 8) & 0xFF' },
  { name: 'Multiply by 8', description: 'value <<= 3' },
  { name: 'Divide by 4', description: 'value >>= 2' },
  { name: 'Check if power of 2', description: 'if ((value & (value - 1)) == 0)' },
]

export default function BitwiseTrainer() {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operation, setOperation] = useState(operations[0])
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')

  const generateNumbers = () => {
    setNum1(Math.floor(Math.random() * 256))
    setNum2(Math.floor(Math.random() * 256))
    setOperation(operations[Math.floor(Math.random() * operations.length)])
  }

  const calculateCorrectAnswer = () => {
    switch (operation.name) {
      case 'Set bit':
        return num1 | (1 << (num2 % 8));
      case 'Clear bit':
        return num1 & ~(1 << (num2 % 8));
      case 'Toggle bit':
        return num1 ^ (1 << (num2 % 8));
      case 'Check if bit is set':
        return (num1 & (1 << (num2 % 8))) !== 0 ? 1 : 0;
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
        console.error('Unknown operation:', operation.name);
        return 0;
    }
  }

  const checkAnswer = () => {
    const correctAnswer = calculateCorrectAnswer()
    if (parseInt(userAnswer, 2) === correctAnswer) {
      setScore(score + 1)
      setFeedback('Correct!')
    } else {
      setFeedback(`Incorrect. The correct answer is ${correctAnswer.toString(2).padStart(16, '0')}.`)
    }
    setUserAnswer('')
    generateNumbers()
  }

  useEffect(() => {
    generateNumbers()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-pink-800 text-pink-300 p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-lg shadow-lg border-2 border-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-purple-900 to-pink-800 opacity-60 -z-10" />
        <h1 className="text-4xl font-bold mb-6 text-center text-pink-300 neon-text">Bitwise Trainer</h1>
        <div className="mb-4 text-lg font-mono">
          <div className="flex justify-between items-center">
            <span className="text-cyan-300">Num1:</span>
            <span className="text-yellow-300">{num1.toString(2).padStart(8, '0')}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-cyan-300">Num2:</span>
            <span className="text-yellow-300">{num2.toString(2).padStart(8, '0')}</span>
          </div>
        </div>
        <div className="mb-4 text-lg">
          <p className="text-cyan-300">Operation: <span className="text-pink-300">{operation.name}</span></p>
          <p className="text-sm text-yellow-300 mt-1">{operation.description}</p>
        </div>
        <div className="mb-4">
          <Input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer in binary"
            className="w-full bg-indigo-800 text-pink-300 border-pink-500 placeholder-pink-400"
          />
        </div>
        <Button onClick={checkAnswer} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white mb-4 neon-button">
          Submit
        </Button>
        <div className="text-center">
          <p className="text-xl mb-2 text-cyan-300">Score: <span className="text-yellow-300">{score}</span></p>
          <p className={`text-lg ${feedback.startsWith('Correct') ? 'text-green-400' : 'text-red-400'}`}>
            {feedback}
          </p>
        </div>
      </div>
      <SunIcon className="text-yellow-300 mt-8 w-12 h-12 animate-pulse" />
    </div>
  )
}