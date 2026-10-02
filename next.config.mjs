/** @type {import('next').NextConfig} */
const scriptSources = process.env.NODE_ENV === 'development'
 ? "'self' 'unsafe-inline' 'unsafe-eval'"
 : "'self' 'unsafe-inline'";

const securityHeaders = [
 { key: 'Content-Security-Policy', value: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; frame-src https://challenges.cloudflare.com; form-action 'self'; script-src ${scriptSources} https://challenges.cloudflare.com; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com; media-src 'self'; manifest-src 'self'; upgrade-insecure-requests` },
 { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
 { key: 'X-Content-Type-Options', value: 'nosniff' },
 { key: 'X-Frame-Options', value: 'DENY' },
 { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
 { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
 { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
 { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
 { key: 'X-DNS-Prefetch-Control', value: 'off' },
 { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
];

const nextConfig = {
 reactStrictMode: true,
 poweredByHeader: false,
 experimental: {
  serverActions: { bodySizeLimit: '6mb' },
 },
 images: {
  formats: ['image/avif', 'image/webp'],
  qualities: [75, 95],
  remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/sign/service-images/**' }],
 },
 async headers() {
  return [
   { source: '/(.*)', headers: securityHeaders },
   { source: '/admin/:path*', headers: [
    { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
    { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
   ] },
  ];
 },
};
export default nextConfig;
