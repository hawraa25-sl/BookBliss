USE bookbliss;

-- Customers
INSERT INTO customers (first_name, last_name, password_hash, email, phone_number) VALUES
('Emma', 'Thompson',    ('securepass123', 256), 'emma.thompson@email.com', '+1-555-0123'),
('James', 'Wilson', SHA2('strongpass456', 256), 'james.wilson@email.com', '+1-555-0124');

-- Addresses
INSERT INTO addresses (city, street_name, building_name, floor_number, zipcode, details, customer_id) VALUES
('New York', 'Broadway', 'Sunset Apartments', 5, '10001', 'Near Central Park', 1),
('Boston', 'Beacon Street', 'Harbor View', 3, '02108', 'Next to Public Library', 2);

-- Books
INSERT INTO books (title, author, genre, isbn, price, stock, published_date, description,cover_image_url) VALUES
('Psych', ' Paul Bloom', 'Psychology', '978-0063096356', 13.72,10, '2023-02-28', ' Bloom offers a comprehensive overview of psychology, based on his popular course at Yale University. The book delves into the evolution of psychological thought, covering topics like memory, emotion, and consciousness, blending historical context with modern research','https://m.media-amazon.com/images/I/81QNkeOJobL._SY466_.jpg'),
('Thinking, Fast and Slow', '  Daniel Kahneman ', 'Psychology', '978-0374275631', 18.84,20, '2011-10-25', '  This book explores the dual systems of thought that drive our decisions: the fast, intuitive, and emotional system and the slower, more deliberative, and logical system. Kahneman, a Nobel Prize-winning psychologist, delves into the biases and heuristics that affect our thinking. ',' https://m.media-amazon.com/images/I/61ZQRfblKrL._AC_UY327_FMwebp_QL65_.jpg'),
(' Influence: The Psychology of Persuasion', ' Robert B. Cialdini ', 'Psychology', ' 978-0061241895', 20.99,20, '1984-03-20', ' Cialdinis book explores the psychology behind why people say yesand how to apply these understandings in everyday life. The six principles of persuasion discussed in the book have become foundational in understanding and applying psychological influence',' https://m.media-amazon.com/images/I/717TArPQj1S._AC_UY327_FMwebp_QL65_.jpg '),
('Man`s Search for Meaning', 'Viktor E. Frankl', 'Psychology', '978-0807014271', 17.43,20, '2006-06-1', '  This profound book details Frankl`s experiences as a Holocaust survivor and his development of logotherapy. It emphasizes finding meaning in life as the primary motivational force, even in the most difficult of circumstances.','https://m.media-amazon.com/images/I/81UhnGT7BvL._AC_UY327_FMwebp_QL65_.jpg'),
('Emotional Intelligence: Why It Can Matter More Than IQ','Daniel Goleman', 'Psychology', '  978-0553383713 ', 20.00,20, '1984-03-20', 'The ground breaking book that explores the concept of emotional intelligence (EQ) and its impact on personal and professional success. Goleman argues that while IQ may contribute to academic achievements, it is emotional intelligence that plays a more significant role in navigating social interactions, managing emotions, and building meaningful relationships. ','https://m.media-amazon.com/images/I/71z-XQzRclL._SY466_.jpg '),
(' The Power of Habit: Why We Do What We Do in Life and Business','Charles Duhigg   ', 'Psychology', ' 978-0812981605', 11.26,20, '2012-02-28', ' Duhigg examines the science behind habit formation and transformation. The book explains how habits work, why they exist, and how they can be changed to improve various aspects of life, including personal routines, businesses, and societies',' https://m.media-amazon.com/images/I/41-zoyxnXiL._SY445_SX342_QL70_FMwebp_.jpg '),
(' Atomic habbits: An Easy & Proven Way to Build Good Habits & Break Bad Ones', 'James Clear ', 'SelfHelp', '978-0735211292', 13.49,20, '2018-10-16', 'This book offers a comprehensive guide to forming good habits, breaking bad ones,and mastering the tiny behaviors that lead to remarkable results. Clear combines scientific research with practical advice to help readers transform their lives.','https://m.media-amazon.com/images/I/71F4+7rk2eL._AC_UY327_FMwebp_QL65_.jpg '),
(' Daring Greatly: How the Courage to Be Vulnerable Transforms the Way We Live, Love, Parent, and Lead',' Brené Brown', 'SelfHelp', ' 978-1592408412', 12.28,20, '2012-09-11', 'Brown`s book explores the power of vulnerability and how embracing it can transform our lives. She argues that vulnerability is not a weakness but a source of strength and courage, crucial for building meaningful connections and achieving success.  ',' https://m.media-amazon.com/images/I/711tUD4Nm+L._AC_UY327_FMwebp_QL65_.jpg '),
('The Mountain Is You: Transforming Self-Sabotage Into Self-Mastery','Brianna Wiest','SelfHelp','978-1949759228',19.92, 20, '2020-06-02','The Mountain Is You is a self-help book that delves into the concept of self-sabotage, exploring why we get in our own way and how we can overcome it. Brianna Wiest combines psychological insights with practical advice to help readers identify the root causes of their self-defeating behaviors and transform them into opportunities for personal growth. The book emphasizes the importance of emotional intelligence, resilience, and self-awareness in creating lasting change and mastering one\s life.','https://m.media-amazon.com/images/I/61UC-FYP3gL.AC_UY327_FMwebp_QL65.jpg'),
('The 5 AM Club: Own Your Morning, Elevate Your Life  ', ' Robin Sharma', 'SelfHelp', '978-1443456623 ',  16.49,20, '2018-12-04', ' This book emphasizes the power of a strong morning routine and how waking up at 5 AM can transform your productivity and personal growth. Sharma provides practical strategies for maximizing the first hours of the day to improve focus, energy, and overall success.',' https://m.media-amazon.com/images/I/81eQ6mdkxgL._AC_UY327_FMwebp_QL65_.jpg '),
('12 Rules for Life: An Antidote to Chaos', 'Jordan B. Peterson', 'SelfHelp', '978-0345816023', 25.99, 15, '2018-01-16', '12 Rules for Life provides profound advice to help readers live a meaningful life. Dr. Jordan B. Peterson draws on psychology, philosophy, and personal anecdotes to explore themes of responsibility, discipline, and order in a chaotic world.', ' https://m.media-amazon.com/images/I/71PXmc5BgAL._AC_UY327_FMwebp_QL65_.jpg'), 
('Dont Believe Everything You Think: Why Your Thinking Is The Beginning & End Of Suffering', 'Joseph Nguyen','SelfHelp', '978-1737542307', 19.92, 15, '2021-03-04', 'Joseph Nguyen explores how our thoughts create suffering and prevent us from living a fulfilled life. By understanding how to transcend the mind and its patterns of overthinking, readers are guided toward inner peace and a deeper sense of well-being. This book focuses on changing the way you perceive thoughts, helping you disconnect from them and ultimately free yourself from unnecessary stress and worry.', 'https://m.media-amazon.comimagesI/51xKFo2B+RL._AC_UY327_FMwebp_QL65_.jpg');

INSERT INTO books (title, author, genre, isbn, price, stock, published_date, description, cover_image_url) VALUES
('The Art of Mindfulness', 'Sarah Chen', 'SelfHelp', '978-1234567890', 24.99, 50, '2023-01-15', 'A comprehensive guide to mindful living','images/the_art_of_mindfulness.png');


-- Add reviews for psychology books
INSERT INTO reviews (book_id, customer_id, rating, review_text, review_date) VALUES
(1, 1, 5, 'Excellent introduction to psychology. Bloom explains complex concepts clearly.', '2024-01-15'),
(1, 2, 4, 'Very insightful read, though some parts were quite academic.', '2024-02-01'),
(2, 1, 5, 'Kahneman brilliantly explains how we think. Changed my perspective.', '2024-01-20'),
(4, 2, 5, 'Profound and moving. A must-read for everyone.', '2024-01-25');

-- Add reviews for self-help books
INSERT INTO reviews (book_id, customer_id, rating, review_text, review_date) VALUES
(7, 1, 5, 'Life-changing book on habit formation. Clears writing is excellent.', '2024-02-05'),
(8, 2, 4, 'Browns take on vulnerability is eye-opening.', '2024-01-30'),
(9, 2, 5, 'Powerful insights into self-sabotage. Very relatable content.', '2024-02-15'),
(10, 1, 3, 'Good concepts but the 5 AM wake-up is challenging to maintain.', '2024-01-10'),
(11, 2, 4, 'Peterson provides practical wisdom for modern life.', '2024-02-20');