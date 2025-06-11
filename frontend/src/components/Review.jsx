import React from 'react'
import ReviewForm from './ReviewForm'

// Color mappings for numeric and graded scores
const getScoreColor = (score) => {
  switch (score) {
    case 1: return 'bg-red-500'
    case 2: return 'bg-orange-400'
    case 3: return 'bg-yellow-400'
    case 4: return 'bg-lime-500'
    case 5: return 'bg-green-500'
    default: return 'bg-gray-300'
  }
}

const getDiffColor = (score) => {
  switch (score) {
    case 1: return 'bg-green-500'
    case 2: return 'bg-lime-400'
    case 3: return 'bg-yellow-400'
    case 4: return 'bg-orange-400'
    case 5: return 'bg-red-500'
    default: return 'bg-gray-300'
  }
}

export const getGradeColor = (grade) => {
  switch (grade) {
    case "F": return 'bg-red-650'
    case "D-": return 'bg-red-600'
    case "D":  return 'bg-red-500'
    case "D+": return 'bg-orange-500'
    case "C-": return 'bg-orange-400'
    case "C":  return 'bg-yellow-400'
    case "C+": return 'bg-yellow-300'
    case "B-": return 'bg-lime-300'
    case "B":  return 'bg-lime-400'
    case "B+": return 'bg-green-300'
    case "A-": return 'bg-green-400'
    case "A":  return 'bg-green-500'
    case "A+": return 'bg-green-600'
    default:   return 'bg-gray-300'
  }
}

// Display-only component
const ReviewDisplay = ({ text, difficulty, value, overall, grade }) => (
  <section className="w-3/4 mx-auto bg-white rounded-md shadow-md p-4 border border-gray-200">
    <p className="text-gray-800 mb-6">{text}</p>
    <div className="grid grid-cols-4 gap-4">
      {/* Difficulty */}
      <div className="flex flex-col items-center">
        <span className="mb-1 text-xs text-gray-600 uppercase tracking-wide">Difficulty</span>
        <div className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-sm ${getDiffColor(difficulty)}`}>{difficulty}</div>
      </div>

      {/* Value */}
      <div className="flex flex-col items-center">
        <span className="mb-1 text-xs text-gray-600 uppercase tracking-wide">Value</span>
        <div className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-sm ${getScoreColor(value)}`}>{value}</div>
      </div>

      {/* Overall */}
      <div className="flex flex-col items-center">
        <span className="mb-1 text-xs text-gray-600 uppercase tracking-wide">Overall</span>
        <div className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-sm ${getScoreColor(overall)}`}>{overall}</div>
      </div>

      {/* Grade */}
      <div className="flex flex-col items-center">
        <span className="mb-1 text-xs text-gray-600 uppercase tracking-wide">Grade Achieved</span>
        <div className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-sm ${getGradeColor(grade)}`}>{grade}</div>
      </div>
    </div>
  </section>
)

// Wrapper component to switch between display and write modes
const Review = ({
  mode = 'display', // 'display', 'write', or 'both'
  text,
  difficulty,
  value,
  overall,
  grade,
  onSubmitReview
}) => {
  if (mode === 'display') {
    return <ReviewDisplay text={text} difficulty={difficulty} value={value} overall={overall} grade={grade} />
  }
  if (mode === 'write') {
    return <ReviewForm onSubmitReview={onSubmitReview} />
  }
  // both: show form then display
  return (
    <section className="bg-red-950 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <div className="space-y-8">
          <ReviewForm onSubmitReview={onSubmitReview} />
          {text && <ReviewDisplay text={text} difficulty={difficulty} value={value} overall={overall} grade={grade} />}
        </div>
      </div>
    </section>
  )
}

export default Review
