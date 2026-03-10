import { DistanceResult, OrderInfo, CartItem } from '@/types';

export const calculateDistance = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<DistanceResult> => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_DISTANCE_MATRIX_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Distance Matrix API key is required');
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${apiKey}`
  );

  const data = await response.json();

  if (data.status !== 'OK') {
    throw new Error(`Distance Matrix API error: ${data.status}`);
  }

  return {
    distance: data.rows[0].elements[0].distance,
    duration: data.rows[0].elements[0].duration,
  };
};

export const calculateShippingCost = (distanceInMeters: number, costPerKm: number): number => {
  const distanceInKm = distanceInMeters / 1000;
  return Math.ceil(distanceInKm * costPerKm);
};

export const generateGoogleMapsLink = (lat: number, lng: number): string => {
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

export const generateWhatsAppMessage = (orderInfo: OrderInfo): string => {
  const { customer, items, subtotal, shippingCost, total, paymentMethod } = orderInfo;
  
  const itemsList = items.map((item: CartItem) => `${item.name} x ${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`).join('\n');
  
  const message = `Halo Akang! Ada pesanan baru:

📝 *Data Pelanggan*
Nama: ${customer.name}
No. WA: ${customer.phone}
Alamat: ${customer.address || 'Dipilih via Google Maps'}
${customer.coordinates ? `Lokasi Maps: ${generateGoogleMapsLink(customer.coordinates.lat, customer.coordinates.lng)}` : ''}

🛒 *Detail Pesanan*
${itemsList}

💰 *Ringkasan Pembayaran*
Subtotal: Rp ${subtotal.toLocaleString('id-ID')}
Ongkir: Rp ${shippingCost.toLocaleString('id-ID')}
Total: Rp ${total.toLocaleString('id-ID')}

Metode Pembayaran: ${paymentMethod === 'transfer' ? 'Transfer Bank' : 'QRIS'}

${orderInfo.paymentProof ? `Bukti Pembayaran: ${orderInfo.paymentProof}` : ''}

Terima kasih! 🙏`;

  return encodeURIComponent(message);
};
