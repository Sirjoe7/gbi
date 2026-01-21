import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { data: documents, error } = await getSupabaseAdmin()
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      )
    }

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string
    const userId = formData.get('userId') as string

    if (!file || !documentType || !userId) {
      return NextResponse.json(
        { error: 'File, document type, and user ID are required' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPEG, PNG, and Word documents are allowed.' },
        { status: 400 }
      )
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const fileName = `${userId}/${documentType}_${Date.now()}_${file.name}`
    console.log('🔍 Uploading file to Supabase Storage...')
    console.log('📁 Bucket: documents')
    console.log('📄 FileName:', fileName)
    console.log('📊 FileSize:', file.size)
    console.log('🔤 FileType:', file.type)
    
    const { data: uploadData, error: uploadError } = await getSupabaseAdmin().storage
      .from('documents')
      .upload(fileName, file)

    if (uploadError) {
      console.error('❌ Upload error:', uploadError)
      
      // Check if bucket doesn't exist
      if (uploadError.message?.includes('bucket') || uploadError.message?.includes('not found')) {
        return NextResponse.json(
          { error: 'Storage bucket not found. Please run the storage-setup.sql script in your Supabase SQL editor.' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: `Failed to upload file: ${uploadError.message}` },
        { status: 500 }
      )
    }

    console.log('✅ File uploaded successfully:', uploadData.path)

    // Get public URL
    const { data: urlData } = getSupabaseAdmin().storage
      .from('documents')
      .getPublicUrl(fileName)

    // Save document record in database
    const { data: document, error: dbError } = await getSupabaseAdmin()
      .from('documents')
      .insert({
        user_id: userId,
        document_type: documentType,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_size: file.size
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save document record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const documentId = searchParams.get('documentId')

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    // Get document info before deletion
    const { data: document } = await getSupabaseAdmin()
      .from('documents')
      .select('file_url')
      .eq('id', documentId)
      .single()

    if (document) {
      // Extract file path from URL
      const urlParts = document.file_url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const filePath = fileName.split('_').slice(1).join('_').replace(/_\d+_/, '/')

      // Delete from storage
      await getSupabaseAdmin().storage
        .from('documents')
        .remove([filePath])
    }

    // Delete from database
    const { error } = await getSupabaseAdmin()
      .from('documents')
      .delete()
      .eq('id', documentId)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete document' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
