// @ts-ignore
import launchEditor from 'react-dev-utils/launchEditor'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const fileName = searchParams.get('fileName')
  const lineNumber = searchParams.get('lineNumber') ?? '1'
  const colNumber = searchParams.get('colNumber') ?? '1'

  if (!fileName) {
    return NextResponse.json({ error: 'fileName is required' }, { status: 400 })
  }

  const absolutePath = fileName.startsWith('/')
    ? fileName
    : path.join(process.cwd(), fileName)

  process.env.REACT_EDITOR = 'code'
  process.env.REACT_EDITOR_ARGS = '--reuse-window'

  launchEditor(absolutePath, Number(lineNumber), Number(colNumber))

  return NextResponse.json({ success: true })
}