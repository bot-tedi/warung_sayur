'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, Home, MessageCircle } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h1>
          <p className="text-gray-600">
            Terima kasih telah berbelanja di Warung Akang. Pesanan Anda telah dikirim melalui WhatsApp.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.href = 'https://wa.me/628123456789'}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Buka WhatsApp
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </button>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            📝 Simpan bukti pembayaran Anda untuk konfirmasi pesanan.
          </p>
          <p className="text-sm text-green-700 mt-1">
            🚚 Pesanan akan segera diproses setelah pembayaran dikonfirmasi.
          </p>
        </div>
      </div>
    </div>
  );
}
