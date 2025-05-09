import React from 'react'
import coops from '../coops.json'
import Post from './Post';
import coursesData from '../mcmaster_courses_full.json'
import { NavLink } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';


const HomeCourses = ({isHome = false, limit = Infinity}) => {
  const allCourses = []

  for (const course of Object.values(coursesData)){
    for (const [code, info] of Object.entries(course)){
      allCourses.push({code : code, name: info.name, description: info.description, prereq: info.prerequisites, antireq: info.antirequisites})
    }
  }

  const coursesToShow = isHome ? allCourses.slice(0,6) : allCourses.slice(0, limit);

  return (
    <section class="bg-red-950 px-4 py-10">
      <div class="container-xl lg:container m-auto">
        <h2 class="text-3xl font-bold text-yellow-500 mb-6 text-center">
          Highlighted Courses
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {coursesToShow.map((course) => (
            <Post key={course.code} course={course}/>
          ))}
        </div>
      </div>
      {isHome && (
        <div className="mt-8 text-center">
          <NavLink to='/dashboard' className="bg-yellow-500 text-black py-3 px-40 rounded hover:bg-yellow-600 inline-block">
            Browse More
          </NavLink>
        </div>
      )}
        
      
    </section>
  )
};

export default HomeCourses