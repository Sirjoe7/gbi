'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'

interface Document {
  id: string
  document_type: string
  file_name: string
  file_size: number
  uploaded_at: string
}

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  payment_status: string
}

export default function DocumentsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)

  const requiredDocuments = [
    { type: 'cv', name: 'CV/Resume', description: 'Your current curriculum vitae or resume' },
    { type: 'passport', name: 'Passport Bio Page', description: 'Clear scan of your passport bio page' },
    { type: 'certificate', name: 'Academic Certificates', description: 'Your academic qualifications' },
    { type: 'motivation_essay', name: 'Motivation Essay', description: 'Your motivation for joining the program' }
  ]

  useEffect(() => {
    // Check if user has completed payment
    const checkUserStatus = async () => {
      try {
        // Get user info from URL params or localStorage
        const urlParams = new URLSearchParams(window.location.search)
        const userId = urlParams.get('userId') || localStorage.getItem('userId')
        const userEmail = urlParams.get('email') || localStorage.getItem('userEmail')
        
        console.log('🔍 Documents page - User ID:', userId)
        console.log('🔍 Documents page - User Email:', userEmail)
        
        if (!userId || !userEmail) {
          console.log('❌ No user ID or email found, redirecting to registration')
          router.push('/registration')
          return
        }

        const mockUser = {
          id: userId,
          email: userEmail,
          first_name: 'John',
          last_name: 'Doe',
          payment_status: 'paid'
        }
        
        setUser(mockUser)
        
        // Load existing documents
        const response = await fetch(`/api/documents?userId=${mockUser.id}`)
        if (response.ok) {
          try {
            const data = await response.json()
            setDocuments(data.documents || [])
          } catch (error) {
            console.error('Failed to parse documents response:', error)
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        router.push('/registration')
      } finally {
        setIsLoading(false)
      }
    }

    checkUserStatus()
  }, [router])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploading(documentType)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', documentType)
      formData.append('userId', user.id)

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        let error
        try {
          error = await response.json()
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      setDocuments(prev => [...prev, data.document])
      
      // Clear the file input
      event.target.value = ''
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload document. Please try again.')
    } finally {
      setUploading(null)
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents?documentId=${documentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete document. Please try again.')
    }
  }

  const getDocumentForType = (type: string) => {
    return documents.find(doc => doc.document_type === type)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const allDocumentsUploaded = requiredDocuments.every(req => 
    documents.some(doc => doc.document_type === req.type)
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-indigo-900 hover:text-indigo-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Document Upload</h1>
          <p className="text-gray-600 mt-2">Complete your application by uploading the required documents</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upload Progress</h2>
            <span className="text-sm text-gray-600">
              {documents.length} / {requiredDocuments.length} documents uploaded
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-indigo-900 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(documents.length / requiredDocuments.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Document Upload Areas */}
        <div className="space-y-6">
          {requiredDocuments.map((doc) => {
            const existingDoc = getDocumentForType(doc.type)
            const isUploading = uploading === doc.type
            
            return (
              <div key={doc.type} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 text-indigo-900 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                      {existingDoc && (
                        <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{doc.description}</p>
                    
                    {existingDoc ? (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-green-900">{existingDoc.file_name}</p>
                            <p className="text-sm text-green-700">
                              {formatFileSize(existingDoc.file_size)} • 
                              Uploaded {new Date(existingDoc.uploaded_at).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteDocument(existingDoc.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <label className="cursor-pointer">
                            <span className="bg-indigo-900 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors inline-block">
                              {isUploading ? 'Uploading...' : 'Choose File'}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload(e, doc.type)}
                              disabled={isUploading}
                            />
                          </label>
                          <p className="text-sm text-gray-500 mt-2">
                            PDF, Word, JPEG, or PNG (Max 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Submit Section */}
        {allDocumentsUploaded && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-900">All Documents Uploaded!</h3>
            </div>
            <p className="text-green-800 mb-4">
              Your application is now complete. Our selection committee will review your submission after the registration deadline.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {!allDocumentsUploaded && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-8">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-6 w-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold text-yellow-900">Documents Required</h3>
            </div>
            <p className="text-yellow-800">
              Please upload all required documents to complete your application. You can return to this page at any time before the registration deadline.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
