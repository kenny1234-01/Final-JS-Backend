const express = require('express');
const sqlite = require('sqlite3');
const app = express();
const bodyParser = require('body-parser');
const PORT = 5500;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//ประกาศตัวแปรเพื่อจะสร้าง Database
const db = new sqlite.Database('./Database/Book.sqlite');

//สร้าง Database พร้อมกำหนดตัวรับข้อมูลพร้อมชนิดข้อมูล
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT
)`);

//หน้าแรก
app.get('/', (req, res) => {
    res.send('HelloWorld');
});

// ดูข้อมูล books
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

app.get('/books/:id', (req, res) => {
    db.all('SELECT * FROM books WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('Book not found');
            } else {
                res.json(row)
            }
        }
    });
});

// เพิ่มข้อมูล books
app.post('/books', (req, res) => {
    const book = req.body;
    db.run('INSERT INTO books (title, author) VALUES (?, ?)', book.title, book.author, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            book.id = this.lastID;
            res.send(book);
        }
    });
});


// แก้ไขข้อมูล books
app.put('/books/:id', (req, res) => {
    const book = req.body;
    db.run('UPDATE books SET title=?, author=? WHERE id=?', book.title, book.author, req.params.id, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(book);
        }
    });

});

// ลบข้อมูล books
app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send("ลบข้อมูลแล้ว");
        }
    });
});


// รันเซิฟเวอร์
app.listen(PORT, () => {
    console.log(`Web Appication Server Running http://localhost:${PORT}`);
});