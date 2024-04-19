import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

const port = process.argv[2];
let data = JSON.parse(fs.readFileSync('db.json', 'utf8'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/kill', (req, res) => {
  res.type("text").send("Server is shutting down");
  process.exit(0);
});

app.get('/restore', (req, res) => {
  data = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  res.type("text").send('db.json reloaded');
});

app.get('/countpapers', (req, res) => {
  res.type("text").send(`${data.length}`);
});

app.get('/byauthor/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const count = data.filter(paper => paper.authors.some(author => author.toLowerCase().includes(name))).length;
  res.type("text").send(`${count}`);
});

app.get('/papers_from/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const papers = data.filter(paper => paper.authors.some(author => author.toLowerCase().includes(name)));
  res.json(papers);
});

app.get('/ttlist/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const titles = data.filter(paper => paper.authors.some(author => author.toLowerCase().includes(name))).map(paper => paper.title);
  res.json(titles);
});

app.get('/ref/:key', (req, res) => {
  const paper = data.find(paper => paper.key === req.params.key);
  res.json(paper);
});

app.delete('/ref/:key', (req, res) => {
  data = data.filter(paper => paper.key !== req.params.key);
  res.send('Paper deleted');
});

app.post('/ref', (req, res) => {
  const newPaper = { ...req.body, key: 'imaginary' };
  data.push(newPaper);
  res.send('Paper added');
});

app.put('/ref/:key', (req, res) => {
  const index = data.findIndex(paper => paper.key === req.params.key);
  data[index] = { ...data[index], ...req.body };
  res.send('Paper updated');
});
