const db = require('../Db/DbConnection');
const sendOrderConfirmationEmail = require('../Mail/MailController'); 


// Create Order (Accessible to authenticated users)
exports.createOrder = async (req, res) => {
  const { items, total_price, status,address} = req.body;

  // Validation for missing fields
  if ( !items || !total_price || !status || !address ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Insert order into the orders table
    const [result] = await db.execute('INSERT INTO orders (user_id, total_price, status,address) VALUES (?, ?, ?,?)', [req.user.id, total_price, status ,address]);

    // Insert order items into the order_items table (handling multiple items)
    for (let item of items) {
      console.log(item);
      const { id, quantity,MRP,price,name,image_url } = item;
      await db.execute('INSERT INTO order_items (order_id, product_id,product_name, quantity,price,mrp,image_url) VALUES (?, ?,?, ?,?,?,?)', [result.insertId, id,name, quantity,price,MRP,image_url]);
    }

  
const [u]= await db.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);




    const replacements = {
  customer_name: u[0].name,
  order_number: `ORD${result.insertId}`,
  order_date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  shipping_address: address,
  order_total: `₹${total_price}`,
  order_link: `https://mamadreamcare.com/orders/MDC${result.insertId}`,
  year: new Date().getFullYear(),
  items: items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: `₹${item.price}`,
    mrp: `₹${item.MRP}`,
    packof: item.packof || 'N/A'

  }))
};


console.log(replacements);

  res.status(201).json({ message: 'Order created successfully', order_id: result.insertId });

await sendOrderConfirmationEmail(u[0].email, replacements);



  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Get All Orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT 
        o.id AS order_id, 
        o.user_id,
        u.name AS user_name,
        u.phone AS user_phone,
        o.status,
        o.total_price,
        o.order_date,
        o.address,
        oi.product_id,
        oi.image_url AS product_image,
        oi.quantity,
        oi.product_name,
        oi.mrp,
        oi.price
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN users u ON o.user_id = u.id
      ORDER BY o.id DESC, oi.id DESC
    `);

    const ordersMap = {};

    orders.forEach(row => {
      const orderId = row.order_id;

      if (!ordersMap[orderId]) {
        ordersMap[orderId] = {
          order_id: row.order_id,
          user_id: row.user_id,
          status: row.status,
          total_price: row.total_price,
          order_date: row.order_date,
          address: row.address,
          user_name: row.user_name,
          user_phone: row.user_phone,
          items: []
        };
      }

      ordersMap[orderId].items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        product_image: row.product_image,
        quantity: row.quantity,
        mrp: row.mrp,
        price: row.price
      });
    });

    // Convert to array and sort by order_id descending (in case SQL order is not preserved)
    const ordersArray = Object.values(ordersMap).sort((a, b) => b.order_id - a.order_id);

    res.json(ordersArray);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get Order by ID (Accessible to authenticated users)
exports.getOrderById = async (req, res) => {
const id=req.user.id
  try {
    const [orders] = await db.execute(
        `SELECT 
           o.id AS order_id, 
           o.user_id,
           o.status,
           o.total_price,
           o.order_date,
           o.address,
           p.id AS product_id,
           p.name AS product_name,
           p.image_url AS product_image,
           oi.quantity
           , oi.mrp, oi.price
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         JOIN products p ON oi.product_id = p.id
         WHERE o.user_id = ? 
         ORDER BY o.id DESC, oi.id DESC`
         , 
        [id]
      );
    if (orders.length === 0) return res.status(404).json({ message: 'Order not found' });

    // Fetch the order items for the given order ID
   // const [orderItems] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [id]);

  const ordersMap = {};

    orders.forEach(row => {
      const orderId = row.order_id;

      if (!ordersMap[orderId]) {
        ordersMap[orderId] = {
          order_id: row.order_id,
          user_id: row.user_id,
          status: row.status,
          total_price: row.total_price,
          order_date: row.order_date,
          address: row.address,
          items: []
        };
      }

      ordersMap[orderId].items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        product_image: row.product_image,
        quantity: row.quantity,
        mrp: row.mrp,
        price: row.price
      });
    });

     const ordersArray = Object.values(ordersMap).sort((a, b) => b.order_id - a.order_id);

    // Send grouped orders as an array
    res.json(Object.values(ordersArray));

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// Update Order (Admin only)
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [existingOrder] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
    if (existingOrder.length === 0) return res.status(404).json({ message: 'Order not found' });

    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Order updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating order' });
  }
};

// Delete Order (Admin only)
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const [existingOrder] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
    if (existingOrder.length === 0) return res.status(404).json({ message: 'Order not found' });

    // Delete associated items from the order_items table
    await db.execute('DELETE FROM order_items WHERE order_id = ?', [id]);

    // Now delete the order itself
    await db.execute('DELETE FROM orders WHERE id = ?', [id]);

    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting order' });
  }
};


exports.getOrderByUserIdandProductID = async (req, res) => {
  const userId = req.user.id;
  const { pid } = req.params;

  try {
    const [orders] = await db.execute(`
      SELECT 
        o.order_date
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ? AND oi.product_id = ?
      ORDER BY o.id DESC, oi.id DESC
      LIMIT 1
    `, [userId, pid]);

    if (orders.length === 0) {
      return res.status(200).json({ message: 'No orders found for this user' });
    }

    res.json(orders[0]); // Return the most recent order
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};