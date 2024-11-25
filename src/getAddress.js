// const connection = require('../database');

// module.exports = async function getAddress(customerId) {
//     const addressDetails = await new Promise((resolve, reject) => {
//         const query = `
//             SELECT 
//                 c.first_name,
//                 c.last_name,
//                 a.street AS address_line_1,
//                 a.address_line_2,
//                 a.city,
//                 a.state,
//                 a.postal_code AS zip_code,
//                 a.country
//             FROM customers c
//             INNER JOIN addresses a ON c.customer_id = a.customer_id
//             WHERE c.customer_id = ?`;

//         connection.query(query, [customerId], (err, rows) => {
//             if (err) {
//                 return reject(err);
//             }
//             resolve(rows.length > 0 ? rows[0] : null);
//         });
//     });

//     return addressDetails;
// };
