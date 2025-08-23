# Multitenancy Setup Guide

## Overview
Aplikasi ini menggunakan subdomain-based multitenancy dimana setiap store memiliki subdomain sendiri.

## Environment Variables untuk Multitenancy

### Development Setup

```env
# Domain utama untuk subdomain
NEXT_PUBLIC_HOST_DOMAIN="localhost:3000"
NEXT_PUBLIC_MAIN_DOMAIN="localhost:3000"
NEXT_PUBLIC_ENABLE_SUBDOMAINS="true"
NEXT_PUBLIC_DEFAULT_STORE="main"
NEXT_PUBLIC_ALLOWED_ORIGINS="http://localhost:3000,http://*.localhost:3000"
```

### Production Setup

```env
# Domain utama untuk subdomain
NEXT_PUBLIC_HOST_DOMAIN="yourdomain.com"
NEXT_PUBLIC_MAIN_DOMAIN="yourdomain.com"
NEXT_PUBLIC_ENABLE_SUBDOMAINS="true"
NEXT_PUBLIC_DEFAULT_STORE="main"
NEXT_PUBLIC_ALLOWED_ORIGINS="https://yourdomain.com,https://*.yourdomain.com"
```

## Local Development dengan Subdomain

### Opsi 1: Menggunakan lvh.me (Recommended)
`lvh.me` secara otomatis mengarah ke `127.0.0.1` dan mendukung subdomain.

```env
NEXT_PUBLIC_HOST_DOMAIN="lvh.me:3000"
NEXTAUTH_URL="http://lvh.me:3000"
```

Akses store:
- Main app: `http://lvh.me:3000`
- Store "toko1": `http://toko1.lvh.me:3000`
- Store "toko2": `http://toko2.lvh.me:3000`

### Opsi 2: Edit /etc/hosts
Tambahkan ke `/etc/hosts`:
```
127.0.0.1 localhost
127.0.0.1 toko1.localhost
127.0.0.1 toko2.localhost
127.0.0.1 *.localhost
```

## DNS Setup untuk Production

### Wildcard Subdomain
Buat DNS record:
```
A    @              -> your-server-ip
A    www            -> your-server-ip
A    *              -> your-server-ip (wildcard)
CNAME *.yourdomain.com -> yourdomain.com
```

### Vercel Deployment
1. Tambahkan domain di Vercel dashboard
2. Setup wildcard domain: `*.yourdomain.com`
3. Update environment variables di Vercel

## Cara Kerja Multitenancy

1. **Middleware** (`middleware.ts`) mendeteksi subdomain
2. **Routing** automatic ke `/domain/[slug]/`
3. **Database** filtering berdasarkan `storeId`
4. **File Upload** isolated per tenant

## Testing Multitenancy

```bash
# Start development server
yarn dev

# Test dengan curl
curl -H "Host: toko1.lvh.me:3000" http://lvh.me:3000
curl -H "Host: toko2.lvh.me:3000" http://lvh.me:3000
```

## Security Considerations

1. **CORS**: Set proper allowed origins
2. **Data Isolation**: Ensure queries filter by storeId
3. **File Isolation**: Upload files with store prefix
4. **Session Management**: Handle cross-subdomain sessions

## Troubleshooting

### Subdomain tidak bekerja
- Pastikan DNS/hosts file sudah benar
- Check middleware configuration
- Verify NEXT_PUBLIC_HOST_DOMAIN

### CORS errors
- Update NEXT_PUBLIC_ALLOWED_ORIGINS
- Check NextAuth configuration
- Verify cookie domain settings
