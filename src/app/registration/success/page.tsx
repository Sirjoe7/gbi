'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Upload, FileText, User } from 'lucide-react'

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      router.push('/registration')
      return
    }

    // Verify payment and get user info
    fetch(`/api/registration/success?session_id=${sessionId}`)
      .then(async response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return response.json()
      })
      .then(data => {
        if (data.error) {
          console.error('Error:', data.error)
          router.push('/registration')
        } else {
          setUser(data.user)
          // Save user info to localStorage for documents page
          localStorage.setItem('userId', data.user.id)
          localStorage.setItem('userEmail', data.user.email)
          localStorage.setItem('userFirstName', data.user.first_name)
          localStorage.setItem('userLastName', data.user.last_name)
          localStorage.setItem('userCountry', data.user.country)
          localStorage.setItem('userRole', data.user.role_type)
        }
      })
      .catch(error => {
        console.error('Error:', error)
        router.push('/registration')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [searchParams, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-lg text-gray-800 mb-6">
              Thank you for completing your registration payment. Your application for Global Bridge Initiative 2026 Amsterdam Summit is now being processed.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="text-green-900">
                <strong>Registration Fee:</strong> USD $15 paid successfully
              </p>
              <p className="text-green-900">
                <strong>Application Status:</strong> Pending document upload
              </p>
            </div>

            {user && (
              <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Applicant Information:</h3>
                <p className="text-gray-800"><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                <p className="text-gray-800"><strong>Email:</strong> {user.email}</p>
                <p className="text-gray-800"><strong>Role:</strong> {user.role_type === 'student' ? 'Student' : 'Entrepreneur'}</p>
                <p className="text-gray-800"><strong>Country:</strong> {user.country}</p>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-900 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload Required Documents</h3>
                <p className="text-gray-800">Complete your application by uploading your CV, passport, certificates, and motivation essay.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Application Review</h3>
                <p className="text-gray-800">Our selection committee will review your application after the registration deadline.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Decision Notification</h3>
                <p className="text-gray-800">You'll receive an email with the decision by April 12th.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/documents"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-900 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Documents
            </Link>
            
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              <User className="h-5 w-5 mr-2" />
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-indigo-900 text-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Important Information</h2>
          <div className="space-y-3">
            <p>• Registration deadline: March 31st, 2026</p>
            <p>• Decision notifications: April 12th, 2026</p>
            <p>• Program dates: April 19-26, 2026</p>
            <p>• Location: Amsterdam, Netherlands</p>
          </div>
          <p className="mt-4 text-sm text-indigo-200">
            If you have any questions, please contact us at info@gbi.global
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  )
}
