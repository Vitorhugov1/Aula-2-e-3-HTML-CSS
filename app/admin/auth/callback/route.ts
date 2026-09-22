import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const tokenHash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as EmailOtpType | null
  const requestedNext = url.searchParams.get('next') ?? '/admin'
  const next = requestedNext.startsWith('/admin') && !requestedNext.startsWith('//') ? requestedNext : '/admin'

  if (isSupabaseConfigured) {
    const supabase = await createClient()
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) return NextResponse.redirect(new URL(next, url.origin))
    }

    if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      if (!error) return NextResponse.redirect(new URL(next, url.origin))
    }
  }

  return NextResponse.redirect(new URL('/admin/login?error=callback', url.origin))
}
