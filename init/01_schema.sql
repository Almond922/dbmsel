-- Food Donation Management System Database Schema

-- User Roles Table
CREATE TABLE User_Roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Users Table
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    role_id INT,
    address VARCHAR(255),
    city VARCHAR(100),
    FOREIGN KEY (role_id) REFERENCES User_Roles(role_id) ON DELETE SET NULL
);

-- Pickup Locations Table
CREATE TABLE Pickup_Locations (
    location_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    landmark VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    FOREIGN KEY (donor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Food Categories Table
CREATE TABLE Food_Categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- Listing Status Table
CREATE TABLE Listing_Status (
    status_id INT PRIMARY KEY AUTO_INCREMENT,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

-- Food Listings Table
CREATE TABLE Food_Listings (
    listing_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT,
    quantity INT NOT NULL,
    prepared_time DATETIME,
    expiry_time DATETIME,
    status_id INT,
    pickup_location_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Food_Categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (status_id) REFERENCES Listing_Status(status_id) ON DELETE SET NULL,
    FOREIGN KEY (pickup_location_id) REFERENCES Pickup_Locations(location_id) ON DELETE SET NULL
);

-- Request Status Table
CREATE TABLE Request_Status (
    request_status_id INT PRIMARY KEY AUTO_INCREMENT,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

-- Requests Table
CREATE TABLE Requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    listing_id INT NOT NULL,
    requested_by INT NOT NULL,
    request_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    request_status_id INT,
    FOREIGN KEY (listing_id) REFERENCES Food_Listings(listing_id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (request_status_id) REFERENCES Request_Status(request_status_id) ON DELETE SET NULL
);

-- Assignment Status Table
CREATE TABLE Assignment_Status (
    assignment_status_id INT PRIMARY KEY AUTO_INCREMENT,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

-- Assignments Table
CREATE TABLE Assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    assigned_to INT NOT NULL,
    assigned_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    pickup_time DATETIME,
    delivery_time DATETIME,
    assignment_status_id INT,
    FOREIGN KEY (request_id) REFERENCES Requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assignment_status_id) REFERENCES Assignment_Status(assignment_status_id) ON DELETE SET NULL
);

-- Feedback Table
CREATE TABLE Feedback (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    from_user INT NOT NULL,
    to_user INT NOT NULL,
    listing_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (to_user) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES Food_Listings(listing_id) ON DELETE SET NULL
);

-- Insert default data for lookup tables

-- User Roles
INSERT INTO User_Roles (role_name) VALUES 
('Donor'),
('Recipient'),
('Volunteer'),
('Admin');

-- Food Categories
INSERT INTO Food_Categories (category_name) VALUES 
('Cooked Meals'),
('Raw Ingredients'),
('Packaged Food'),
('Beverages'),
('Bakery Items'),
('Fruits & Vegetables'),
('Dairy Products');

-- Listing Status
INSERT INTO Listing_Status (status_name) VALUES 
('Available'),
('Reserved'),
('Picked Up'),
('Expired'),
('Cancelled');

-- Request Status
INSERT INTO Request_Status (status_name) VALUES 
('Pending'),
('Approved'),
('Rejected'),
('Completed'),
('Cancelled');

-- Assignment Status
INSERT INTO Assignment_Status (status_name) VALUES 
('Assigned'),
('In Progress'),
('Picked Up'),
('Delivered'),
('Failed'),
('Cancelled');
