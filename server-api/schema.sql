CREATE DATABASE IF NOT EXISTS omsun CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE omsun;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NULL,
  company VARCHAR(120) NULL,
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(120) NOT NULL,
  subcategory VARCHAR(120) NULL,
  brand VARCHAR(120) NOT NULL,
  tagline VARCHAR(255) NULL,
  description TEXT NULL,
  price DECIMAL(12, 2) NOT NULL,
  mrp DECIMAL(12, 2) NULL,
  image VARCHAR(500) NULL,
  features JSON NULL,
  specs JSON NULL,
  stock INT NOT NULL DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 0,
  badges JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_ref VARCHAR(32) NOT NULL UNIQUE,
  user_id INT UNSIGNED NULL,
  shipping_name VARCHAR(120) NOT NULL,
  shipping_phone VARCHAR(30) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city VARCHAR(120) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  shipping_fee DECIMAL(12, 2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(12, 2) NOT NULL,
  payment_method ENUM('esewa', 'khalti', 'bank', 'cod') NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  product_id VARCHAR(32) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  qty INT NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NULL,
  company VARCHAR(120) NULL,
  inquiry_type VARCHAR(60) NULL,
  system_size VARCHAR(60) NULL,
  district VARCHAR(120) NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS coupons (
  id VARCHAR(32) PRIMARY KEY,
  code VARCHAR(60) NOT NULL UNIQUE,
  discount_type ENUM('percentage', 'fixed') NOT NULL,
  discount_value DECIMAL(12,2) NOT NULL,
  min_spend DECIMAL(12,2) NOT NULL DEFAULT 0,
  usage_count INT NOT NULL DEFAULT 0,
  usage_limit INT NOT NULL DEFAULT 100,
  expiry_date DATE NULL,
  status ENUM('active', 'expired', 'disabled') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS partners (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  partner_since VARCHAR(10) NOT NULL,
  status ENUM('active', 'pending') NOT NULL DEFAULT 'active',
  logo_url VARCHAR(500) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS banners (
  id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NULL,
  cta_text VARCHAR(100) NULL,
  cta_link VARCHAR(255) NULL,
  image VARCHAR(500) NULL,
  tag_badge VARCHAR(100) NULL,
  display_order INT NOT NULL DEFAULT 0,
  status ENUM('active', 'draft') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
