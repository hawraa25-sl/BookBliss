-- Modify reviews to cascade delete when customer or book is deleted
ALTER TABLE reviews
DROP FOREIGN KEY reviews_ibfk_1;
ALTER TABLE reviews
DROP FOREIGN KEY reviews_ibfk_2;

ALTER TABLE reviews
ADD CONSTRAINT reviews_ibfk_1 
FOREIGN KEY (customer_id) REFERENCES customers(customer_id) 
ON DELETE CASCADE;
ALTER TABLE reviews
ADD CONSTRAINT reviews_ibfk_2 
FOREIGN KEY (book_id) REFERENCES books(book_id) 
ON DELETE CASCADE;

-- Modify addresses to cascade delete when customer is deleted
ALTER TABLE addresses
DROP FOREIGN KEY addresses_ibfk_1;

ALTER TABLE addresses
ADD CONSTRAINT addresses_ibfk_1 
FOREIGN KEY (customer_id) REFERENCES customers(customer_id) 
ON DELETE CASCADE;

-- Modify cart_items to cascade delete when cart or book is deleted
ALTER TABLE cart_items
DROP FOREIGN KEY cartitems_ibfk_1;
ALTER TABLE cart_items
DROP FOREIGN KEY cartitems_ibfk_2;

ALTER TABLE cart_items
ADD CONSTRAINT cartitems_ibfk_1 
FOREIGN KEY (cart_id) REFERENCES carts(cart_id) 
ON DELETE CASCADE;
ALTER TABLE cart_items
ADD CONSTRAINT cartitems_ibfk_2 
FOREIGN KEY (book_id) REFERENCES books(book_id) 
ON DELETE CASCADE;

-- Modify carts to cascade delete when customer is deleted
ALTER TABLE carts
DROP FOREIGN KEY carts_ibfk_1;

ALTER TABLE carts
ADD CONSTRAINT carts_ibfk_1 
FOREIGN KEY (customer_id) REFERENCES customers(customer_id) 
ON DELETE CASCADE;



-- Modify orders to cascade delete when customer is deleted
ALTER TABLE orders
DROP FOREIGN KEY orders_ibfk_1;
ALTER TABLE orders
DROP FOREIGN KEY orders_ibfk_2;

ALTER TABLE orders
ADD CONSTRAINT orders_ibfk_1 
FOREIGN KEY (customer_id) REFERENCES customers(customer_id) 
ON DELETE CASCADE;

ALTER TABLE orders
ADD CONSTRAINT orders_ibfk_2 
FOREIGN KEY (gift_card_id) REFERENCES gift_cards(gift_card_id) 
ON DELETE SET NULL;