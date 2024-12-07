-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE carts;
TRUNCATE TABLE reviews;
TRUNCATE TABLE addresses;
TRUNCATE TABLE customers;
TRUNCATE TABLE books;
TRUNCATE TABLE gift_cards;
TRUNCATE TABLE admin;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert customers with SHA2 password hash
INSERT INTO customers (first_name, last_name, password_hash, email, phone_number) VALUES
('John', 'Doe', SHA2('12345678', 256), 'john.doe@email.com', '+1234567890'),
('Jane', 'Smith', SHA2('12345678', 256), 'jane.smith@email.com', '+1234567891'),
('Mike', 'Johnson', SHA2('12345678', 256), 'mike.johnson@email.com', '+1234567892'),
('Sarah', 'Williams', SHA2('12345678', 256), 'sarah.williams@email.com', '+1234567893'),
('David', 'Brown', SHA2('12345678', 256), 'david.brown@email.com', '+1234567894');

-- Insert addresses
INSERT INTO addresses (city, street_name, building_name, floor_number, zipcode, details, customer_id) VALUES
('New York', 'Broadway', 'Apollo Building', 5, '10001', 'Apartment 5A', 1),
('Los Angeles', 'Sunset Blvd', 'Palm Courts', 3, '90028', 'Unit 3B', 2),
('Chicago', 'Michigan Ave', 'Lake View', 8, '60601', 'Suite 801', 3),
('Houston', 'Main Street', 'Oak Residence', 4, '77002', 'Flat 404', 4),
('Miami', 'Ocean Drive', 'Beach Tower', 12, '33139', 'Penthouse 1', 5);

-- Insert books by category
-- Self Help Books
INSERT INTO books (title, author, genre, isbn, price, stock, published_date, description) VALUES
('Master Your Mind', 'Robert Greene', 'SelfHelp', '978-0-123456-01', 29.99, 100, '2023-01-15', 'A guide to mental mastery'),
('The Power of Now 2.0', 'John Smith', 'SelfHelp', '978-0-123456-02', 24.99, 150, '2023-02-20', 'Living in the present'),
('Success Habits', 'Mary Johnson', 'SelfHelp', '978-0-123456-03', 19.99, 200, '2023-03-25', 'Building better habits'),
('Life Reset', 'David Wilson', 'SelfHelp', '978-0-123456-04', 22.99, 120, '2023-04-10', 'Start fresh and succeed'),
('Mindful Living', 'Sarah Brown', 'SelfHelp', '978-0-123456-05', 21.99, 180, '2023-05-15', 'Practice of mindfulness'),
('Goal Setting Mastery', 'Michael Lee', 'SelfHelp', '978-0-123456-06', 25.99, 90, '2023-06-20', 'Achieve your dreams'),
('Emotional Intelligence', 'Emma Davis', 'SelfHelp', '978-0-123456-07', 23.99, 160, '2023-07-25', 'Master your emotions'),
('Daily Wisdom', 'Thomas Anderson', 'SelfHelp', '978-0-123456-08', 20.99, 140, '2023-08-30', 'Daily inspiration'),
('Purpose Driven', 'Lisa White', 'SelfHelp', '978-0-123456-09', 26.99, 110, '2023-09-05', 'Find your purpose'),
('The Confidence Code', 'James Miller', 'SelfHelp', '978-0-123456-10', 27.99, 130, '2023-10-10', 'Build self-confidence');

-- Psychology Books
INSERT INTO books (title, author, genre, isbn, price, stock, published_date, description) VALUES
('Mind Matters', 'Dr. Emily White', 'Psychology', '978-0-123456-11', 34.99, 80, '2023-01-20', 'Understanding the human mind'),
('Behavioral Patterns', 'Dr. John Black', 'Psychology', '978-0-123456-12', 32.99, 100, '2023-02-25', 'Human behavior analysis'),
('The Conscious Mind', 'Dr. Sarah Green', 'Psychology', '978-0-123456-13', 29.99, 120, '2023-03-30', 'Exploring consciousness'),
('Cognitive Science', 'Dr. Michael Brown', 'Psychology', '978-0-123456-14', 31.99, 90, '2023-04-15', 'Understanding cognition'),
('Psychology of Success', 'Dr. Lisa Gray', 'Psychology', '978-0-123456-15', 33.99, 110, '2023-05-20', 'Success mindset'),
('Human Development', 'Dr. David Blue', 'Psychology', '978-0-123456-16', 35.99, 70, '2023-06-25', 'Life stages analysis'),
('Social Psychology', 'Dr. Emma Red', 'Psychology', '978-0-123456-17', 30.99, 130, '2023-07-30', 'Social behavior'),
('Memory and Learning', 'Dr. Thomas Purple', 'Psychology', '978-0-123456-18', 28.99, 150, '2023-08-05', 'Memory enhancement'),
('Personality Types', 'Dr. James Orange', 'Psychology', '978-0-123456-19', 36.99, 85, '2023-09-10', 'Understanding personality'),
('Mental Wellness', 'Dr. Mary Yellow', 'Psychology', '978-0-123456-20', 37.99, 95, '2023-10-15', 'Mental health guide');

-- Finance Books
INSERT INTO books (title, author, genre, isbn, price, stock, published_date, description) VALUES
('Smart Investing', 'Warren Buffer', 'Finance', '978-0-123456-21', 39.99, 75, '2023-01-25', 'Investment strategies'),
('Personal Finance', 'Robert Kiyosaki', 'Finance', '978-0-123456-22', 36.99, 95, '2023-02-28', 'Managing personal wealth'),
('Stock Market Guide', 'Peter Lynch', 'Finance', '978-0-123456-23', 34.99, 115, '2023-03-05', 'Stock market basics'),
('Wealth Building', 'Benjamin Graham', 'Finance', '978-0-123456-24', 37.99, 85, '2023-04-20', 'Building lasting wealth'),
('Financial Freedom', 'David Bach', 'Finance', '978-0-123456-25', 38.99, 105, '2023-05-25', 'Path to freedom'),
('Money Management', 'Suze Orman', 'Finance', '978-0-123456-26', 40.99, 65, '2023-06-30', 'Managing money wisely'),
('Real Estate Investing', 'Donald Trump', 'Finance', '978-0-123456-27', 35.99, 125, '2023-07-05', 'Property investment'),
('Retirement Planning', 'Jack Bogle', 'Finance', '978-0-123456-28', 33.99, 145, '2023-08-10', 'Planning for retirement'),
('Crypto Economics', 'Satoshi Nakamoto', 'Finance', '978-0-123456-29', 41.99, 80, '2023-09-15', 'Understanding crypto'),
('Business Finance', 'Ray Dalio', 'Finance', '978-0-123456-30', 42.99, 90, '2023-10-20', 'Business money management');

-- Romance Books
INSERT INTO books (title, author, genre, isbn, price, stock, published_date, description) VALUES
('Love at First Sight', 'Jane Austin', 'Romance', '978-0-123456-31', 19.99, 200, '2023-01-30', 'Classic love story'),
('Summer Romance', 'Nicholas Sparks', 'Romance', '978-0-123456-32', 18.99, 220, '2023-02-05', 'Summer love tale'),
('The Perfect Match', 'Emily Bronte', 'Romance', '978-0-123456-33', 17.99, 240, '2023-03-10', 'Finding true love'),
('Second Chances', 'Danielle Steel', 'Romance', '978-0-123456-34', 20.99, 180, '2023-04-25', 'Love again story'),
('Heart\'s Desire', 'Nora Roberts', 'Romance', '978-0-123456-35', 21.99, 190, '2023-05-30', 'Passionate romance'),
('Forever Love', 'Julia Quinn', 'Romance', '978-0-123456-36', 22.99, 160, '2023-06-05', 'Eternal love story'),
('Sweet Romance', 'Lisa Kleypas', 'Romance', '978-0-123456-37', 16.99, 250, '2023-07-10', 'Sweet love tale'),
('Love in Paris', 'Christina Lauren', 'Romance', '978-0-123456-38', 15.99, 270, '2023-08-15', 'Parisian romance'),
('The Wedding Date', 'Sophie Kinsella', 'Romance', '978-0-123456-39', 23.99, 175, '2023-09-20', 'Wedding romance'),
('First Love', 'Colleen Hoover', 'Romance', '978-0-123456-40', 24.99, 185, '2023-10-25', 'First love experience');

-- Horror Books
INSERT INTO books (title, author, genre, isbn, price, stock, published_date, description) VALUES
('Dark Night', 'Stephen King', 'Horror', '978-0-123456-41', 25.99, 150, '2023-02-01', 'Terrifying night tale'),
('The Haunting', 'Edgar Poe', 'Horror', '978-0-123456-42', 24.99, 170, '2023-03-15', 'Ghost story'),
('Nightmare House', 'H.P. Lovecraft', 'Horror', '978-0-123456-43', 23.99, 190, '2023-04-01', 'Haunted house story'),
('The Curse', 'Anne Rice', 'Horror', '978-0-123456-44', 26.99, 130, '2023-05-05', 'Ancient curse tale'),
('Dark Forest', 'Clive Barker', 'Horror', '978-0-123456-45', 27.99, 140, '2023-06-10', 'Forest horror story'),
('Midnight Terror', 'Dean Koontz', 'Horror', '978-0-123456-46', 28.99, 110, '2023-07-15', 'Midnight horror'),
('The Entity', 'Richard Matheson', 'Horror', '978-0-123456-47', 22.99, 200, '2023-08-20', 'Supernatural entity'),
('Blood Moon', 'Joe Hill', 'Horror', '978-0-123456-48', 21.99, 220, '2023-09-25', 'Werewolf tale'),
('The Possessed', 'Shirley Jackson', 'Horror', '978-0-123456-49', 29.99, 125, '2023-10-30', 'Possession story'),
('Dark Waters', 'Robert Bloch', 'Horror', '978-0-123456-50', 30.99, 135, '2023-11-05', 'Ocean horror');

-- Fiction Books
INSERT INTO books (title, author, genre, isbn, price, stock, published_date, description) VALUES
('The Journey', 'John Grisham', 'Fiction', '978-0-123456-51', 28.99, 175, '2023-02-05', 'Adventure tale'),
('Time Travelers', 'Neil Gaiman', 'Fiction', '978-0-123456-52', 27.99, 195, '2023-03-20', 'Time travel story'),
('The Last City', 'George Martin', 'Fiction', '978-0-123456-53', 26.99, 215, '2023-04-05', 'Post-apocalyptic'),
('Sky Pirates', 'Terry Pratchett', 'Fiction', '978-0-123456-54', 29.99, 155, '2023-05-10', 'Sky adventure'),
('Dragon\'s Tale', 'Brandon Sanderson', 'Fiction', '978-0-123456-55', 30.99, 165, '2023-06-15', 'Dragon story'),
('The Quest', 'Patrick Rothfuss', 'Fiction', '978-0-123456-56', 31.99, 135, '2023-07-20', 'Epic quest'),
('New World', 'Andy Weir', 'Fiction', '978-0-123456-57', 25.99, 225, '2023-08-25', 'Sci-fi adventure'),
('The Detective', 'Dan Brown', 'Fiction', '978-0-123456-58', 24.99, 245, '2023-09-30', 'Mystery story'),
('Magic School', 'Diana Wynne Jones', 'Fiction', '978-0-123456-59', 32.99, 150, '2023-10-05', 'Magical school'),
('Space Wars', 'Douglas Adams', 'Fiction', '978-0-123456-60', 33.99, 160, '2023-11-10', 'Space adventure');

-- Insert sample reviews (variety of ratings and books across different genres)
INSERT INTO reviews (customer_id, book_id, rating, review_text) VALUES
-- John Doe's reviews (customer_id = 1)
(1, 1, 5, 'Excellent book on mental mastery. Really helped me focus better.'),
(1, 15, 4, 'Great insights into psychology. Very practical examples.'),
(1, 25, 5, 'Changed my perspective on personal finance.'),
(1, 35, 3, 'Decent romance novel but a bit predictable.'),
(1, 45, 4, 'Genuinely creepy horror story. Could not put it down.'),
(1, 55, 5, 'Amazing world-building and character development.'),

-- Jane Smith's reviews (customer_id = 2)
(2, 2, 4, 'Very insightful guide to mindfulness.'),
(2, 12, 5, 'Fascinating exploration of behavioral patterns.'),
(2, 22, 3, 'Good introduction to personal finance.'),
(2, 32, 5, 'Beautiful summer romance story. Loved it!'),
(2, 42, 4, 'Spooky and well-written horror novel.'),
(2, 52, 4, 'Engaging time travel narrative.'),

-- Mike Johnson's reviews (customer_id = 3)
(3, 3, 3, 'Helpful but could be more detailed.'),
(3, 13, 5, 'Excellent analysis of consciousness.'),
(3, 23, 4, 'Solid advice on stock market investing.'),
(3, 33, 2, 'Not my type of romance novel.'),
(3, 43, 5, 'Best horror book I have read this year!'),
(3, 53, 4, 'Great post-apocalyptic story.'),

-- Sarah Williams's reviews (customer_id = 4)
(4, 4, 5, 'Life-changing advice on habits.'),
(4, 14, 4, 'Interesting cognitive science concepts.'),
(4, 24, 5, 'Very practical wealth building strategies.'),
(4, 34, 4, 'Sweet and touching romance.'),
(4, 44, 3, 'Decent horror story but not scary enough.'),
(4, 54, 5, 'Adventure packed and thrilling!'),

-- David Brown's reviews (customer_id = 5)
(5, 5, 4, 'Good introduction to mindfulness.'),
(5, 15, 5, 'Deep insights into human psychology.'),
(5, 25, 4, 'Well-explained financial concepts.'),
(5, 35, 5, 'Perfect beach read romance.'),
(5, 45, 4, 'Atmospheric and creepy horror novel.'),
(5, 55, 3, 'Good fantasy but too complex at times.');


INSERT INTO `admin` (email, password_hash) 
VALUES ('admin@bookstore.com', SHA2('12345678', 256));