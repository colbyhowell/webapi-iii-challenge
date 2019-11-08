require('dotenv').config()
const server = require('./server');

const port = process.env.PORT || 5000
//  const {PORT} = process.env (case matters when destructured)

server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});