import express from 'express';

const app = express();

app.post('/document', (req, res) => {
  res.send(JSON.stringify({ message: 'hi' }));
});
const port = Number(process.env.PORT);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
