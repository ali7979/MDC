const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/AuthRoutes');
const db = require('./Db/DbConnection');
const productRoutes = require('./Routes/ProductsRoutes');
const categoryRoutes = require('./Routes/CategoryRoutes');
const bannerRoutes = require('./Routes/BannerRoutes');
const PromoCodeRoutes=require('./Routes/PromoCodeRoutes');
const orderRoutes = require('./Routes/OrderRoutes'); // Assuming you have an order routes file
const TodaysOfferRoutes = require('./Routes/TodaysOfferRoutes'); // Import today's offers routes
const mailRoutes=require('./Mail/mailRouter');
const passport = require('passport')
require('./Config/google-strategy');

require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/orders', orderRoutes); // Include order routes
app.use('/api/promocodes', PromoCodeRoutes);

app.use('/api/mail', mailRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});



app.use('/api/todays-offers',TodaysOfferRoutes);  



app.get('/auth/google',
    passport.authenticate('google', { session:false ,scope: ['profile','email'] }));
  
  app.get('/auth/google/callback', 
    passport.authenticate('google', { session:false,failureRedirect: '/login' }),
    function(req, res) {

const {user,token} =req.user;
console.log(user,token)


    const redirectUrl = `${process.env.FRONTEND_URL}/login/success?token=${token}&name=${user.name}&email=${user.email}`;
    res.redirect(redirectUrl);


    });




const PORT =  process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});