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

-- =============================================
-- SAMPLE DATA FOR DEMO
-- =============================================

-- Users (5 users - 2 donors, 2 recipients, 1 volunteer)
INSERT INTO Users (name, phone, email, role_id, address, city) VALUES
('Rahul Sharma', '9876543210', 'rahul.sharma@email.com', 1, '123 MG Road', 'Mumbai'),
('Priya Patel', '9876543211', 'priya.patel@email.com', 1, '456 Park Street', 'Delhi'),
('Amit Kumar', '9876543212', 'amit.kumar@email.com', 2, '789 Gandhi Nagar', 'Bangalore'),
('Sneha Reddy', '9876543213', 'sneha.reddy@email.com', 2, '321 Lake View', 'Hyderabad'),
('Vikram Singh', '9876543214', 'vikram.singh@email.com', 3, '654 Hill Road', 'Chennai');

-- Pickup Locations (4 locations for donors)
INSERT INTO Pickup_Locations (donor_id, address, landmark, latitude, longitude) VALUES
(1, '123 MG Road, Mumbai', 'Near Central Mall', 19.0760, 72.8777),
(1, '100 Andheri West', 'Opposite Metro Station', 19.1136, 72.8697),
(2, '456 Park Street, Delhi', 'Behind City Hospital', 28.6139, 77.2090),
(2, '200 Connaught Place', 'Next to Coffee House', 28.6315, 77.2167);

-- Food Listings (20 listings)
INSERT INTO Food_Listings (user_id, category_id, quantity, prepared_time, expiry_time, status_id, pickup_location_id) VALUES
(1, 1, 50, '2025-12-09 08:00:00', '2025-12-09 20:00:00', 1, 1),
(1, 2, 30, '2025-12-09 09:00:00', '2025-12-12 09:00:00', 1, 1),
(1, 3, 100, '2025-12-08 10:00:00', '2025-12-15 10:00:00', 1, 2),
(2, 1, 25, '2025-12-09 07:00:00', '2025-12-09 19:00:00', 1, 3),
(2, 4, 40, '2025-12-09 06:00:00', '2025-12-10 06:00:00', 1, 3),
(1, 5, 60, '2025-12-09 05:00:00', '2025-12-11 05:00:00', 2, 1),
(2, 6, 80, '2025-12-08 14:00:00', '2025-12-10 14:00:00', 2, 4),
(1, 7, 20, '2025-12-09 04:00:00', '2025-12-11 04:00:00', 1, 2),
(2, 1, 35, '2025-12-09 11:00:00', '2025-12-09 23:00:00', 3, 3),
(1, 2, 45, '2025-12-08 12:00:00', '2025-12-11 12:00:00', 3, 1),
(2, 3, 70, '2025-12-07 08:00:00', '2025-12-14 08:00:00', 1, 4),
(1, 4, 55, '2025-12-09 10:00:00', '2025-12-10 10:00:00', 1, 2),
(2, 5, 90, '2025-12-08 09:00:00', '2025-12-10 09:00:00', 4, 3),
(1, 6, 15, '2025-12-09 13:00:00', '2025-12-11 13:00:00', 1, 1),
(2, 7, 28, '2025-12-09 07:30:00', '2025-12-11 07:30:00', 1, 4),
(1, 1, 42, '2025-12-09 06:30:00', '2025-12-09 18:30:00', 1, 2),
(2, 2, 65, '2025-12-08 15:00:00', '2025-12-11 15:00:00', 5, 3),
(1, 3, 38, '2025-12-09 08:30:00', '2025-12-16 08:30:00', 1, 1),
(2, 4, 22, '2025-12-09 09:30:00', '2025-12-10 09:30:00', 1, 4),
(1, 5, 85, '2025-12-08 11:00:00', '2025-12-10 11:00:00', 1, 2);

-- Requests (15 requests)
INSERT INTO Requests (listing_id, requested_by, request_time, request_status_id) VALUES
(1, 3, '2025-12-09 09:00:00', 2),
(2, 4, '2025-12-09 10:00:00', 2),
(3, 3, '2025-12-09 10:30:00', 1),
(4, 4, '2025-12-09 08:00:00', 2),
(5, 3, '2025-12-09 07:00:00', 4),
(6, 4, '2025-12-09 06:00:00', 2),
(7, 3, '2025-12-09 15:00:00', 2),
(8, 4, '2025-12-09 05:00:00', 1),
(11, 3, '2025-12-09 09:30:00', 1),
(12, 4, '2025-12-09 11:00:00', 2),
(14, 3, '2025-12-09 14:00:00', 1),
(15, 4, '2025-12-09 08:30:00', 3),
(16, 3, '2025-12-09 07:30:00', 1),
(18, 4, '2025-12-09 09:15:00', 2),
(19, 3, '2025-12-09 10:15:00', 1);

-- Assignments (8 assignments)
INSERT INTO Assignments (request_id, assigned_to, assigned_time, pickup_time, delivery_time, assignment_status_id) VALUES
(1, 5, '2025-12-09 09:30:00', '2025-12-09 10:00:00', '2025-12-09 11:00:00', 4),
(2, 5, '2025-12-09 10:30:00', '2025-12-09 11:00:00', NULL, 2),
(4, 5, '2025-12-09 08:30:00', '2025-12-09 09:00:00', '2025-12-09 10:00:00', 4),
(5, 5, '2025-12-09 07:30:00', '2025-12-09 08:00:00', '2025-12-09 09:00:00', 4),
(6, 5, '2025-12-09 06:30:00', NULL, NULL, 1),
(7, 5, '2025-12-09 15:30:00', NULL, NULL, 1),
(10, 5, '2025-12-09 11:30:00', '2025-12-09 12:00:00', NULL, 3),
(14, 5, '2025-12-09 09:45:00', NULL, NULL, 1);

-- Feedback (10 feedback entries)
INSERT INTO Feedback (from_user, to_user, listing_id, rating, comments, date) VALUES
(3, 1, 1, 5, 'Excellent quality food! Very fresh and well packed.', '2025-12-09 12:00:00'),
(4, 2, 4, 4, 'Good food, slightly delayed pickup but overall great.', '2025-12-09 11:00:00'),
(3, 5, 1, 5, 'Very punctual volunteer. Delivered on time!', '2025-12-09 11:30:00'),
(1, 3, 1, 5, 'Polite recipient, easy coordination.', '2025-12-09 12:30:00'),
(4, 5, 4, 4, 'Good service, friendly volunteer.', '2025-12-09 10:30:00'),
(2, 4, 4, 5, 'Grateful recipient, smooth handover.', '2025-12-09 10:45:00'),
(3, 1, 6, 4, 'Nice bakery items, would love more variety.', '2025-12-09 07:00:00'),
(4, 2, 7, 5, 'Fresh fruits and vegetables, very happy!', '2025-12-09 16:00:00'),
(3, 5, 5, 5, 'Superb delivery experience, highly recommend.', '2025-12-09 09:30:00'),
(1, 5, 1, 5, 'Vikram is an amazing volunteer, very reliable.', '2025-12-09 13:00:00');
