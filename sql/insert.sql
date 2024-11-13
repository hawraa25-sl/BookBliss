-- Customers
INSERT INTO customers (first_name, last_name, password_hash, email, phone_number) VALUES
('Emma', 'Thompson', SHA2('securepass123', 256), 'emma.thompson@email.com', '+1-555-0123'),
('James', 'Wilson', SHA2('strongpass456', 256), 'james.wilson@email.com', '+1-555-0124');

-- Addresses
INSERT INTO addresses (city, street_name, building_name, floor_number, zipcode, details, customer_id) VALUES
('New York', 'Broadway', 'Sunset Apartments', 5, '10001', 'Near Central Park', 1),
('Boston', 'Beacon Street', 'Harbor View', 3, '02108', 'Next to Public Library', 2);

-- Books
INSERT INTO books (title, author, genre, isbn, price, stock, published_date, description) VALUES
('The Art of Mindfulness', 'Sarah Chen', 'Self help', '978-1234567890', 24.99, 50, '2023-01-15', 'A comprehensive guide to mindful living'),
('Understanding Yourself', 'Dr. Michael Brooks', 'Psychology', '978-1234567891', 29.99, 40, '2023-02-20', 'Deep dive into self-discovery'),
('Smart Money Moves', 'Robert Green', 'Personal Finance', '978-1234567892', 19.99, 60, '2023-03-10', 'Essential financial planning guide'),
('Love in Paris', 'Sophie Martin', 'Romance', '978-1234567893', 15.99, 75, '2023-04-05', 'A touching love story in the city of lights'),
('The Last Summer', 'Emily White', 'Fiction', '978-1234567894', 17.99, 55, '2023-05-12', 'Coming of age story'),
('Shadows in the Dark', 'James Black', 'Horror', '978-1234567895', 18.99, 45, '2023-06-20', 'Spine-chilling supernatural thriller'),
('Mindset Mastery', 'Lisa Johnson', 'Self help', '978-1234567896', 22.99, 65, '2023-07-15', 'Transform your thinking patterns'),
('The Human Mind', 'Dr. Alex Turner', 'Psychology', '978-1234567897', 31.99, 35, '2023-08-01', 'Latest research in psychology'),
('Wealth Building 101', 'Patricia Moore', 'Personal Finance', '978-1234567898', 26.99, 50, '2023-09-10', 'Foundation of personal wealth'),
('Moonlight Dance', 'Claire Rose', 'Romance', '978-1234567899', 16.99, 70, '2023-10-05', 'A magical romance under the stars'),
('The Silent Echo', 'Thomas Gray', 'Fiction', '978-1234567900', 20.99, 60, '2023-11-15', 'Mystery in a small town'),
('Dark Corridors', 'Vincent King', 'Horror', '978-1234567901', 19.99, 40, '2023-12-01', 'Horror in an abandoned mansion'),
('Daily Habits', 'Mark Stevens', 'Self help', '978-1234567902', 23.99, 55, '2024-01-10', 'Building better habits'),
('Emotional Intelligence', 'Dr. Sarah Wells', 'Psychology', '978-1234567903', 28.99, 45, '2024-02-01', 'Understanding emotions'),
('Investment Strategies', 'William Turner', 'Personal Finance', '978-1234567904', 25.99, 50, '2024-03-01', 'Modern investment guide');