import React from 'react'
import coops from '../coops.json'
import Post from './Post';

const COOPS = ({isHome = false}) => {
  const coopPosts = isHome? coops.slice(0,3) : coops;

  return (
    <section class="bg-red-950 px-4 py-10">
      <div class="container-xl lg:container m-auto">
        <h2 class="text-3xl font-bold text-yellow-500 mb-6 text-center">
          Highlighted Courses
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {coopPosts.map((coop) => (
            <Post key={coop.id} coop={coop}/>
          ))}
        </div>
      </div>
    </section>
  )
};

export default COOPS