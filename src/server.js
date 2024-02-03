const app = require('./index');

require('dotenv').config();

const PORT = process.env.PORT || '8080';
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
