# Profile Picture Upload Feature

## Overview
User sekarang dapat mengganti foto profile mereka melalui halaman profile di tenant domain.

## Features
✅ Upload foto profile melalui UI yang user-friendly
✅ Preview foto sebelum upload
✅ Validasi file (hanya gambar, max 4MB)
✅ Upload ke Vercel Blob Storage
✅ Update session otomatis setelah upload
✅ Toast notification untuk feedback

## How to Use
1. **Akses Profile**: Login dan buka `/domain/{store}/profile`
2. **Tab Profile**: Klik tab "Profile" 
3. **Upload Foto**: Klik pada avatar/foto profile yang ada
4. **Pilih File**: Dialog akan terbuka, pilih file gambar
5. **Preview**: Foto akan di-preview sebelum upload
6. **Upload**: Klik tombol "Upload Image"
7. **Success**: Foto profile akan langsung terupdate

## Technical Implementation

### Components Used
- **AvatarUpload**: `/components/profile/avatar-upload.tsx`
  - Dialog untuk upload foto
  - Preview gambar sebelum upload
  - Integration dengan session management

### API Endpoints
- **POST** `/api/user/upload`: Upload file ke Vercel Blob dan update user
  - Validasi file type (image only)
  - Validasi file size (max 4MB)
  - Upload ke Vercel Blob Storage
  - Update user.imageUrl di database

### Session Management
- NextAuth callbacks updated untuk handle imageUrl
- Session update setelah upload berhasil
- Real-time UI update tanpa reload page

### File Structure
```
components/profile/
  └── avatar-upload.tsx     # Upload component
app/domain/[store]/profile/
  └── profile-client.tsx    # Profile page dengan avatar upload
app/api/user/
  └── upload/route.ts       # Upload API endpoint
lib/
  └── auth.ts               # NextAuth config dengan imageUrl support
```

### Validation Rules
- **File Type**: Hanya file gambar (.jpg, .png, .gif, etc)
- **File Size**: Maximum 4MB
- **Authentication**: User harus login
- **Storage**: Vercel Blob Storage dengan public access

### Error Handling
- File too large: "File size must be less than 4MB"
- Invalid file type: "File must be an image"
- Upload failed: "Gagal mengupload foto profile"
- Success: "Foto profile berhasil diperbarui!"

### Environment Variables Required
```env
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

## Testing
1. Login ke tenant domain
2. Buka profile page
3. Click pada avatar
4. Upload gambar baru
5. Verify foto terupdate di UI
6. Refresh page dan pastikan foto persisten
