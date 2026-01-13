'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your registration payment was cancelled. You can try again whenever you're ready.
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <p className="text-yellow-900">
                <strong>Note:</strong> Your application information has been saved. You can return to complete the payment at any time before the registration deadline.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/registration"
                className="inline-flex items-center px-6 py-3 bg-indigo-900 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Registration
              </Link>
              
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
