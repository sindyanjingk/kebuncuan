// lib/default-pages.ts
export interface DefaultPageContent {
  title: string
  slug: string
  content: string
  metaTitle: string
  metaDesc: string
  order: number
}

export const getDefaultPages = (storeName: string): Record<string, DefaultPageContent> => {
  return {
    ABOUT_US: {
      title: "Tentang Kami",
      slug: "tentang-kami",
      metaTitle: `Tentang Kami - ${storeName}`,
      metaDesc: `Pelajari lebih lanjut tentang ${storeName}, visi, misi, dan komitmen kami untuk memberikan pelayanan terbaik.`,
      order: 1,
      content: `
<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Tentang ${storeName}</h1>
  
  <div class="prose max-w-none">
    <p class="text-lg mb-6">
      Selamat datang di ${storeName}, platform terpercaya yang didedikasikan untuk memberikan pengalaman berbelanja online terbaik bagi Anda.
    </p>
    
    <h2 class="text-2xl font-semibold mb-4">Visi Kami</h2>
    <p class="mb-6">
      Menjadi platform e-commerce terdepan yang menghadirkan kemudahan, keamanan, dan kepuasan dalam setiap transaksi belanja online.
    </p>
    
    <h2 class="text-2xl font-semibold mb-4">Misi Kami</h2>
    <ul class="list-disc list-inside mb-6 space-y-2">
      <li>Menyediakan produk berkualitas tinggi dengan harga yang kompetitif</li>
      <li>Memberikan pelayanan pelanggan yang responsif dan profesional</li>
      <li>Memastikan keamanan dan kemudahan dalam setiap transaksi</li>
      <li>Terus berinovasi untuk meningkatkan pengalaman berbelanja</li>
    </ul>
    
    <h2 class="text-2xl font-semibold mb-4">Komitmen Kami</h2>
    <p class="mb-6">
      Kami berkomitmen untuk terus memberikan yang terbaik bagi pelanggan melalui produk berkualitas, 
      layanan prima, dan inovasi berkelanjutan dalam dunia e-commerce.
    </p>
  </div>
</div>
      `.trim()
    },
    
    FAQ: {
      title: "FAQ - Pertanyaan Umum",
      slug: "faq",
      metaTitle: `FAQ - Pertanyaan Umum | ${storeName}`,
      metaDesc: `Temukan jawaban atas pertanyaan umum seputar belanja di ${storeName}. Panduan lengkap untuk pengalaman berbelanja yang lebih baik.`,
      order: 2,
      content: `
<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Pertanyaan yang Sering Diajukan (FAQ)</h1>
  
  <div class="space-y-6">
    <div class="border-b pb-4">
      <h3 class="text-xl font-semibold mb-2">Bagaimana cara berbelanja di ${storeName}?</h3>
      <p class="text-gray-600">
        Pilih produk yang diinginkan, tambahkan ke keranjang, isi data pengiriman, pilih metode pembayaran, 
        dan selesaikan pembayaran. Anda akan menerima konfirmasi pesanan melalui email.
      </p>
    </div>
    
    <div class="border-b pb-4">
      <h3 class="text-xl font-semibold mb-2">Metode pembayaran apa saja yang tersedia?</h3>
      <p class="text-gray-600">
        Kami menerima pembayaran melalui transfer bank, e-wallet (GoPay, OVO, Dana), 
        dan berbagai metode pembayaran digital lainnya.
      </p>
    </div>
    
    <div class="border-b pb-4">
      <h3 class="text-xl font-semibold mb-2">Berapa lama waktu pengiriman?</h3>
      <p class="text-gray-600">
        Waktu pengiriman bervariasi tergantung lokasi. Untuk area Jabodetabek 1-2 hari kerja, 
        sedangkan untuk luar kota 3-5 hari kerja.
      </p>
    </div>
    
    <div class="border-b pb-4">
      <h3 class="text-xl font-semibold mb-2">Bagaimana cara melacak pesanan?</h3>
      <p class="text-gray-600">
        Anda dapat melacak pesanan melalui halaman "Lacak Pesanan" dengan memasukkan nomor order 
        yang telah dikirimkan via email konfirmasi.
      </p>
    </div>
    
    <div class="border-b pb-4">
      <h3 class="text-xl font-semibold mb-2">Apakah bisa retur atau tukar barang?</h3>
      <p class="text-gray-600">
        Ya, kami menerima retur dalam 7 hari setelah barang diterima dengan syarat barang masih 
        dalam kondisi asli dan belum digunakan. Silakan baca kebijakan pengembalian lengkap.
      </p>
    </div>
  </div>
</div>
      `.trim()
    },

    CONTACT_US: {
      title: "Hubungi Kami",
      slug: "hubungi-kami", 
      metaTitle: `Hubungi Kami - ${storeName}`,
      metaDesc: `Butuh bantuan? Hubungi tim customer service ${storeName} melalui berbagai channel komunikasi yang tersedia.`,
      order: 3,
      content: `
<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Hubungi Kami</h1>
  
  <div class="grid md:grid-cols-2 gap-8">
    <div>
      <h2 class="text-2xl font-semibold mb-4">Informasi Kontak</h2>
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            📧
          </div>
          <div>
            <div class="font-medium">Email</div>
            <div class="text-gray-600">info@${storeName.toLowerCase().replace(/\s+/g, '')}.com</div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            📱
          </div>
          <div>
            <div class="font-medium">WhatsApp</div>
            <div class="text-gray-600">+62 812-3456-7890</div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            📍
          </div>
          <div>
            <div class="font-medium">Alamat</div>
            <div class="text-gray-600">Jakarta, Indonesia</div>
          </div>
        </div>
      </div>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">Jam Operasional</h3>
      <div class="text-gray-600">
        <div>Senin - Jumat: 09:00 - 18:00</div>
        <div>Sabtu: 09:00 - 15:00</div>
        <div>Minggu: Libur</div>
      </div>
    </div>
    
    <div>
      <h2 class="text-2xl font-semibold mb-4">Kirim Pesan</h2>
      <form class="space-y-4">
        <input 
          type="text" 
          placeholder="Nama Lengkap"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="email" 
          placeholder="Email"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="text" 
          placeholder="Subjek"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea 
          placeholder="Pesan Anda"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <button 
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Kirim Pesan
        </button>
      </form>
    </div>
  </div>
</div>
      `.trim()
    },

    HELP_CENTER: {
      title: "Pusat Bantuan",
      slug: "pusat-bantuan",
      metaTitle: `Pusat Bantuan - ${storeName}`,
      metaDesc: `Temukan panduan lengkap, tutorial, dan solusi untuk semua kebutuhan berbelanja Anda di ${storeName}.`,
      order: 4,
      content: `
<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Pusat Bantuan</h1>
  
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <div class="bg-blue-50 p-6 rounded-lg">
      <div class="text-3xl mb-3">🛒</div>
      <h3 class="font-semibold mb-2">Panduan Berbelanja</h3>
      <p class="text-sm text-gray-600">Pelajari cara berbelanja dengan mudah dan aman</p>
    </div>
    
    <div class="bg-green-50 p-6 rounded-lg">
      <div class="text-3xl mb-3">💳</div>
      <h3 class="font-semibold mb-2">Pembayaran</h3>
      <p class="text-sm text-gray-600">Informasi metode pembayaran yang tersedia</p>
    </div>
    
    <div class="bg-purple-50 p-6 rounded-lg">
      <div class="text-3xl mb-3">📦</div>
      <h3 class="font-semibold mb-2">Pengiriman</h3>
      <p class="text-sm text-gray-600">Panduan pengiriman dan estimasi waktu</p>
    </div>
  </div>
  
  <div class="space-y-6">
    <h2 class="text-2xl font-semibold">Artikel Bantuan Populer</h2>
    
    <div class="border-l-4 border-blue-500 pl-4">
      <h3 class="font-semibold mb-1">Cara Membuat Akun dan Login</h3>
      <p class="text-gray-600 text-sm">Panduan step-by-step untuk membuat akun baru dan masuk ke ${storeName}</p>
    </div>
    
    <div class="border-l-4 border-green-500 pl-4">
      <h3 class="font-semibold mb-1">Cara Melakukan Pembayaran</h3>
      <p class="text-gray-600 text-sm">Langkah-langkah pembayaran yang aman dan mudah</p>
    </div>
    
    <div class="border-l-4 border-purple-500 pl-4">
      <h3 class="font-semibold mb-1">Cara Melacak Status Pesanan</h3>
      <p class="text-gray-600 text-sm">Monitor status pesanan Anda secara real-time</p>
    </div>
    
    <div class="border-l-4 border-orange-500 pl-4">
      <h3 class="font-semibold mb-1">Kebijakan Retur dan Pengembalian</h3>
      <p class="text-gray-600 text-sm">Syarat dan ketentuan retur barang</p>
    </div>
  </div>
  
  <div class="mt-8 bg-gray-50 p-6 rounded-lg">
    <h3 class="font-semibold mb-2">Masih Butuh Bantuan?</h3>
    <p class="text-gray-600 mb-4">Tim customer service kami siap membantu Anda 24/7</p>
    <div class="flex space-x-4">
      <button class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
        Chat WhatsApp
      </button>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Kirim Email
      </button>
    </div>
  </div>
</div>
      `.trim()
    },

    RETURN_POLICY: {
      title: "Kebijakan Pengembalian",
      slug: "kebijakan-pengembalian",
      metaTitle: `Kebijakan Pengembalian - ${storeName}`,
      metaDesc: `Baca kebijakan pengembalian lengkap ${storeName}. Syarat, ketentuan, dan prosedur retur barang yang mudah dan transparan.`,
      order: 5,
      content: `
<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Kebijakan Pengembalian</h1>
  
  <div class="bg-blue-50 p-6 rounded-lg mb-8">
    <h2 class="text-xl font-semibold mb-3">Periode Pengembalian</h2>
    <p class="text-gray-700">
      Kami menerima pengembalian barang dalam <strong>7 hari</strong> sejak tanggal penerimaan barang 
      dengan syarat dan ketentuan yang berlaku.
    </p>
  </div>
  
  <div class="space-y-8">
    <section>
      <h2 class="text-2xl font-semibold mb-4">Syarat Pengembalian</h2>
      <ul class="space-y-2 text-gray-700">
        <li class="flex items-start space-x-2">
          <span class="text-green-500 mt-1">✓</span>
          <span>Barang masih dalam kondisi asli dan belum digunakan</span>
        </li>
        <li class="flex items-start space-x-2">
          <span class="text-green-500 mt-1">✓</span>
          <span>Kemasan asli masih utuh dan tidak rusak</span>
        </li>
        <li class="flex items-start space-x-2">
          <span class="text-green-500 mt-1">✓</span>
          <span>Menyertakan bukti pembelian (invoice/nota)</span>
        </li>
        <li class="flex items-start space-x-2">
          <span class="text-green-500 mt-1">✓</span>
          <span>Aksesoris dan bonus masih lengkap</span>
        </li>
      </ul>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">Barang yang Tidak Dapat Dikembalikan</h2>
      <ul class="space-y-2 text-gray-700">
        <li class="flex items-start space-x-2">
          <span class="text-red-500 mt-1">✗</span>
          <span>Produk digital atau virtual</span>
        </li>
        <li class="flex items-start space-x-2">
          <span class="text-red-500 mt-1">✗</span>
          <span>Barang yang sudah digunakan atau rusak</span>
        </li>
        <li class="flex items-start space-x-2">
          <span class="text-red-500 mt-1">✗</span>
          <span>Produk personal atau higienis</span>
        </li>
        <li class="flex items-start space-x-2">
          <span class="text-red-500 mt-1">✗</span>
          <span>Barang custom atau pesanan khusus</span>
        </li>
      </ul>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">Prosedur Pengembalian</h2>
      <div class="space-y-4">
        <div class="flex items-start space-x-4">
          <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">1</div>
          <div>
            <h3 class="font-semibold">Hubungi Customer Service</h3>
            <p class="text-gray-600">Hubungi tim kami melalui WhatsApp atau email untuk mengajukan pengembalian</p>
          </div>
        </div>
        
        <div class="flex items-start space-x-4">
          <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">2</div>
          <div>
            <h3 class="font-semibold">Konfirmasi dan Persetujuan</h3>
            <p class="text-gray-600">Tim kami akan mengkonfirmasi kelayakan pengembalian dan memberikan instruksi</p>
          </div>
        </div>
        
        <div class="flex items-start space-x-4">
          <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">3</div>
          <div>
            <h3 class="font-semibold">Kirim Barang</h3>
            <p class="text-gray-600">Kirim barang ke alamat yang telah ditentukan dengan packaging yang aman</p>
          </div>
        </div>
        
        <div class="flex items-start space-x-4">
          <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">4</div>
          <div>
            <h3 class="font-semibold">Verifikasi dan Refund</h3>
            <p class="text-gray-600">Setelah verifikasi, refund akan diproses dalam 3-5 hari kerja</p>
          </div>
        </div>
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">Biaya Pengembalian</h2>
      <div class="bg-yellow-50 p-4 rounded-lg">
        <p class="text-gray-700">
          <strong>Barang cacat/salah kirim:</strong> Biaya pengiriman ditanggung oleh ${storeName}<br>
          <strong>Perubahan pikiran pembeli:</strong> Biaya pengiriman ditanggung oleh pembeli
        </p>
      </div>
    </section>
  </div>
</div>
      `.trim()
    },

    TERMS_CONDITIONS: {
      title: "Syarat dan Ketentuan",
      slug: "syarat-ketentuan",
      metaTitle: `Syarat dan Ketentuan - ${storeName}`,
      metaDesc: `Baca syarat dan ketentuan penggunaan layanan ${storeName}. Ketentuan yang mengatur hubungan antara pengguna dan platform.`,
      order: 6,
      content: `
<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Syarat dan Ketentuan</h1>
  
  <div class="prose max-w-none space-y-6">
    <p class="text-gray-600">
      <em>Terakhir diperbarui: ${new Date().toLocaleDateString('id-ID')}</em>
    </p>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">1. Penerimaan Syarat</h2>
      <p class="text-gray-700">
        Dengan mengakses dan menggunakan platform ${storeName}, Anda menyetujui untuk terikat 
        dengan syarat dan ketentuan ini. Jika Anda tidak setuju, mohon tidak menggunakan layanan kami.
      </p>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">2. Definisi</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-1">
        <li><strong>"Platform"</strong> mengacu pada website dan aplikasi ${storeName}</li>
        <li><strong>"Pengguna"</strong> mengacu pada setiap individu yang mengakses platform</li>
        <li><strong>"Produk"</strong> mengacu pada barang atau jasa yang dijual melalui platform</li>
        <li><strong>"Transaksi"</strong> mengacu pada pembelian yang dilakukan melalui platform</li>
      </ul>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">3. Penggunaan Platform</h2>
      <p class="text-gray-700 mb-3">Pengguna dilarang untuk:</p>
      <ul class="list-disc list-inside text-gray-700 space-y-1">
        <li>Menggunakan platform untuk tujuan ilegal atau melanggar hukum</li>
        <li>Mengganggu atau merusak sistem keamanan platform</li>
        <li>Menyebarkan virus, malware, atau kode berbahaya lainnya</li>
        <li>Melakukan aktivitas yang dapat merugikan pengguna lain</li>
        <li>Menggunakan informasi pengguna lain tanpa izin</li>
      </ul>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">4. Akun Pengguna</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-1">
        <li>Pengguna bertanggung jawab menjaga kerahasiaan akun dan password</li>
        <li>Pengguna harus memberikan informasi yang akurat dan terkini</li>
        <li>Satu pengguna hanya diperbolehkan memiliki satu akun aktif</li>
        <li>Kami berhak menonaktifkan akun yang melanggar ketentuan</li>
      </ul>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">5. Transaksi dan Pembayaran</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-1">
        <li>Semua harga yang tercantum sudah termasuk pajak yang berlaku</li>
        <li>Pembayaran harus dilakukan sesuai metode yang tersedia</li>
        <li>Transaksi yang telah dikonfirmasi tidak dapat dibatalkan sepihak</li>
        <li>Kami berhak menolak atau membatalkan pesanan tertentu</li>
      </ul>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">6. Pengiriman dan Risiko</h2>
      <p class="text-gray-700">
        Risiko kerusakan atau kehilangan barang selama pengiriman ditanggung oleh pihak ekspedisi. 
        ${storeName} akan membantu proses klaim jika diperlukan.
      </p>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">7. Batasan Tanggung Jawab</h2>
      <p class="text-gray-700">
        ${storeName} tidak bertanggung jawab atas kerugian tidak langsung, insidental, 
        atau konsekuensial yang timbul dari penggunaan platform ini.
      </p>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">8. Perubahan Ketentuan</h2>
      <p class="text-gray-700">
        Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan 
        melalui platform dan berlaku setelah publikasi.
      </p>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">9. Hukum yang Berlaku</h2>
      <p class="text-gray-700">
        Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.
      </p>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">10. Kontak</h2>
      <p class="text-gray-700">
        Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami 
        melalui halaman kontak atau email customer service.
      </p>
    </section>
  </div>
</div>
      `.trim()
    },

    PRIVACY_POLICY: {
      title: "Kebijakan Privasi",
      slug: "kebijakan-privasi",
      metaTitle: `Kebijakan Privasi - ${storeName}`,
      metaDesc: `Kebijakan privasi ${storeName} menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.`,
      order: 7,
      content: `
<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Kebijakan Privasi</h1>
  
  <div class="prose max-w-none space-y-6">
    <p class="text-gray-600">
      <em>Terakhir diperbarui: ${new Date().toLocaleDateString('id-ID')}</em>
    </p>
    
    <div class="bg-blue-50 p-6 rounded-lg">
      <p class="text-gray-700">
        ${storeName} menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi 
        yang Anda berikan kepada kami. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, 
        menggunakan, dan melindungi data Anda.
      </p>
    </div>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">1. Informasi yang Kami Kumpulkan</h2>
      
      <h3 class="text-xl font-medium mb-2">Informasi Pribadi</h3>
      <ul class="list-disc list-inside text-gray-700 space-y-1 mb-4">
        <li>Nama lengkap</li>
        <li>Alamat email</li>
        <li>Nomor telepon</li>
        <li>Alamat pengiriman dan penagihan</li>
        <li>Informasi pembayaran (terenkripsi)</li>
      </ul>
      
      <h3 class="text-xl font-medium mb-2">Informasi Teknis</h3>
      <ul class="list-disc list-inside text-gray-700 space-y-1">
        <li>Alamat IP</li>
        <li>Jenis browser dan perangkat</li>
        <li>Halaman yang dikunjungi</li>
        <li>Waktu dan durasi kunjungan</li>
        <li>Data cookies dan preferensi</li>
      </ul>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">2. Cara Kami Menggunakan Informasi</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-1">
        <li>Memproses dan menyelesaikan pesanan Anda</li>
        <li>Mengirimkan konfirmasi dan update status pesanan</li>
        <li>Memberikan customer support</li>
        <li>Meningkatkan pengalaman berbelanja</li>
        <li>Mengirimkan promosi dan penawaran (dengan persetujuan)</li>
        <li>Mencegah fraud dan aktivitas ilegal</li>
        <li>Mematuhi kewajiban hukum</li>
      </ul>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">3. Pembagian Informasi</h2>
      <p class="text-gray-700 mb-3">Kami dapat membagikan informasi Anda dengan:</p>
      <ul class="list-disc list-inside text-gray-700 space-y-1">
        <li><strong>Penyedia layanan:</strong> Partner pengiriman, payment gateway, dll</li>
        <li><strong>Otoritas hukum:</strong> Jika diwajibkan oleh hukum</li>
        <li><strong>Pihak ketiga terpercaya:</strong> Untuk analisis dan pemasaran (data anonim)</li>
      </ul>
      <p class="text-gray-700 mt-3">
        <strong>Kami TIDAK akan menjual atau menyewakan data pribadi Anda kepada pihak ketiga.</strong>
      </p>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">4. Keamanan Data</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-1">
        <li>Enkripsi SSL untuk semua transaksi</li>
        <li>Server aman dengan akses terbatas</li>
        <li>Monitoring keamanan 24/7</li>
        <li>Backup data secara berkala</li>
        <li>Compliance dengan standar keamanan industri</li>
      </ul>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">5. Cookies dan Tracking</h2>
      <p class="text-gray-700 mb-3">Kami menggunakan cookies untuk:</p>
      <ul class="list-disc list-inside text-gray-700 space-y-1">
        <li>Menyimpan preferensi dan keranjang belanja</li>
        <li>Menganalisis traffic website</li>
        <li>Personalisasi konten</li>
        <li>Iklan yang relevan</li>
      </ul>
      <p class="text-gray-700 mt-3">
        Anda dapat mengatur atau menonaktifkan cookies melalui browser Anda.
      </p>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">6. Hak Anda</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-1">
        <li><strong>Akses:</strong> Melihat data pribadi yang kami miliki</li>
        <li><strong>Koreksi:</strong> Memperbarui informasi yang tidak akurat</li>
        <li><strong>Penghapusan:</strong> Meminta penghapusan data (dengan batasan)</li>
        <li><strong>Portabilitas:</strong> Mendapatkan copy data dalam format terstruktur</li>
        <li><strong>Opt-out:</strong> Berhenti berlangganan komunikasi pemasaran</li>
      </ul>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">7. Retensi Data</h2>
      <p class="text-gray-700">
        Kami menyimpan data pribadi selama diperlukan untuk memberikan layanan, 
        memenuhi kewajiban hukum, atau menyelesaikan sengketa. Data yang tidak lagi 
        diperlukan akan dihapus secara aman.
      </p>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">8. Perubahan Kebijakan</h2>
      <p class="text-gray-700">
        Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan signifikan 
        akan diberitahukan melalui email atau notifikasi di platform.
      </p>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">9. Hubungi Kami</h2>
      <p class="text-gray-700">
        Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan 
        hak-hak Anda, silakan hubungi kami melalui:
      </p>
      <div class="mt-3 text-gray-700">
        <div>Email: privacy@${storeName.toLowerCase().replace(/\s+/g, '')}.com</div>
        <div>WhatsApp: +62 812-3456-7890</div>
      </div>
    </section>
  </div>
</div>
      `.trim()
    },

    TRACK_ORDER: {
      title: "Lacak Pesanan",
      slug: "lacak-pesanan",
      metaTitle: `Lacak Pesanan - ${storeName}`,
      metaDesc: `Lacak status pesanan Anda di ${storeName}. Pantau perjalanan paket dari pemrosesan hingga sampai di tujuan.`,
      order: 8,
      content: `
<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Lacak Pesanan</h1>
  
  <div class="bg-blue-50 p-6 rounded-lg mb-8">
    <h2 class="text-xl font-semibold mb-3">Cara Melacak Pesanan</h2>
    <p class="text-gray-700 mb-3">
      Masukkan nomor pesanan Anda di form di bawah ini untuk melihat status terkini pesanan Anda.
    </p>
    <p class="text-sm text-gray-600">
      Nomor pesanan dapat ditemukan di email konfirmasi yang dikirimkan setelah pembelian.
    </p>
  </div>
  
  <div class="bg-white border rounded-lg p-6 mb-8">
    <form class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Nomor Pesanan
        </label>
        <input 
          type="text" 
          placeholder="Contoh: ORD-2025-0001"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Email atau No. Telepon (Opsional)
        </label>
        <input 
          type="text" 
          placeholder="email@contoh.com atau 081234567890"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button 
        type="submit"
        class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Lacak Pesanan
      </button>
    </form>
  </div>
  
  <div class="space-y-6">
    <h2 class="text-2xl font-semibold">Status Pesanan</h2>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div class="text-2xl mb-2">⏳</div>
        <h3 class="font-semibold text-yellow-800">Menunggu Pembayaran</h3>
        <p class="text-sm text-yellow-600">Pesanan menunggu konfirmasi pembayaran</p>
      </div>
      
      <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <div class="text-2xl mb-2">📦</div>
        <h3 class="font-semibold text-blue-800">Diproses</h3>
        <p class="text-sm text-blue-600">Pesanan sedang disiapkan untuk pengiriman</p>
      </div>
      
      <div class="bg-purple-50 border border-purple-200 p-4 rounded-lg">
        <div class="text-2xl mb-2">🚚</div>
        <h3 class="font-semibold text-purple-800">Dikirim</h3>
        <p class="text-sm text-purple-600">Paket dalam perjalanan ke alamat tujuan</p>
      </div>
      
      <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
        <div class="text-2xl mb-2">✅</div>
        <h3 class="font-semibold text-green-800">Selesai</h3>
        <p class="text-sm text-green-600">Paket telah diterima dengan baik</p>
      </div>
    </div>
    
    <div class="bg-gray-50 p-6 rounded-lg">
      <h3 class="font-semibold mb-3">Tips Melacak Pesanan:</h3>
      <ul class="space-y-2 text-gray-700">
        <li class="flex items-start space-x-2">
          <span class="text-blue-500 mt-1">•</span>
          <span>Periksa email konfirmasi untuk nomor pesanan yang benar</span>
        </li>
        <li class="flex items-start space-x-2">
          <span class="text-blue-500 mt-1">•</span>
          <span>Status pesanan diperbarui secara real-time</span>
        </li>
        <li class="flex items-start space-x-2">
          <span class="text-blue-500 mt-1">•</span>
          <span>Anda akan menerima notifikasi email setiap ada perubahan status</span>
        </li>
        <li class="flex items-start space-x-2">
          <span class="text-blue-500 mt-1">•</span>
          <span>Hubungi customer service jika ada kendala</span>
        </li>
      </ul>
    </div>
    
    <div class="bg-white border-l-4 border-orange-500 p-4">
      <h3 class="font-semibold text-orange-800 mb-2">Perlu Bantuan?</h3>
      <p class="text-gray-700 mb-3">
        Jika Anda mengalami kesulitan melacak pesanan atau ada pertanyaan, 
        jangan ragu untuk menghubungi tim customer service kami.
      </p>
      <div class="flex space-x-4">
        <span class="text-sm text-gray-600">📞 +62 812-3456-7890</span>
        <span class="text-sm text-gray-600">📧 support@${storeName.toLowerCase().replace(/\s+/g, '')}.com</span>
      </div>
    </div>
  </div>
</div>
      `.trim()
    }
  }
}
