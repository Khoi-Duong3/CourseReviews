import React, { useState } from 'react'

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

// Score selector component
const ScoreSelector = ({ label, value, onChange, colorGetter }) => {
  return (
      <div className="flex flex-col items-center mb-4">
        <span className="mb-2 text-sm text-gray-600 uppercase tracking-wide">{label}</span>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((score) => (
              <button
                  key={score}
                  type="button"
                  onClick={() => onChange(score)}
                  className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-sm ${
                      value === score ? colorGetter(score) : 'bg-gray-200 hover:bg-gray-300'
                  }`}
              >
                {score}
              </button>
          ))}
        </div>
      </div>
  )
}

// Display a single review
const ReviewDisplay = ({ text, difficulty, value, overall }) => {
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
            <div className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-sm ${getDiffColor(difficulty)}`}>
              {difficulty}
            </div>
          </div>

          {/* Value */}
          <div className="flex flex-col items-center">
          <span className="mb-1 text-xs text-gray-600 uppercase tracking-wide">
            Value
          </span>
            <div className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-sm ${getScoreColor(value)}`}>
              {value}
            </div>
          </div>

          {/* Overall */}
          <div className="flex flex-col items-center">
          <span className="mb-1 text-xs text-gray-600 uppercase tracking-wide">
            Overall
          </span>
            <div className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-sm ${getScoreColor(overall)}`}>
              {overall}
            </div>
          </div>
        </div>
      </section>
  )
}

// Form to submit a new review
const ReviewForm = ({ onSubmit }) => {
  const [reviewText, setReviewText] = useState('')
  const [difficulty, setDifficulty] = useState(3)
  const [value, setValue] = useState(3)
  const [overall, setOverall] = useState(3)
 
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      text: reviewText,
      difficulty,
      value,
      overall
    })
    // Reset form
    setReviewText('')
    setDifficulty(3)
    setValue(3)
    setOverall(3)
  }

  return (
      <form onSubmit={handleSubmit} className="w-3/4 mx-auto bg-white rounded-md shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-yellow-500 mb-4">Write a Review</h3>

        <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this course..."
            className="w-full p-3 border border-gray-300 rounded-md mb-6 min-h-[100px] focus:ring-yellow-500 focus:border-yellow-500"
            required
        />

        <div className="flex flex-col md:flex-row md:justify-between space-y-6 md:space-y-0 mb-6">
          <ScoreSelector
              label="Difficulty"
              value={difficulty}
              onChange={setDifficulty}
              colorGetter={getDiffColor}
          />

          <ScoreSelector
              label="Value"
              value={value}
              onChange={setValue}
              colorGetter={getScoreColor}
          />

          <ScoreSelector
              label="Overall"
              value={overall}
              onChange={setOverall}
              colorGetter={getScoreColor}
          />
        </div>

        <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-md w-full md:w-auto md:self-end transition duration-200"
        >
          Submit Review
        </button>
      </form>
  )
}

// Main Review component that combines both display and form
const Review = ({
                  mode = 'display', // 'display', 'write', or 'both'
                  text,
                  difficulty,
                  value,
                  overall,
                  onSubmitReview
                }) => {
  const handleSubmitReview = (reviewData) => {
    if (onSubmitReview) {
      onSubmitReview(reviewData)
    }
  }

  if (mode === 'display') {
    return <ReviewDisplay text={text} difficulty={difficulty} value={value} overall={overall} />
  }

  if (mode === 'write') {
    return <ReviewForm onSubmit={handleSubmitReview} />
  }

  // Both display and write modes
  return (
      <div className="space-y-8">
        <ReviewForm onSubmit={handleSubmitReview} />
        {text && <ReviewDisplay text={text} difficulty={difficulty} value={value} overall={overall} />}
      </div>
  )
}

export default Review