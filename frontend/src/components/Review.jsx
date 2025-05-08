import React from 'react'

const getScoreColor = (score) => {
  switch (score) {
    case 1:
      return 'bg-red-500'
    case 2:
      return 'bg-orange-400'
    case 3:
      return 'bg-yellow-400'
    case 4:
      return 'bg-lime-500'
    case 5:
      return 'bg-green-500'
    default:
      return 'bg-gray-300'
  }
}

const getDiffColor = (score) => {
  switch (score) {
    case 1:
      return 'bg-green-500'
    case 2:
      return 'bg-lime-400'
    case 3:
      return 'bg-yellow-400'
    case 4:
      return 'bg-orange-400'
    case 5:
      return 'bg-red-500'
    default:
      return 'bg-gray-300'
  }
}
const Review = ({
  text = "this course is hard as hell",
  difficulty = 5,
  value = 2,
  overall = 4
}) => {
  return (
    <section className="w-3/4 mx-auto bg-white rounded-md shadow-md p-4 border border-gray-200">
      {/* Main Review Text */}
      <p className="text-gray-800 mb-6">{text}</p>

      {/* Score Labels Above Squares */}
      <div className="grid grid-cols-3 gap-4">
        {/* Difficulty */}
        <div className="flex flex-col items-center">
          <span className="mb-1 text-xs text-gray-600 uppercase tracking-wide">
            Difficulty
          </span>
          <div
            className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-sm ${getDiffColor(
              difficulty
            )}`}
          >
            {difficulty}
          </div>
        </div>

        {/* Value */}
        <div className="flex flex-col items-center">
          <span className="mb-1 text-xs text-gray-600 uppercase tracking-wide">
            Value
          </span>
          <div
            className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-sm ${getScoreColor(
              value
            )}`}
          >
            {value}
          </div>
        </div>

        {/* Overall */}
        <div className="flex flex-col items-center">
          <span className="mb-1 text-xs text-gray-600 uppercase tracking-wide">
            Overall
          </span>
          <div
            className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-sm ${getScoreColor(
              overall
            )}`}
          >
            {overall}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Review
