-- 1. RESET DATABASE
DROP DATABASE IF EXISTS kni_travels;
CREATE DATABASE kni_travels;
USE kni_travels;

-- 2. CREATE TABLES

-- Users Table
CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username varchar(50) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  role varchar(20) DEFAULT 'user',
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Destinations Table
CREATE TABLE destinations (
  id int(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title varchar(255) NOT NULL,
  location varchar(255) NOT NULL,
  price decimal(10,2) NOT NULL,
  image_url text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bookings Table
CREATE TABLE bookings (
  id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id int(11) NOT NULL,
  trip_id int(11) NOT NULL,
  trip_title varchar(255) DEFAULT NULL,
  trip_price decimal(10,2) DEFAULT NULL,
  booking_date timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contacts Table
CREATE TABLE contacts (
  id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  message text NOT NULL,
  status varchar(20) DEFAULT 'Pending',
  sent_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Recovery Codes Table
CREATE TABLE recovery_codes (
  id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id int(11) NOT NULL,
  code varchar(255) NOT NULL,
  is_used tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. INSERT DEFAULT DATA

-- Create Admin User (Password: admin123)
INSERT INTO users (username, password, role) VALUES 
('admin', '$2y$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'admin');

-- Insert Initial Destinations
INSERT INTO destinations (title, location, price, image_url) VALUES
('Mt. Fuji', 'Japan', 4440.00, 'assets/hero1.jpg'),
('Bpracay', 'Aklan, Philippines', 4500.00, 'https://i.pinimg.com/1200x/68/d0/e0/68d0e0bcb5eec82cb2165c9374b1510b.jpgg');

-- 4. ADD CONSTRAINTS

-- Link Bookings to Users (Delete booking if user is deleted)
ALTER TABLE bookings
  ADD CONSTRAINT bookings_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- Link Recovery Codes to Users (Delete codes if user is deleted)
ALTER TABLE recovery_codes
  ADD CONSTRAINT recovery_codes_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;