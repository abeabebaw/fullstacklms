import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../../components/student/Hero';
import Campanies from '../../components/student/Campanies';
import CoursesSection from '../../components/student/CoursesSection';
import TestimonialSection from '../../components/student/TestimonialSection';
import CallToAction from '../../components/student/CallToAction';
import Footer from '../../components/student/Footer';

const Home = () => {
  return (
    <div className="flex flex-col items-center  space-y-7 text-center">
     <Hero/>
    <Campanies />
  <CoursesSection/>
  <TestimonialSection/>
  <CallToAction/>
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
        <Footer />
      </footer>
      </div>
    
  );
};

export default Home;