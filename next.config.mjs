/** @type {import('next').NextConfig} */
const securityHeaders = [
 { key: 'Content-Security-Policy', value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; upgrade-insecure-requests" },
 { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
 { key: 'X-Content-Type-Options', value: 'nosniff' },
 { key: 'X-Frame-Options', value: 'DENY' },
 { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
 { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
 { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
 { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
];

const nextConfig = {
 reactStrictMode: true,
 poweredByHeader: false,
 images: {
  formats: ['image/avif', 'image/webp'],
  qualities: [75, 95],
  remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/sign/service-images/**' }],
 },
 async headers() {
  return [
   { source: '/(.*)', headers: securityHeaders },
   { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }] },
  ];
 },
};
export default nextConfig;
