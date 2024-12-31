
const express = require('express');
const app = express();
const port = 3000;

// Middleware untuk parsing JSON body
app.use(express.json());

// Penyimpanan data to-do dalam array
let tasks = [
    {
        id: 1,
        title: "Belajar Express.js",
        completed: false,
        createdAt: new Date()
    }
];

// Helper function untuk generate ID
const generateId = () => {
    return tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
};

// Route untuk mengecek status server
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Server berjalan dengan baik'
    });
});

// POST /tasks - Membuat tugas baru
app.post('/tasks', (req, res) => {
    const { title } = req.body;
    
    if (!title) {
        return res.status(400).json({
            status: 'error',
            message: 'Title harus diisi'
        });
    }

    const newTask = {
        id: generateId(),
        title,
        completed: false,
        createdAt: new Date()
    };

    tasks.push(newTask);
    
    res.status(201).json({
        status: 'success',
        data: newTask
    });
});

// GET /tasks - Mendapatkan semua tugas
app.get('/tasks', (req, res) => {
    res.json({
        status: 'success',
        data: tasks
    });
});

// GET /tasks/:id - Mendapatkan tugas berdasarkan ID
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return res.status(404).json({
            status: 'error',
            message: 'Task tidak ditemukan'
        });
    }

    res.json({
        status: 'success',
        data: task
    });
});

// PUT /tasks/:id - Mengupdate tugas berdasarkan ID
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({
            status: 'error',
            message: 'Task tidak ditemukan'
        });
    }

    const { title, completed } = req.body;
    
    if (title !== undefined) tasks[taskIndex].title = title;
    if (completed !== undefined) tasks[taskIndex].completed = completed;

    res.json({
        status: 'success',
        data: tasks[taskIndex]
    });
});

// DELETE /tasks/:id - Menghapus tugas berdasarkan ID
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({
            status: 'error',
            message: 'Task tidak ditemukan'
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.json({
        status: 'success',
        data: deletedTask
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});