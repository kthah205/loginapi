const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Giả lập dữ liệu người dùng
const users = [
  { username: 'user1', password: 'pass1' },
  { username: 'user2', password: 'pass2' }
];

// Secret key cho JWT
const SECRET_KEY = 'mysecretkey';

// Đăng nhập
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra người dùng
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
  }

  // Tạo token JWT
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: 'Đăng nhập thành công', token });
});

// Xác thực JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Route bảo vệ
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Chào mừng bạn đến với trang bảo vệ!', user: req.user });
});

// Chạy server
app.listen(PORT, () => {
  console.log(`Server chạy trên cổng ${PORT}`);
});
