/** @type {import('next').NextConfig} */
const securityHeaders = [
 { key: 'Content-Security-Policy', value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; upgrade-insecure-requests" },
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
 images: { formats: ['image/avif', 'image/webp'] },
 async headers() {
  return [{ source: '/(.*)', headers: securityHeaders }];
 },
};
export default nextConfig;
