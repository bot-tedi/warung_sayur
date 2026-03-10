# Warung Akang - E-Commerce Checkout System

Sistem checkout e-commerce berbasis Next.js dengan Supabase database untuk Warung Akang dengan fitur lengkap.

## 🚀 Fitur Utama

- **🛒 Katalog Produk**: Tampilan produk menarik dengan sistem keranjang belanja
- **📂 Kategori**: Asinan Sayur dan Warung Sayur (sayuran, buah, ikan, bumbu)
- **🔍 Advanced Filtering**: Search, subcategory, dan price range filtering
- **🛍️ Checkout Multi-Step**: Proses checkout yang terstruktur dan user-friendly
- **🗺️ Google Maps Integration**: Pemilihan lokasi pengiriman via peta interaktif
- **💰 Perhitungan Ongkir Otomatis**: Hitung biaya pengiriman berdasarkan jarak
- **📤 Upload Bukti Pembayaran**: Support untuk transfer bank dan QRIS
- **📱 WhatsApp Integration**: Kirim pesanan langsung ke WhatsApp
- **📊 Admin Panel**: Manajemen produk real-time
- **📱 Responsive Design**: UI yang bersih dan responsif di semua perangkat
- **🗄️ Supabase Database**: Database real-time untuk produk dan orders

## 🛠️ Teknologi

- **Frontend**: Next.js 14 dengan App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Maps**: Google Maps JavaScript API
- **Deployment**: Netlify

## 📦 Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/username/warung-checkout.git
cd warung-checkout
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Supabase

1. Buat project baru di [Supabase Dashboard](https://supabase.com/dashboard)
2. Buka SQL Editor dan jalankan query dari `supabase/schema.sql`
3. Dapatkan URL dan API Keys dari Settings > API

### 4. Environment Variables
Copy `.env.local.example` ke `.env.local` dan konfigurasi:
```env
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NEXT_PUBLIC_GOOGLE_DISTANCE_MATRIX_API_KEY=your_google_distance_matrix_api_key_here

# Warung Configuration
NEXT_PUBLIC_WARUNG_LAT=-6.2088
NEXT_PUBLIC_WARUNG_LNG=106.8456
NEXT_PUBLIC_WARUNG_ADDRESS="Jl. Warung Akang No. 123, Jakarta"
NEXT_PUBLIC_WARUNG_PHONE="628123456789"
NEXT_PUBLIC_ONGKIR_PER_KM=3000
NEXT_PUBLIC_WHATSAPP_NUMBER="628123456789"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

### 5. Google Maps API Setup
1. Buat project di [Google Cloud Console](https://console.cloud.google.com/)
2. Enable APIs:
   - Maps JavaScript API
   - Distance Matrix API
   - Geocoding API
3. Buat API Key dengan restriction yang sesuai
4. Masukkan API key ke environment variables

### 6. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🚀 Deployment ke Netlify

### 1. Push ke GitHub
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/warung-checkout.git
git push -u origin main
```

### 2. Setup Netlify
1. Login ke [Netlify Dashboard](https://app.netlify.com/)
2. Klik "New site from Git"
3. Pilih GitHub repository
4. Konfigurasi build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`
5. Add environment variables di Netlify dashboard
6. Deploy!

## 📁 Struktur Project

```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin panel
│   ├── checkout/
│   │   └── page.tsx          # Halaman checkout multi-step
│   ├── success/
│   │   └── page.tsx          # Halaman sukses
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Halaman utama katalog
│   └── globals.css           # Global styles
├── components/
│   ├── AdminProductManager.tsx # Admin product management
│   ├── CategoryTabs.tsx       # Category selection
│   ├── ProductCard.tsx       # Product card component
│   ├── ProductFilters.tsx     # Product filtering
│   ├── GoogleMaps.tsx        # Komponen peta interaktif
│   └── CartSummary.tsx       # Ringkasan keranjang
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── supabase-products.ts  # Product CRUD operations
│   ├── supabase-cart.ts     # Cart operations
│   ├── cart.ts              # Local storage fallback
│   └── maps.ts             # Utilitas Google Maps
├── data/
│   └── products.ts          # Static product data (fallback)
├── types/
│   └── index.ts             # Type definitions
└── supabase/
    └── schema.sql           # Database schema
```

## 🎨 UI/UX Features

- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Loading States**: Indikator loading untuk API calls
- **Error Handling**: Pesan error yang user-friendly
- **Form Validation**: Validasi real-time dan user feedback
- **Smooth Transitions**: Animasi dan transisi yang halus
- **Accessibility**: Semantic HTML dan ARIA labels
- **Micro-interactions**: Hover effects dan animations

## �️ Database Schema

### Tables:
- **products**: Informasi produk (nama, harga, kategori, stok, dll)
- **orders**: Data pesanan pelanggan
- **order_items**: Detail item dalam setiap order
- **cart**: Keranjang belanja untuk guest users

### Features:
- Row Level Security (RLS) untuk data protection
- Automatic timestamps dengan triggers
- Indexes untuk performance optimization
- Sample data untuk testing

## 🔧 Admin Panel

Features:
- **Product Management**: Tambah, edit, hapus produk
- **Image Upload**: Upload gambar produk
- **Real-time Updates**: Perubahan langsung tersimpan ke database
- **Data Validation**: Form validation untuk data quality
- **Stock Management**: Tracking stok produk

Access: `/admin`

## � WhatsApp Integration

Format pesanan otomatis:
```
Halo Akang! Ada pesanan baru:

📝 Data Pelanggan
Nama: [Nama User]
No. WA: [Nomor WA]
Alamat: [Alamat/Lokasi Maps]

🛒 Detail Pesanan
[Produk] x [Jumlah] = [Harga]

💰 Ringkasan Pembayaran
Subtotal: [Harga Produk]
Ongkir: [Biaya Ongkir]
Total: [Total Pembayaran]

Metode Pembayaran: [Transfer/QRIS]
```

## 🌐 Environment Variables

### Required Variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Nomor WhatsApp tujuan

### Optional Variables:
- `NEXT_PUBLIC_WARUNG_LAT/LNG`: Koordinat warung
- `NEXT_PUBLIC_ONGKIR_PER_KM`: Biaya ongkir per km
- `NEXT_PUBLIC_SITE_URL`: Base URL untuk deployment

## 🔄 Workflow Sistem

### 1. Katalog & Keranjang
- Tampilan kategori (Asinan Sayur & Warung Sayur)
- Filter produk berdasarkan kategori, subcategory, harga
- Add to cart dengan real-time update

### 2. Checkout & Lokasi
- Form input data pelanggan
- Pilih alamat (manual atau via Google Maps)
- Hitung ongkir otomatis berdasarkan jarak

### 3. Pembayaran & Konfirmasi
- Pilih metode pembayaran (Transfer/QRIS)
- Upload bukti pembayaran
- Review pesanan

### 4. Notifikasi WhatsApp
- Kirim pesanan terformat ke WhatsApp
- Simpan order ke database Supabase

## 🚀 Production Deployment

### Netlify Configuration:
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18
- Environment variables di Netlify dashboard

### Custom Domain:
1. Buka Netlify dashboard
2. Site settings > Domain management
3. Add custom domain
4. Update DNS records

## 🤝 Contributing

1. Fork project
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 License

MIT License - lihat file [LICENSE](LICENSE) untuk details.

## 🆘 Support

Jika ada masalah atau pertanyaan:
1. Cek [Issues](https://github.com/username/warung-checkout/issues)
2. Buat issue baru dengan detail masalah
3. Contact maintainer

---

⭐ **Jika project ini membantu, berikan star di GitHub!**
