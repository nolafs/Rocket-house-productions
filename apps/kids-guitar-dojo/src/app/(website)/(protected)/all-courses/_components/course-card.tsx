'use client';

import Link from 'next/link';
import React from 'react';


interface Course {
  id: string;
  userId: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  isPublished: boolean;
  
}

interface CourseCardProps{
  course: Course;
  isCapableUser: boolean;
  hasPurchasedCourse: boolean;
}

export function CourseCard ({ course,isCapableUser, hasPurchasedCourse}: CourseCardProps) {
  const isLocked = !isCapableUser && !hasPurchasedCourse;

  return (
    <div className="border p-4 rounded-md aspect-[4/3]">
      <img 
        src={course.imageUrl} 
        alt={course.description}
        className="mb-4 w-full h-full object-fit"
      />
      <h2 className="text-xl font-bold mb-2">{course.title}</h2>
      <p className="mb-4">{course.description}</p>
      
      {isLocked ? (
        <div className="bg-gray-100 p-4 rounded">
          <p>Premium content - upgrade to access</p>
          <Link href="/courses/upgrade" className="text-blue-600 mt-2 block">
            Upgrade Now
          </Link>
        </div>
      ) : (
        <Link 
          href={`/courses/${course?.slug}`}
          className="bg-pink-500 text-white px-4 py-2 rounded inline-block"
        >
          Continue Course
        </Link>
      )}
    </div>
  );
}