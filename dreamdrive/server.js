const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Car = require('./models/Car');
const User = require('./models/User');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dreamdrive';
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

app.use(express.json());
app.use('/uploads', express.static(uploadDir));

mongoose.set('strictQuery', false);

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Dreamdrive API is running');
});

app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

app.post('/api/cars', upload.single('image'), async (req, res) => {
  try {
    const {
      brand,
      model,
      category,
      price,
      rentalPrice,
      color,
      year,
      acceleration,
      maxSpeed,
      power,
      fuel,
      seats,
      rating,
      reviews,
      featured,
    } = req.body;

    if (!brand || !model || !price || !rentalPrice) {
      return res.status(400).json({ error: 'Brand, model, price, and rentalPrice are required.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Car image upload is required.' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const car = new Car({
      brand,
      model,
      category: category || 'sports',
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
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    console.error('Car save error:', error);
    res.status(400).json({ error: 'Failed to save car' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'Signup successful. You can now log in.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Unable to create account.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    res.json({
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Unable to log in.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
