'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, FileText, Upload, Calendar, MapPin, Award, CheckCircle, Clock, AlertCircle, LogOut } from 'lucide-react'

interface UserData {
  id: string
  email: string
  first_name: string
  last_name: string
  country: string
  education_level: string
  career_stage: string
  field_of_study: string
  role_type: 'student' | 'entrepreneur'
  payment_status: 'pending' | 'paid' | 'failed'
  application_status: 'pending' | 'accepted' | 'rejected' | 'waitlisted'
  created_at: string
}

interface Document {
  id: string
  document_type: string
  file_name: string
  file_size: number
  uploaded_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user data and documents
    const loadData = async () => {
      try {
        // Get user info from localStorage
        const userId = localStorage.getItem('userId')
        const userEmail = localStorage.getItem('userEmail')
        
        if (!userId || !userEmail) {
          console.log('❌ No user data found, redirecting to registration')
          router.push('/registration')
          return
        }

        console.log('🔍 Dashboard - Loading data for user:', userId)
        
        // Load user data from API
        const userResponse = await fetch(`/api/users/${userId}`)
        if (userResponse.ok) {
          try {
            const userData = await userResponse.json()
            setUser(userData.user)
          } catch (error) {
            console.error('Failed to parse user response:', error)
          }
        } else {
          // Fallback to user info from localStorage
          setUser({
            id: userId,
            email: userEmail,
            first_name: localStorage.getItem('userFirstName') || 'User',
            last_name: localStorage.getItem('userLastName') || 'Name',
            country: localStorage.getItem('userCountry') || 'Unknown',
            education_level: localStorage.getItem('userEducation') || 'Education',
            career_stage: localStorage.getItem('userCareer') || 'Stage',
            field_of_study: localStorage.getItem('userField') || 'Field',
            role_type: (localStorage.getItem('userRole') as 'student' | 'entrepreneur') || 'student',
            payment_status: 'paid',
            application_status: 'pending',
            created_at: new Date().toISOString()
          })
        }

        // Load documents
        const response = await fetch(`/api/documents?userId=${userId}`)
        if (response.ok) {
          try {
            const data = await response.json()
            setDocuments(data.documents || [])
          } catch (error) {
            console.error('Failed to parse documents response:', error)
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-800 bg-green-100'
      case 'pending':
        return 'text-yellow-800 bg-yellow-100'
      case 'failed':
        return 'text-red-800 bg-red-100'
      default:
        return 'text-gray-800 bg-gray-100'
    }
  }

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-800 bg-green-100'
      case 'rejected':
        return 'text-red-800 bg-red-100'
      case 'waitlisted':
        return 'text-yellow-800 bg-yellow-100'
      case 'pending':
        return 'text-blue-800 bg-blue-100'
      default:
        return 'text-gray-800 bg-gray-100'
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'cv':
        return 'CV/Resume'
      case 'passport':
        return 'Passport'
      case 'certificate':
        return 'Academic Certificates'
      case 'motivation_essay':
        return 'Motivation Essay'
      default:
        return type
    }
  }

  const allDocumentsUploaded = ['cv', 'passport', 'certificate', 'motivation_essay'].every(type =>
    documents.some(doc => doc.document_type === type)
  )

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    
    // Redirect to home page
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please complete your registration first.</p>
          <Link
            href="/registration"
            className="inline-flex items-center px-6 py-3 bg-indigo-900 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors"
          >
            Go to Registration
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
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
              </Link>
              <span className="ml-2 text-sm text-gray-600">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.first_name}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-800 transition-colors hover:bg-red-50 px-3 py-2 rounded-lg"
                title="Logout"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-20">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your GBI Dashboard
          </h1>
          <p className="text-gray-600">
            Track your application progress for the 2026 Amsterdam Summit
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.payment_status)}`}>
                {user.payment_status.charAt(0).toUpperCase() + user.payment_status.slice(1)}
              </span>
            </div>
            <div className="flex items-center">
              {user.payment_status === 'paid' ? (
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              ) : (
                <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              )}
              <div>
                <p className="text-sm text-gray-800">Registration Fee</p>
                <p className="font-semibold text-gray-900">USD $15</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getApplicationStatusColor(user.application_status)}`}>
                {user.application_status.charAt(0).toUpperCase() + user.application_status.slice(1)}
              </span>
            </div>
            <div className="flex items-center">
              {user.application_status === 'pending' ? (
                <Clock className="h-8 w-8 text-blue-600 mr-3" />
              ) : user.application_status === 'accepted' ? (
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
              )}
              <div>
                <p className="text-sm text-gray-800">Review in Progress</p>
                <p className="font-semibold text-gray-900">Decision by Apr 12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${allDocumentsUploaded ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100'}`}>
                {documents.length}/4
              </span>
            </div>
            <div className="flex items-center">
              {allDocumentsUploaded ? (
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              ) : (
                <Upload className="h-8 w-8 text-yellow-600 mr-3" />
              )}
              <div>
                <p className="text-sm text-gray-800">Required Documents</p>
                <p className="font-semibold text-gray-900">{allDocumentsUploaded ? 'Complete' : 'In Progress'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-800">Name:</span>
                <span className="font-medium text-gray-900">{user.first_name} {user.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800">Email:</span>
                <span className="font-medium text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800">Country:</span>
                <span className="font-medium text-gray-900">{user.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800">Role:</span>
                <span className="font-medium text-gray-900" style={{ textTransform: 'capitalize' }}>{user.role_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800">Education:</span>
                <span className="font-medium text-gray-900" style={{ textTransform: 'capitalize' }}>{user.education_level.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800">Field:</span>
                <span className="font-medium text-gray-900">{user.field_of_study}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Uploaded Documents</h2>
            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-indigo-900 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{getDocumentTypeLabel(doc.document_type)}</p>
                        <p className="text-sm text-gray-600">{doc.file_name}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {(doc.file_size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No documents uploaded yet</p>
                <Link
                  href="/documents"
                  className="inline-flex items-center px-4 py-2 bg-indigo-900 text-white font-medium rounded-lg hover:bg-indigo-800 transition-colors"
                >
                  Upload Documents
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Program Information */}
        <div className="bg-indigo-900 text-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">2026 Amsterdam Summit</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 mr-3" />
              <div>
                <p className="font-semibold text-white">April 19-26, 2026</p>
                <p className="text-indigo-200">7 Days Program</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-6 w-6 mr-3" />
              <div>
                <p className="font-semibold text-white">Amsterdam, Netherlands</p>
                <p className="text-indigo-200">Capital City</p>
              </div>
            </div>
            <div className="flex items-center">
              <Award className="h-6 w-6 mr-3" />
              <div>
                <p className="font-semibold text-white">Fully Sponsored</p>
                <p className="text-indigo-200">For Selected Candidates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {!allDocumentsUploaded && (
            <Link
              href="/documents"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-900 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Documents
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
