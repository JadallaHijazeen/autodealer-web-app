-- Car Dealership Database Setup
-- Run this SQL script in your MySQL database

-- Create database
CREATE DATABASE IF NOT EXISTS car_dealership;
USE car_dealership;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    color VARCHAR(30) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500) NOT NULL,
    description TEXT,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rentals table
CREATE TABLE IF NOT EXISTS rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id VARCHAR(50) UNIQUE NOT NULL,
    car_id INT NOT NULL,
    user_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INT NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample cars
INSERT INTO cars (make, model, year, color, price, image, description, available) VALUES
('Toyota', 'Camry', 2023, 'white', 50.00, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'Reliable and fuel-efficient sedan perfect for city driving and long trips.', TRUE),
('BMW', 'X5', 2023, 'black', 120.00, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'Luxury SUV with premium features and exceptional performance.', TRUE),
('Mercedes', 'C-Class', 2023, 'silver', 100.00, 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'Elegant and sophisticated sedan with cutting-edge technology.', TRUE),
('Audi', 'A4', 2023, 'blue', 90.00, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'Performance-oriented luxury sedan with sporty handling.', TRUE),
('Honda', 'Civic', 2023, 'red', 40.00, 'https://images.unsplash.com/photo-1619976215249-e86b07f41623?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'Compact and economical car ideal for urban commuting.', TRUE),
('Ford', 'Mustang', 2023, 'red', 110.00, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'Iconic American muscle car with powerful V8 engine.', TRUE),
('Volkswagen', 'Golf', 2023, 'white', 45.00, 'https://images.unsplash.com/photo-1606611014515-343c1c0fd4b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'Versatile hatchback with excellent build quality and comfort.', TRUE),
('Nissan', 'Altima', 2023, 'black', 55.00, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'Mid-size sedan with advanced safety features and smooth ride.', TRUE);

-- Insert a sample user (password is 'password123')
INSERT INTO users (name, email, password, phone) VALUES
('John Demo', 'demo@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '555-0123');

-- Create indexes for better performance
CREATE INDEX idx_cars_available ON cars(available);
CREATE INDEX idx_rentals_dates ON rentals(start_date, end_date);
CREATE INDEX idx_rentals_status ON rentals(status);
CREATE INDEX idx_users_email ON users(email);
