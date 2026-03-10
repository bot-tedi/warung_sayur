-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('asinan', 'warung')),
  subcategory VARCHAR(100),
  stock INTEGER DEFAULT 0,
  unit VARCHAR(50),
  badge VARCHAR(100),
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address TEXT,
  customer_lat DECIMAL(10,8),
  customer_lng DECIMAL(11,8),
  subtotal INTEGER NOT NULL,
  shipping_cost INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('transfer', 'qris')),
  payment_proof_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'completed', 'cancelled')),
  whatsapp_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart table for guest carts
CREATE TABLE cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_subcategory ON products(subcategory);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_cart_session_id ON cart(session_id);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO products (name, description, price, category, subcategory, stock, unit, badge, rating, reviews) VALUES
-- Asinan Products
('Asinan Sayur Pedas', 'Asinan segar dengan sayuran pilihan dan bumbu pedas khas', 18000, 'asinan', 'pedas', 50, 'porsi', 'Best Seller', 4.8, 124),
('Asinan Sayur Original', 'Asinan sayur dengan rasa original yang segar', 16000, 'asinan', 'original', 45, 'porsi', NULL, 4.6, 89),
('Asinan Buah Mix', 'Asinan campuran buah dan sayur segar', 20000, 'asinan', 'mix', 30, 'porsi', 'New', 4.7, 56),
('Asinan Sayur Extra Pedas', 'Asinan sayur dengan level pedas ekstra untuk yang suka tantangan', 19000, 'asinan', 'pedas', 25, 'porsi', NULL, 4.5, 34),

-- Warung Sayur - Sayuran
('Bayam Segar', 'Bayam hijau segar langsung dari petani', 8000, 'warung', 'sayuran', 100, 'ikat', NULL, 4.9, 201),
('Kangkung Organik', 'Kangkung organik tanpa pestisida', 10000, 'warung', 'sayuran', 80, 'ikat', 'Organic', 4.8, 156),
('Sawi Putih', 'Sawi putih segar dan renyah', 9000, 'warung', 'sayuran', 60, 'ikat', NULL, 4.7, 89),
('Wortel Premium', 'Wortel premium manis dan segar', 15000, 'warung', 'sayuran', 50, 'kg', NULL, 4.6, 78),
('Tomat Segar', 'Tomat merah segar berkualitas tinggi', 12000, 'warung', 'sayuran', 70, 'kg', NULL, 4.5, 92),
('Terong Ungu', 'Terong ungu segar dan berkualitas', 11000, 'warung', 'sayuran', 40, 'kg', NULL, 4.4, 45),

-- Warung Sayur - Buah-buahan
('Pisang Raja', 'Pisang raja manis dan legit', 25000, 'warung', 'buah', 30, 'sikat', 'Local', 4.8, 167),
('Jeruk Manis', 'Jeruk manis segar dan berair', 35000, 'warung', 'buah', 40, 'kg', NULL, 4.7, 134),
('Apel Malang', 'Apel malang renyah dan manis', 45000, 'warung', 'buah', 25, 'kg', 'Premium', 4.9, 201),
('Semangka Merah', 'Semangka merah manis dan segar', 20000, 'warung', 'buah', 20, 'buah', NULL, 4.6, 89),

-- Warung Sayur - Ikan
('Ikan Lele Fresh', 'Ikan lele segar ukuran sedang', 22000, 'warung', 'ikan', 35, 'kg', 'Fresh', 4.7, 145),
('Ikan Nila Merah', 'Ikan nila merah segar berkualitas', 28000, 'warung', 'ikan', 25, 'kg', NULL, 4.8, 98),
('Ikan Mas', 'Ikan mas segar untuk berbagai masakan', 25000, 'warung', 'ikan', 30, 'kg', NULL, 4.6, 76),
('Ikan Bandeng', 'Ikan bandeng tanpa duri presto', 35000, 'warung', 'ikan', 20, 'kg', 'Special', 4.9, 112),

-- Warung Sayur - Bumbu
('Bawang Merah', 'Bawang merah segar berkualitas', 18000, 'warung', 'bumbu', 100, 'kg', NULL, 4.5, 234),
('Bawang Putih', 'Bawang putih segar dan wangi', 22000, 'warung', 'bumbu', 80, 'kg', NULL, 4.6, 189),
('Cabai Merah', 'Cabai merah segar pedas', 15000, 'warung', 'bumbu', 60, 'kg', NULL, 4.4, 145),
('Jahe Segar', 'Jahe segar berkualitas tinggi', 12000, 'warung', 'bumbu', 40, 'kg', NULL, 4.7, 98),
('Kunyit', 'Kunyit segar untuk berbagai masakan', 10000, 'warung', 'bumbu', 50, 'kg', NULL, 4.3, 67),
('Serai', 'Serai segar wangi dan berkualitas', 8000, 'warung', 'bumbu', 70, 'ikat', NULL, 4.5, 89);

-- Set up Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- Policies for products (everyone can read, only authenticated can write)
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for orders (users can only see their own orders)
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid()::text = customer_phone);
CREATE POLICY "Users can insert orders" ON orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid()::text = customer_phone);

-- Policies for order_items (linked to orders)
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND auth.uid()::text = orders.customer_phone
  )
);

-- Policies for cart (users can manage their own cart by session)
CREATE POLICY "Users can manage own cart" ON cart FOR ALL USING (true);
