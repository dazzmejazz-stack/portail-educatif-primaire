import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {

  try {
    const body = (await request.json()) as HandleUploadBody

    const jsonResponse = await handleUpload({
      token: process.env.PUBLIC_BLOB_READ_WRITE_TOKEN,
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            'video/*',
            'audio/*',
            'image/*',
            'application/pdf',
          ],
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Téléversement terminé:', blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Échec du téléversement' },
      { status: 500 }
    )
  }
}
