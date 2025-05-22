import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Building, MapPin, Users, ArrowRight, Sparkles, Star, TrendingUp, Award } from 'lucide-react';

const Home = () => {
  // Featured jobs - normally would come from an API
  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Full-time',  
      salary: '₹12,00,000 - ₹15,00,000',
      logo: 'https://images.pexels.com/photos/5926393/pexels-photo-5926393.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'InnovateTech',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '₹13,00,000 - ₹16,00,000',
      logo: 'https://images.pexels.com/photos/15031637/pexels-photo-15031637/free-photo-of-letter-i-in-neon-light.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      company: 'CloudSys',
      location: 'Remote',
      type: 'Full-time',
      salary: '₹11,00,000 - ₹14,00,000',
      logo: 'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
    },
    {
      id: 4,
      title: 'UX/UI Designer',
      company: 'DesignHub',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '₹9,00,000 - ₹12,00,000',
      logo: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
    }
  ];

  // Popular categories
  const categories = [
    { name: 'Software Development', count: 1240, icon: <Briefcase className="h-6 w-6" /> },
    { name: 'Marketing & Sales', count: 840, icon: <Users className="h-6 w-6" /> },
    { name: 'Design', count: 450, icon: <Briefcase className="h-6 w-6" /> },
    { name: 'Customer Service', count: 320, icon: <Users className="h-6 w-6" /> },
    { name: 'Finance', count: 250, icon: <Briefcase className="h-6 w-6" /> },
    { name: 'Healthcare', count: 610, icon: <Users className="h-6 w-6" /> }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-200 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Find Your Dream Job Today
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
              Your Next Career Move Starts Here
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Connect with top employers and discover opportunities that match your skills and aspirations.
            </p>

            {/* Search Form */}
            <div className="mt-12 bg-white/10 backdrop-blur-lg p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row border border-white/20">
              <div className="flex-grow flex items-center px-6 py-4 md:py-0 border-b md:border-b-0 md:border-r border-white/10">
                <Search className="h-5 w-5 text-blue-200 mr-3" />
                <input
                  type="text"
                  placeholder="Job title, company, or keywords"
                  className="flex-grow bg-transparent text-white placeholder-blue-200 focus:outline-none"
                />
              </div>
              <div className="flex-grow flex items-center px-6 py-4 md:py-0 border-b md:border-b-0 md:border-r border-white/10">
                <MapPin className="h-5 w-5 text-blue-200 mr-3" />
                <input
                  type="text"
                  placeholder="Location"
                  className="flex-grow bg-transparent text-white placeholder-blue-200 focus:outline-none"
                />
              </div>
              <button className="mt-3 md:mt-0 mx-4 md:mx-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium transform hover:scale-105">
                Search Jobs
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-blue-200 text-sm">
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                Software Engineer
              </span>
              <span className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Product Manager
              </span>
              <span className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                Data Scientist
              </span>
              <span className="flex items-center">
                <Sparkles className="h-4 w-4 mr-1" />
                UX Designer
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Featured Jobs</h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover opportunities from leading companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredJobs.map(job => (
              <div 
                key={job.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <img 
                      src={job.logo} 
                      alt={job.company} 
                      className="h-14 w-14 rounded-xl object-cover mr-4 border border-gray-100 shadow-sm"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                      <p className="text-blue-600 font-medium">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm">{job.type}</span>
                    </div>
                    <div className="text-gray-700 font-medium">
                      {job.salary}
                    </div>
                  </div>
                  
                  <Link 
                    to={`/jobs/${job.id}`}
                    className="mt-6 block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/jobs"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 group"
            >
              View all jobs
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Popular Categories</h2>
            <p className="mt-4 text-xl text-gray-600">
              Explore opportunities by category
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="flex items-center p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                  {category.icon}
                </div>
                <div className="ml-6 flex-grow">
                  <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} jobs available</p>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors duration-300 transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Top Companies Hiring</h2>
            <p className="mt-4 text-xl text-gray-600">
              Connect with leading employers across industries
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="flex justify-center items-center p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <Building className="h-14 w-14 text-blue-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold">Ready to Find Your Next Opportunity?</h2>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
            Join thousands of professionals who have already found their dream jobs on our platform.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              Create an Account
            </Link>
            <Link 
              to="/jobs" 
              className="px-8 py-4 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-800 transition-all duration-300 transform hover:scale-105"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;