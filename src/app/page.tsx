'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight, Calendar, MapPin, Users, Globe, Award } from 'lucide-react'

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-x-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${scrollY * 0.5}px)`,
          willChange: 'transform'
        }}
      />

      {/* Sticky Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Custom SVG Logo */}
              <div className="relative w-12 h-12">
                <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
                  <path d="M4 32 L44 32 L44 36 L4 36 Z" fill="currentColor" className="text-indigo-900" />
                  <path d="M4 28 L44 28 L44 32 L4 32 Z" fill="currentColor" className="text-indigo-800" />
                  <path d="M4 24 L44 24 L44 28 L4 28 Z" fill="currentColor" className="text-indigo-700" />
                  <rect x="8" y="20" width="4" height="12" fill="currentColor" className="text-indigo-900" />
                  <rect x="36" y="20" width="4" height="12" fill="currentColor" className="text-indigo-900" />
                  <path d="M12 12 L36 12" stroke="currentColor" strokeWidth="2" className="text-indigo-600" />
                  <path d="M14 16 L34 16" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                  <path d="M34 8 L14 10" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" className="text-indigo-900" />
                  <circle cx="36" cy="12" r="2" fill="currentColor" className="text-indigo-900" />
                  <circle cx="14" cy="16" r="2" fill="currentColor" className="text-indigo-800" />
                  <circle cx="34" cy="16" r="2" fill="currentColor" className="text-indigo-800" />
                  <circle cx="34" cy="8" r="2" fill="currentColor" className="text-indigo-800" />
                  <circle cx="14" cy="10" r="2" fill="currentColor" className="text-indigo-800" />
                </svg>
              </div>
              <span className="ml-3 text-sm font-semibold text-gray-800 tracking-wider hidden sm:inline uppercase">Global Bridge Initiative</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#about" className="text-gray-800 hover:text-indigo-900 transition-all duration-300 font-semibold tracking-wide hover:scale-105 transform">About</Link>
              <Link href="#program" className="text-gray-800 hover:text-indigo-900 transition-all duration-300 font-semibold tracking-wide hover:scale-105 transform">Program</Link>
              <Link href="#timeline" className="text-gray-800 hover:text-indigo-900 transition-all duration-300 font-semibold tracking-wide hover:scale-105 transform">Timeline</Link>
              <Link href="#contact" className="text-gray-800 hover:text-indigo-900 transition-all duration-300 font-semibold tracking-wide hover:scale-105 transform">Contact</Link>
              <Link
                href="/registration"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-900 to-blue-900 text-white font-bold tracking-wide rounded-lg hover:from-indigo-800 hover:to-blue-800 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl"
              >
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <Link href="#about" className="text-gray-800 hover:text-indigo-900 transition-all duration-300 font-semibold tracking-wide hover:scale-105 transform">About</Link>
                <Link href="#program" className="text-gray-800 hover:text-indigo-900 transition-all duration-300 font-semibold tracking-wide hover:scale-105 transform">Program</Link>
                <Link href="#timeline" className="text-gray-800 hover:text-indigo-900 transition-all duration-300 font-semibold tracking-wide hover:scale-105 transform">Timeline</Link>
                <Link href="#contact" className="text-gray-800 hover:text-indigo-900 transition-all duration-300 font-semibold tracking-wide hover:scale-105 transform">Contact</Link>
                <Link
                  href="/registration"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-900 to-blue-900 text-white font-bold tracking-wide rounded-lg hover:from-indigo-800 hover:to-blue-800 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl"
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            willChange: 'transform'
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              <span className="block">Global Bridge</span>
              <span className="block text-indigo-900">Initiative</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
              Connecting ambitious minds worldwide through mentorship, networking, and transformative experiences in Amsterdam.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/registration"
                className="inline-flex items-center px-8 py-4 bg-indigo-900 text-white font-bold rounded-xl hover:bg-indigo-800 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Apply Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm text-indigo-900 font-bold rounded-xl border-2 border-indigo-900 hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-indigo-900 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-indigo-900 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* About Section with Parallax */}
      <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-sm">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-100/50"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            willChange: 'transform'
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-gray-900 mb-6 tracking-wide">About GBI</h2>
            <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-light italic mb-8">
              Building bridges between cultures, careers, and continents through exceptional mentorship experiences.
            </p>
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-6 rounded-2xl shadow-xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">A Historic First</h3>
              <p className="text-lg leading-relaxed">
                The Global Bridge Initiative is the <span className="font-bold text-yellow-300">first-ever program</span> of its kind, 
                designed to create unprecedented global connections through mentorship. 
                <span className="font-bold text-yellow-300"> 2026 applicants will be pioneers</span>, 
                joining the inaugural cohort that will shape the future of international collaboration and innovation.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <div className="group">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <h3 className="text-3xl lg:text-4xl font-serif font-light text-indigo-900 mb-6 tracking-wide">Our Mission</h3>
                <p className="text-gray-800 leading-relaxed text-xl font-light">
                  To empower talented individuals from diverse backgrounds by providing access to world-class mentorship, 
                  professional development opportunities, and a global network of leaders and innovators.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <h3 className="text-3xl lg:text-4xl font-serif font-light text-indigo-900 mb-6 tracking-wide">Our Vision</h3>
                <p className="text-gray-800 leading-relaxed text-xl font-light">
                  A world where geographical boundaries don't limit potential, where every ambitious mind has the 
                  opportunity to connect, learn, and contribute to global progress through meaningful relationships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Highlights with Parallax */}
      <section id="program" className="relative py-20 px-4 sm:px-6 lg:px-8 pb-32">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-200/50"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
            willChange: 'transform'
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">2026 Amsterdam Summit</h2>
            <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
              An intensive 7-day mentorship and networking program in the heart of Europe.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="group">
              <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <MapPin className="h-16 w-16 text-indigo-900 mb-6 mx-auto" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
                <p className="text-gray-800">Amsterdam, Netherlands - The capital city and global hub of innovation and culture</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <Users className="h-16 w-16 text-indigo-900 mb-6 mx-auto" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Participants</h3>
                <p className="text-gray-800">Selected students, graduates, entrepreneurs, and mentors from across the globe</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <Award className="h-16 w-16 text-indigo-900 mb-6 mx-auto" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Selection</h3>
                <p className="text-gray-800">Merit-based selection focusing on academic excellence, leadership, and impact potential</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white p-8 lg:p-12 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
            <div className="text-center mb-10">
              <h3 className="text-4xl lg:text-5xl font-serif font-light tracking-wider mb-4">Fully Sponsored Experience</h3>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-green-400 mx-auto mb-6"></div>
              <p className="text-xl lg:text-2xl font-light leading-relaxed max-w-3xl mx-auto">
                All successful candidates receive comprehensive sponsorship including:
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <ul className="space-y-6">
                <li className="flex items-start group">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mr-5 mt-1 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"></div>
                  <div>
                    <span className="font-serif text-lg font-medium leading-relaxed block">Return International Travel</span>
                    <span className="text-gray-200 text-sm block mt-1">Complete airfare coverage for international and local travel</span>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mr-5 mt-1 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"></div>
                  <div>
                    <span className="font-serif text-lg font-medium leading-relaxed block">Visa Support</span>
                    <span className="text-gray-200 text-sm block mt-1">Complete visa costs and processing assistance</span>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mr-5 mt-1 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"></div>
                  <div>
                    <span className="font-serif text-lg font-medium leading-relaxed block">Premium Accommodation</span>
                    <span className="text-gray-200 text-sm block mt-1">7 days and 6 nights in premium Amsterdam locations</span>
                  </div>
                </li>
              </ul>
              <ul className="space-y-6">
                <li className="flex items-start group">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mr-5 mt-1 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"></div>
                  <div>
                    <span className="font-serif text-lg font-medium leading-relaxed block">Gourmet Meals</span>
                    <span className="text-gray-200 text-sm block mt-1">All meals as per official program meal plan</span>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mr-5 mt-1 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"></div>
                  <div>
                    <span className="font-serif text-lg font-medium leading-relaxed block">Full Program Access</span>
                    <span className="text-gray-200 text-sm block mt-1">All activities, events, and workshops included</span>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mr-5 mt-1 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"></div>
                  <div>
                    <span className="font-serif text-lg font-medium leading-relaxed block">Professional Development</span>
                    <span className="text-gray-200 text-sm block mt-1">Exclusive workshops and networking sessions</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* What's Not Included Section */}
          <div className="bg-white border-2 border-gray-200 p-8 lg:p-12 rounded-2xl shadow-lg mt-8">
            <div className="text-center mb-10">
              <h3 className="text-4xl lg:text-5xl font-serif font-light tracking-wider text-gray-900 mb-4">What's Not Included</h3>
              <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-500 mx-auto mb-6"></div>
              <p className="text-xl lg:text-2xl font-light leading-relaxed max-w-3xl mx-auto text-gray-800">
                To maintain transparency, here are expenses that participants should plan for:
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <ul className="space-y-6">
                <li className="flex items-start group">
                  <div className="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full mr-5 mt-1 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"></div>
                  <div>
                    <span className="font-serif text-lg font-bold leading-relaxed block text-gray-900">Personal Shopping</span>
                    <span className="text-gray-800 text-sm block mt-1">Souvenirs, personal items, and shopping expenses</span>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full mr-5 mt-1 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"></div>
                  <div>
                    <span className="font-serif text-lg font-bold leading-relaxed block text-gray-900">Travel Insurance</span>
                    <span className="text-gray-800 text-sm block mt-1">Personal travel and health insurance coverage</span>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full mr-5 mt-1 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"></div>
                  <div>
                    <span className="font-serif text-lg font-bold leading-relaxed block text-gray-900">Optional Activities</span>
                    <span className="text-gray-800 text-sm block mt-1">Non-program related tours or excursions</span>
                  </div>
                </li>
              </ul>
              <ul className="space-y-6">
                <li className="flex items-start group">
                  <div className="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full mr-5 mt-1 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"></div>
                  <div>
                    <span className="font-serif text-lg font-bold leading-relaxed block text-gray-900">Personal Expenses</span>
                    <span className="text-gray-800 text-sm block mt-1">Incidental personal costs and tips</span>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full mr-5 mt-1 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"></div>
                  <div>
                    <span className="font-serif text-lg font-bold leading-relaxed block text-gray-900">Extended Stay</span>
                    <span className="text-gray-800 text-sm block mt-1">Accommodation beyond program dates</span>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full mr-5 mt-1 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"></div>
                  <div>
                    <span className="font-serif text-lg font-bold leading-relaxed block text-gray-900">Emergency Fund</span>
                    <span className="text-gray-800 text-sm block mt-1">Personal emergency or contingency funds</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline with Unique Parallax */}
      <section id="timeline" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-sm">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-indigo-50/30"
          style={{
            transform: `translateY(${scrollY * 0.05}px)`,
            willChange: 'transform'
          }}
        />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * -0.03}px)`,
            willChange: 'transform'
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Important Dates</h2>
            <p className="text-lg md:text-xl text-gray-800">Mark your calendar for key milestones</p>
          </div>
          
          <div className="space-y-8">
            {[
              { date: 'Now', title: 'Registration Opens', desc: 'Applications are now being accepted' },
              { date: 'Mar 31', title: 'Registration Deadline', desc: 'All applications must be submitted by March 31st' },
              { date: 'Apr 1-15', title: 'Selection Review', desc: 'Merit-based evaluation of all applications' },
              { date: 'Apr 12', title: 'Decision Emails', desc: 'All applicants notified of selection results' },
              { date: 'Apr 19', title: 'Departure to Amsterdam', desc: 'Selected participants begin their journey' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-6 group">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg transform transition-all duration-300 group-hover:scale-110">
                  {item.date}
                </div>
                <div className="flex-1 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow-md transform transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-800">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20 px-4 sm:px-6 lg:px-8 pb-32">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-indigo-200/30"
          style={{
            transform: `translateY(${scrollY * 0.05}px)`,
            willChange: 'transform'
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-lg md:text-xl text-gray-800 mb-8">Have questions? We're here to help</p>
          <div className="bg-white/90 backdrop-blur-sm p-8 lg:p-12 rounded-2xl shadow-2xl max-w-2xl mx-auto transform transition-all duration-300 hover:scale-[1.02]">
            <p className="text-gray-800 mb-6 text-lg">
              For inquiries about the Global Bridge Initiative program, application process, or sponsorship opportunities,
              please contact us at:
            </p>
            <p className="text-2xl lg:text-3xl font-bold text-indigo-900">info@gbi.global</p>
            <p className="text-gray-800 mt-4">We typically respond within 2-3 business days.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Global Bridge Initiative</h3>
              <p className="text-gray-400">Connecting ambitious minds worldwide through transformative mentorship experiences.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-1">
                <li><Link href="/registration" className="text-gray-400 hover:text-white transition-colors">Apply Now</Link></li>
                <li><Link href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#program" className="text-gray-400 hover:text-white transition-colors">Program Details</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">Email: info@gbi.global</p>
              <p className="text-gray-400">Response time: 2-3 business days</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2026 Global Bridge Initiative. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
