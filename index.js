var express = require('express');
var cors = require('cors')
var bodyparser = require('body-parser')
var app = express();
var { testConnection } = require('./src/db/pool.js')

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.get('/', (req, res) => {
  try {
    await testConnection()
    res.status(200).send('NO Hello World 3.1')
  } catch (error) {
    console.error('Ping DB thất bại:', error.message);
    res.status(500).send('Database connection error');
  }
})

// Middleware kiểm tra API key
function checkApiKey(req, res, next) {
  const userApiKey = req.headers['api-key'] || req.query.apiKey; // Lấy API key từ phần header

  // Kiểm tra API key
  if (userApiKey && userApiKey === process.env.API_KEY) {
    next(); // Tiếp tục xử lý nếu API key đúng
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid API key' });
  }
}

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(checkApiKey);

//import Route
const users = require('./routes/users.js');
const classs = require('./routes/class.js');
const rules = require('./routes/rules.js');
const week = require('./routes/week.js');
const feedback = require('./routes/feedback.js');
const lichtruc = require('./routes/lichtruc.js');
const score = require('./routes/score.js');
const vipham = require('./routes/vipham.js');
const student = require('./routes/student.js');
const auth = require('./routes/auth.js');
const sodaubai = require('./routes/sodaubai.js');
const authMiddleware = require('./src/middleware/auth.middleware');

// use Route - using route-level auth
app.use(auth);
app.use(feedback);
app.use(vipham);
app.use(sodaubai);
app.use(users);
app.use(classs);
app.use(rules);
app.use(week);
app.use(lichtruc);
app.use(score);
app.use(student);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

app.listen(3000, () => console.log('Node server running @ http://localhost:3000'));

console.log(new Date().toString())