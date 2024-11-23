const connection = require('./database');

module.exports = async function getCart(customerId) {
    const cartDetails = await new Promise((resolve, reject) => {
        const query = `
            SELECT 
                c.cart_id,
                ci.cart_item_id,
                b.book_id,
                b.title,
                b.author,
                b.genre,
                b.price AS book_price,
                b.cover_image_url,
                ci.quantity,
                ci.price AS item_price
            FROM carts c
            INNER JOIN cart_items ci ON c.cart_id = ci.cart_id
            INNER JOIN books b ON ci.book_id = b.book_id
            WHERE c.customer_id = ?`;

        connection.query(query, [customerId], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });

    // Check if the cart is empty
    if (cartDetails.length === 0) {
        return { cart_id: null, items: [] };
    }

    // Extract cart information and items
    return {
        cart_id: cartDetails[0].cart_id,
        items: cartDetails.map(item => ({
            cart_item_id: item.cart_item_id,
            book_id: item.book_id,
            title: item.title,
            author: item.author,
            genre: item.genre,
            price: item.book_price,
            cover_image_url: item.cover_image_url,
            quantity: item.quantity,
            total_price: item.item_price,
        }))
    };

}