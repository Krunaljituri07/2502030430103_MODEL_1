const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Car = require('./models/Car');
const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/solara_db';
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '-');
    const ext = path.extname(safeName);
    const base = path.basename(safeName, ext);
    cb(null, `${base}-${timestamp}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed.'), false);
    }
    cb(null, true);
  }
});

mongoose.set('strictQuery', false);
mongoose.connect(mongoUri)
  .then(() => console.log('SOLARA MongoDB connected'))
  .catch((error) => {
    console.error('SOLARA MongoDB connection error:', error);
    process.exit(1);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));
app.use(express.static(__dirname));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/', (req, res) => res.send('SOLARA API running'));

app.get('/api/cars', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
    const cars = await Car.find(filter).sort({ createdAt: -1 }).lean();
    cars.forEach((car) => {
      car.image = normalizeImagePath(car.image);
    });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

function normalizeImagePath(image) {
  if (!image) return image;
  const uploadIndex = image.indexOf('/uploads/');
  return uploadIndex >= 0 ? image.slice(uploadIndex) : image;
}

app.post('/api/cars', upload.single('image'), async (req, res) => {
  try {
    const { brand, model, category, status, price, rentalPrice, color, year, acceleration, maxSpeed, power, fuel, seats, rating, reviews, featured, description, rentalNotes } = req.body;

    if (!brand || !model || !price || !rentalPrice) {
      return res.status(400).json({ error: 'Brand, model, price and rentalPrice are required.' });
    }
    if (!req.file) return res.status(400).json({ error: 'Image upload required.' });

    const imageUrl = `/uploads/${req.file.filename}`;

    const car = new Car({
      brand,
      model,
      category: category || 'sports',
      status: status || 'available',
      price: Number(price),
      rentalPrice: Number(rentalPrice),
      image: imageUrl,
      color,
      year: Number(year) || undefined,
      acceleration,
      maxSpeed,
      power,
      fuel,
      seats: Number(seats) || undefined,
      rating: Number(rating) || undefined,
      reviews: Number(reviews) || undefined,
      featured: featured === 'true' || featured === 'on' || false,
      description,
      rentalNotes,
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    console.error('SOLARA car save error:', error);
    res.status(400).json({ error: 'Failed to save car' });
  }
});

app.put('/api/cars/:id', async (req, res) => {
  try {
    const allowed = ['brand', 'model', 'category', 'status', 'price', 'rentalPrice', 'color', 'year', 'acceleration', 'maxSpeed', 'power', 'fuel', 'seats', 'rating', 'reviews', 'featured', 'description', 'rentalNotes'];
    const update = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    });
    ['price', 'rentalPrice', 'year', 'seats', 'rating', 'reviews'].forEach((key) => {
      if (update[key] !== undefined) update[key] = Number(update[key]);
    });
    const car = await Car.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!car) return res.status(404).json({ error: 'Car not found.' });
    res.json(car);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update car.' });
  }
});

app.delete('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found.' });
    res.json({ message: 'Car removed.' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to remove car.' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required.' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered.' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashed });
    await user.save();
    res.status(201).json({ message: 'Signup successful', user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    console.error('SOLARA signup error:', err);
    res.status(500).json({ error: 'Unable to create account.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials.' });
    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    console.error('SOLARA login error:', err);
    res.status(500).json({ error: 'Unable to log in.' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.car').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customer, userId, items, paymentMethod } = req.body;
    if (!customer || !customer.name || !customer.email || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'Customer and order items are required.' });
    }

    const hydratedItems = [];
    for (const item of items) {
      const car = await Car.findById(item.carId);
      if (!car) return res.status(404).json({ error: 'One of the selected cars was not found.' });
      if (car.status !== 'available') return res.status(409).json({ error: `${car.brand} ${car.model} is not available.` });
      const type = item.type || 'buy';
      hydratedItems.push({
        car: car._id,
        brand: car.brand,
        model: car.model,
        type,
        amount: type === 'rent' ? car.rentalPrice : car.price,
      });
    }

    const orderTypes = [...new Set(hydratedItems.map(item => item.type))];
    const order = new Order({
      customer,
      user: userId || undefined,
      items: hydratedItems,
      total: hydratedItems.reduce((sum, item) => sum + item.amount, 0),
      orderType: orderTypes.length === 1 ? orderTypes[0] : 'mixed',
      paymentMethod,
      status: hydratedItems.some(item => item.type === 'rent') ? 'active' : 'pending',
    });

    await order.save();
    for (const item of hydratedItems) {
      await Car.findByIdAndUpdate(item.car, { status: item.type === 'rent' ? 'rented' : 'sold' });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('SOLARA order error:', error);
    res.status(400).json({ error: 'Failed to place order.' });
  }
});

app.get('/api/admin/summary', async (req, res) => {
  try {
    const [totalCars, availableCars, rentedCars, soldCars, users, orders] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ status: 'available' }),
      Car.countDocuments({ status: 'rented' }),
      Car.countDocuments({ status: 'sold' }),
      User.countDocuments(),
      Order.countDocuments(),
    ]);
    res.json({ totalCars, availableCars, rentedCars, soldCars, users, orders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary.' });
  }
});

app.listen(port, () => console.log(`SOLARA server listening http://localhost:${port}`));
