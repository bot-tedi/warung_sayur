'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, CustomerInfo, OrderInfo } from '@/types';
import { cartStorage } from '@/lib/cart';
import { calculateDistance, calculateShippingCost, generateWhatsAppMessage } from '@/lib/maps';
import GoogleMaps from '@/components/GoogleMaps';
import { User, MapPin, CreditCard, Upload, ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [distance, setDistance] = useState(0);
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
  });

  const [useMaps, setUseMaps] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'qris'>('transfer');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState('');

  useEffect(() => {
    const cartItems = cartStorage.getCart();
    if (cartItems.length === 0) {
      router.push('/');
      return;
    }
    setCart(cartItems);
  }, [router]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost;

  const handleLocationSelect = async (lat: number, lng: number, address: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      address,
      coordinates: { lat, lng }
    }));

    try {
      setLoading(true);
      const warungLocation = {
        lat: parseFloat(process.env.NEXT_PUBLIC_WARUNG_LAT || '-6.2088'),
        lng: parseFloat(process.env.NEXT_PUBLIC_WARUNG_LNG || '106.8456')
      };

      const distanceResult = await calculateDistance(warungLocation, { lat, lng });
      const costPerKm = parseInt(process.env.NEXT_PUBLIC_ONGKIR_PER_KM || '3000');
      const cost = calculateShippingCost(distanceResult.distance.value, costPerKm);

      setDistance(distanceResult.distance.value);
      setShippingCost(cost);
    } catch (error) {
      console.error('Error calculating shipping:', error);
      alert('Gagal menghitung ongkir. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      const url = URL.createObjectURL(file);
      setPaymentProofUrl(url);
    }
  };

  const handleSubmitOrder = () => {
    const orderInfo: OrderInfo = {
      customer: customerInfo,
      items: cart,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      paymentProof: paymentProofUrl
    };

    const message = generateWhatsAppMessage(orderInfo);
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '628123456789';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');
    cartStorage.clearCart();
    router.push('/success');
  };

  const validateStep1 = () => {
    if (!customerInfo.name.trim()) {
      alert('Silakan masukkan nama lengkap');
      return false;
    }
    if (!customerInfo.phone.trim()) {
      alert('Silakan masukkan nomor WhatsApp');
      return false;
    }
    if (!useMaps && !customerInfo.address?.trim()) {
      alert('Silakan masukkan alamat lengkap');
      return false;
    }
    if (useMaps && !customerInfo.coordinates) {
      alert('Silakan pilih lokasi pada peta');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!paymentProof) {
      alert('Silakan upload bukti pembayaran');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (cart.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p>Loading...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white py-6 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="hover:bg-green-700 p-2 rounded">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Checkout</h1>
              <p className="text-green-100 text-sm">Langkah {step} dari 3</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNumber ? <Check className="w-4 h-4" /> : stepNumber}
                </div>
                <span className={`ml-2 text-sm ${
                  step >= stepNumber ? 'text-green-600 font-semibold' : 'text-gray-600'
                }`}>
                  {stepNumber === 1 ? 'Data Pelanggan' : stepNumber === 2 ? 'Pembayaran' : 'Konfirmasi'}
                </span>
                {stepNumber < 3 && <div className="w-16 h-1 bg-gray-200 ml-2" />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Data Pelanggan
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={!useMaps}
                          onChange={() => setUseMaps(false)}
                          className="w-4 h-4 text-green-500"
                        />
                        <span className="text-sm font-medium">Input Manual</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={useMaps}
                          onChange={() => setUseMaps(true)}
                          className="w-4 h-4 text-green-500"
                        />
                        <span className="text-sm font-medium">Pilih via Maps</span>
                      </label>
                    </div>

                    {!useMaps ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alamat Lengkap *
                        </label>
                        <textarea
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows={3}
                          placeholder="Masukkan alamat lengkap pengiriman"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Pilih Lokasi di Peta *
                        </label>
                        <GoogleMaps onLocationSelect={handleLocationSelect} />
                        {customerInfo.address && (
                          <div className="mt-2 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-700">{customerInfo.address}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Metode Pembayaran
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Pilih Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setPaymentMethod('transfer')}
                        className={`p-4 border-2 rounded-lg transition-colors ${
                          paymentMethod === 'transfer' 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">🏦</div>
                          <p className="font-medium">Transfer Bank</p>
                          <p className="text-sm text-gray-600">BCA/Mandiri/BRI</p>
                        </div>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('qris')}
                        className={`p-4 border-2 rounded-lg transition-colors ${
                          paymentMethod === 'qris' 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">📱</div>
                          <p className="font-medium">QRIS</p>
                          <p className="text-sm text-gray-600">GoPay/Dana/OVO</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Bukti Pembayaran *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePaymentProofUpload}
                        className="hidden"
                        id="payment-proof"
                      />
                      <label htmlFor="payment-proof" className="cursor-pointer">
                        {paymentProofUrl ? (
                          <div>
                            <img 
                              src={paymentProofUrl} 
                              alt="Payment proof" 
                              className="max-h-48 mx-auto mb-4 rounded"
                            />
                            <p className="text-sm text-green-600 font-medium">
                              ✓ Bukti pembayaran diunggah
                            </p>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">Klik untuk upload bukti pembayaran</p>
                            <p className="text-sm text-gray-500">PNG, JPG hingga 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Konfirmasi Pesanan</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Data Pelanggan</h3>
                    <p className="text-sm text-gray-600">Nama: {customerInfo.name}</p>
                    <p className="text-sm text-gray-600">WhatsApp: {customerInfo.phone}</p>
                    <p className="text-sm text-gray-600">Alamat: {customerInfo.address}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Detail Pesanan</h3>
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm mb-1">
                        <span>{item.name} x {item.quantity}</span>
                        <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Ringkasan Pembayaran</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ongkir ({(distance/1000).toFixed(1)} km):</span>
                        <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span className="text-green-600">Rp {total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Metode Pembayaran</h3>
                    <p className="text-sm text-gray-600">
                      {paymentMethod === 'transfer' ? 'Transfer Bank' : 'QRIS'}
                    </p>
                    {paymentProofUrl && (
                      <img 
                        src={paymentProofUrl} 
                        alt="Payment proof" 
                        className="max-h-32 mt-2 rounded"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                step === 1 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Kembali
            </button>
            
            <button
              onClick={step === 3 ? handleSubmitOrder : nextStep}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : step === 3 ? (
                <>
                  <Check className="w-4 h-4" />
                  Kirim ke WhatsApp
                </>
              ) : (
                <>
                  Lanjut
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
