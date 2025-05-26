CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
 phone VARCHAR(20),
    address TEXT,
  password VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN DEFAULT FALSE
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
);


CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  discount INT DEFAULT 0,
  image_url VARCHAR(500),
  stock INT DEFAULT 0,
  category_id INT,
  size VARCHAR(10),
  packof INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);


CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);



CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  product_id INT,
 quantity INT DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Processing',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

)

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


CREATE TABLE coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_percent DECIMAL(5,2) NOT NULL,
  expiry_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique ID for the order
    user_id INT,                             -- ID of the user placing the order
    total_price DECIMAL(10, 2),              -- Total price of the entire order (calculated from Order_Items)
    status ENUM('pending', 'shipped', 'completed', 'canceled') NOT NULL,  -- Status of the order
    order_date DATETIME NOT NULL,            -- Date and time when the order was placed
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE   -- Foreign key to Users table
);



CREATE TABLE Order_Items (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique ID for the order item
    order_id INT,                            -- Foreign key to the Orders table
    product_id INT,                          -- Foreign key to the Products table
    quantity INT NOT NULL,                   -- Quantity of the product ordered
    price DECIMAL(10, 2) NOT NULL,           -- Price of the individual product at the time of order
    total_price DECIMAL(10, 2) NOT NULL,     -- Total price for this product (quantity * price)
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,   -- Foreign key to the Orders table
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE -- Foreign key to the Products table
);
