import { useAuth0 } from '@auth0/auth0-react'
import React, { useState, useEffect } from 'react'

const ReviewForm = ({ onSubmitReview }) => {
    const [text,       setText]       = useState('')
    const [difficulty, setDifficulty] = useState("")
    const [value,      setValue]      = useState("")
    const [overall,    setOverall]    = useState("")

    const handleSubmit = e => {
    e.preventDefault()
    onSubmitReview({
      text,
      difficulty: parseInt(difficulty, 10),
      value:      parseInt(value, 10),
      overall:    parseInt(overall, 10),
    })
    // clear form for next time
    setText('')
    setDifficulty("")
    setValue("")
    setOverall("")
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h4 className="text-xl font-semibold mb-4">Write a Review</h4>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What did you think of this course?"
        className="w-full border rounded p-2 mb-4"
        rows={4}
      />

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <label className='flex-1'>
            <span className="block mb-1 font-medium">Difficulty</span>
            <select
                value = {difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className='"block w-full border rounded p-2'
                required
            >
                <option value="">Select...</option>
                <option value="1">(1) Very Easy</option>
                <option value="2">(2) Easy</option>
                <option value="3">(3) Moderate</option>
                <option value="4">(4) Hard</option>
                <option value="5">(5) Very Hard</option>
            </select>
        </label>

        <label className='flex-1'>
            <span className="block mb-1 font-medium">Value</span>
            <select
                value = {value}
                onChange={e => setValue(e.target.value)}
                className='"block w-full border rounded p-2'
                required
            >
                <option value="">Select...</option>
                <option value="1">(1) Useless</option>
                <option value="2">(2) Not Insightful</option>
                <option value="3">(3) Niche</option>
                <option value="4">(4) Insightful</option>
                <option value="5">(5) Very Useful</option>
            </select>
        </label>

        <label className='flex-1'>
            <span className="block mb-1 font-medium">Overall</span>
            <select
                value = {overall}
                onChange={e => setOverall(e.target.value)}
                className='"block w-full border rounded p-2'
                required
            >
                <option value="">Select...</option>
                <option value="1">(1) Poor</option>
                <option value="2">(2) Disappointing</option>
                <option value="3">(3) Average</option>
                <option value="4">(4) Good</option>
                <option value="5">(5) Excellent</option>
            </select>
        </label>

      </div>

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
      >
        Submit Review
      </button>
    </form>
  )
}

export default ReviewForm