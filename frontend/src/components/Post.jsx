import React from 'react'
import { useState } from 'react'

const Post = ({coop}) => {
    const [showAll, setShowAll] = useState(false);

    let description = coop.description;

    if (!showAll) {
        description = description.substring(0,80) + '...';
    }

  return (
    <div class="bg-white rounded-xl shadow-md relative">
            <div className="p-4">
              <div class="mb-6">
                <div className="text-black my-2">{coop.type}</div>
                <h3 class="text-black text-xl font-bold">{coop.title}</h3>
              </div>

              <div className=" text-black mb-5">
               {description}
              </div>

              <button onClick={() => setShowAll((prevState) => !prevState)}className='text-red-950 mb-5 hover:text-amber-700'>{ showAll ? 'Show Less' : 'Show More'}</button>

              <div class="border border-gray-100 mb-5"></div>

              <div class="flex flex-col lg:flex-row justify-between mb-4">
                <div class="mb-3"></div>
                <a
                  href="jobs.html"
                  class="h-[36px] bg-red-900 hover:bg-red-950 text-yellow-500 font-bold px-4 py-2 rounded-lg text-center text-sm"
                >
                 More Details
                </a>
              </div>
            </div>
          </div>
  )
}

export default Post