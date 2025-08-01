const express = require('express');
const app = express();
const PORT = 3001;

// Enhanced sample notes data
let notes = [
  {
    id: "1",
    content: "HTML is the foundation of web development",
    important: true,
    date: "2023-05-15T10:30:00Z",
    category: "Web Development"
  },
  {
    id: "2",
    content: "JavaScript is the language of the web",
    important: true,
    date: "2023-05-16T14:45:00Z",
    category: "Programming"
  },
  {
    id: "3",
    content: "RESTful APIs follow specific architectural constraints",
    important: true,
    date: "2023-05-17T09:15:00Z",
    category: "API Design"
  },
  {
    id: "4",
    content: "CSS frameworks can speed up development",
    important: false,
    date: "2023-05-18T16:20:00Z",
    category: "Frontend"
  },
  {
    id: "5",
    content: "Always validate user input on the server side",
    important: true,
    date: "2023-05-19T11:10:00Z",
    category: "Security"
  }
];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// Custom middleware for content negotiation
app.use((req, res, next) => {
  res.format({
    'application/json': () => next(),
    'text/html': () => {
      const acceptHeader = req.get('Accept');
      if (acceptHeader && acceptHeader.includes('text/html')) {
        next();
      } else {
        res.status(406).json({ error: 'Not Acceptable' });
      }
    },
    default: () => res.status(406).json({ error: 'Not Acceptable' })
  });
});

// Helper function to render HTML
const renderHTML = (title, content) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} | Notes App</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
      <style>
        :root {
          --primary: #4361ee;
          --primary-dark: #3a0ca3;
          --secondary: #3f37c9;
          --accent: #4895ef;
          --light: #f8f9fa;
          --dark: #212529;
          --success: #4cc9f0;
          --danger: #f72585;
          --warning: #f8961e;
          --gray: #6c757d;
          --light-gray: #e9ecef;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }
        
        body {
          background-color: #f5f7fa;
          color: var(--dark);
          line-height: 1.6;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        header {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          padding: 1.5rem 0;
          margin-bottom: 2rem;
          border-radius: 0 0 20px 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        h1 {
          font-size: 1.8rem;
          font-weight: 600;
        }
        
        .back-link {
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .notes-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .note-card {
          background: white;
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .note-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .note-id {
          font-size: 0.8rem;
          color: var(--gray);
          margin-bottom: 0.5rem;
        }
        
        .note-content {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        
        .note-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--light-gray);
          font-size: 0.9rem;
        }
        
        .note-category {
          display: inline-block;
          padding: 0.3rem 0.6rem;
          background-color: var(--light-gray);
          border-radius: 20px;
          font-size: 0.8rem;
          color: var(--dark);
        }
        
        .note-date {
          color: var(--gray);
        }
        
        .importance-badge {
          display: inline-block;
          padding: 0.3rem 0.6rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          background-color: transparent;
          color: var(--success);
          border: 1px solid var(--success);
        }
        
        .importance-badge.warning {
          color: var(--warning);
          border: 1px solid var(--warning);
        }
        
        .actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
        }
        
        .btn-primary {
          background-color: var(--primary);
          color: white;
        }
        
        .btn-primary:hover {
          background-color: var(--secondary);
        }
        
        .btn-danger {
          background-color: var(--danger);
          color: white;
        }
        
        .btn-danger:hover {
          background-color: #d91a66;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--gray);
          grid-column: 1 / -1;
        }
        
        .empty-state i {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        .note-detail {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .note-detail .note-content {
          font-size: 1.2rem;
          margin: 1.5rem 0;
          padding: 1rem;
          background-color: var(--light);
          border-radius: 8px;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        input[type="text"],
        textarea,
        select {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid var(--light-gray);
          border-radius: 6px;
          font-size: 1rem;
        }
        
        textarea {
          min-height: 150px;
          resize: vertical;
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        footer {
          text-align: center;
          margin-top: 3rem;
          padding: 1.5rem;
          color: var(--gray);
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          
          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .actions {
            flex-direction: column;
          }
          
          .btn {
            justify-content: center;
          }
        }
      </style>
    </head>
    <body>
      <header>
        <div class="header-content">
          <h1>${title}</h1>
          ${title !== 'All Notes' ? `<a href="/api/notes" class="back-link"><i class="fas fa-arrow-left"></i> Back to all notes</a>` : ''}
        </div>
      </header>
      
      <div class="container">
        ${content}
      </div>
      
      <footer>
        <p>Notes App &copy; ${new Date().getFullYear()} | API Version 1.0.0</p>
      </footer>
    </body>
    </html>
  `;
};

// Homepage route
app.get('/', (req, res) => {
  const content = `
    <div style="text-align: center; padding: 3rem 0;">
      <h2 style="font-size: 2rem; margin-bottom: 1.5rem;">Welcome to the Notes App</h2>
      <p style="font-size: 1.1rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
        Manage your notes with this simple and powerful application. Create, view, edit, and delete notes with ease.
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <a href="/api/notes" class="btn btn-primary" style="text-decoration: none;">
          <i class="fas fa-sticky-note"></i> View All Notes
        </a>
        <a href="/api/notes/new" class="btn btn-primary" style="text-decoration: none;">
          <i class="fas fa-plus"></i> Create New Note
        </a>
      </div>
    </div>
  `;
  
  res.send(renderHTML('Home', content));
});

// List all notes
app.get('/api/notes', (req, res) => {
  if (req.accepts('text/html')) {
    const notesContent = notes.length > 0 ? `
      <div class="notes-container">
        ${notes.map(note => `
          <div class="note-card">
            <div class="note-id">#${note.id}</div>
            <div class="note-content">${note.content}</div>
            <div class="note-meta">
              <span class="note-category">${note.category}</span>
              <span class="importance-badge ${note.important ? '' : 'warning'}">
                <i class="fas ${note.important ? 'fa-star' : 'fa-exclamation-circle'}"></i>
                ${note.important ? 'Important' : 'Normal'}
              </span>
            </div>
            <div class="note-date">
              <i class="far fa-calendar-alt"></i> ${new Date(note.date).toLocaleString()}
            </div>
            <div class="actions">
              <a href="/api/notes/${note.id}" class="btn btn-primary">
                <i class="fas fa-eye"></i> View Details
              </a>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="text-align: center; margin-top: 2rem;">
        <a href="/api/notes/new" class="btn btn-primary">
          <i class="fas fa-plus"></i> Add New Note
        </a>
      </div>
    ` : `
      <div class="empty-state">
        <i class="far fa-clipboard"></i>
        <h3>No notes found</h3>
        <p>Create your first note to get started</p>
        <a href="/api/notes/new" class="btn btn-primary" style="margin-top: 1rem;">
          <i class="fas fa-plus"></i> Create Note
        </a>
      </div>
    `;
    
    res.send(renderHTML('All Notes', notesContent));
  } else {
    res.json(notes);
  }
});

// View single note
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const note = notes.find(note => note.id === id);
  
  if (note) {
    if (req.accepts('text/html')) {
      const noteContent = `
        <div class="note-detail">
          <div class="note-id">#${note.id}</div>
          <div class="note-meta">
            <span class="note-category">${note.category}</span>
            <span class="importance-badge ${note.important ? '' : 'warning'}">
              <i class="fas ${note.important ? 'fa-star' : 'fa-exclamation-circle'}"></i>
              ${note.important ? 'Important' : 'Normal'}
            </span>
          </div>
          <div class="note-date">
            <i class="far fa-calendar-alt"></i> ${new Date(note.date).toLocaleString()}
          </div>
          <div class="note-content">${note.content}</div>
          <div class="actions">
            <a href="/api/notes/${note.id}/edit" class="btn btn-primary">
              <i class="fas fa-edit"></i> Edit Note
            </a>
            <a href="/api/notes/${note.id}/delete" class="btn btn-danger">
              <i class="fas fa-trash-alt"></i> Delete Note
            </a>
          </div>
        </div>
      `;
      
      res.send(renderHTML(`Note #${note.id}`, noteContent));
    } else {
      res.json(note);
    }
  } else {
    if (req.accepts('text/html')) {
      const notFoundContent = `
        <div class="empty-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Note not found</h3>
          <p>The requested note with ID ${id} doesn't exist</p>
          <a href="/api/notes" class="btn btn-primary" style="margin-top: 1rem;">
            <i class="fas fa-arrow-left"></i> Back to All Notes
          </a>
        </div>
      `;
      
      res.status(404).send(renderHTML('Note Not Found', notFoundContent));
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  }
});

// New note form
app.get('/api/notes/new', (req, res) => {
  const formContent = `
    <div class="note-detail">
      <h2 style="margin-bottom: 1.5rem;">Create New Note</h2>
      <form action="/api/notes" method="POST">
        <div class="form-group">
          <label for="content">Note Content</label>
          <textarea id="content" name="content" required></textarea>
        </div>
        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" name="category" required>
            <option value="">Select a category</option>
            <option value="Web Development">Web Development</option>
            <option value="Programming">Programming</option>
            <option value="API Design">API Design</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Security">Security</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <div class="checkbox-group">
            <input type="checkbox" id="important" name="important">
            <label for="important">Mark as important</label>
          </div>
        </div>
        <div class="actions">
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-save"></i> Save Note
          </button>
          <a href="/api/notes" class="btn btn-danger">
            <i class="fas fa-times"></i> Cancel
          </a>
        </div>
      </form>
    </div>
  `;
  
  res.send(renderHTML('Create New Note', formContent));
});

// Edit note form
app.get('/api/notes/:id/edit', (req, res) => {
  const id = req.params.id;
  const note = notes.find(note => note.id === id);
  
  if (note) {
    const formContent = `
      <div class="note-detail">
        <h2 style="margin-bottom: 1.5rem;">Edit Note #${note.id}</h2>
        <form action="/api/notes/${note.id}" method="POST">
          <input type="hidden" name="_method" value="PUT">
          <div class="form-group">
            <label for="content">Note Content</label>
            <textarea id="content" name="content" required>${note.content}</textarea>
          </div>
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" name="category" required>
              <option value="">Select a category</option>
              <option value="Web Development" ${note.category === 'Web Development' ? 'selected' : ''}>Web Development</option>
              <option value="Programming" ${note.category === 'Programming' ? 'selected' : ''}>Programming</option>
              <option value="API Design" ${note.category === 'API Design' ? 'selected' : ''}>API Design</option>
              <option value="Frontend" ${note.category === 'Frontend' ? 'selected' : ''}>Frontend</option>
              <option value="Backend" ${note.category === 'Backend' ? 'selected' : ''}>Backend</option>
              <option value="Security" ${note.category === 'Security' ? 'selected' : ''}>Security</option>
              <option value="Other" ${note.category === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="important" name="important" ${note.important ? 'checked' : ''}>
              <label for="important">Mark as important</label>
            </div>
          </div>
          <div class="actions">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save"></i> Update Note
            </button>
            <a href="/api/notes/${note.id}" class="btn btn-danger">
              <i class="fas fa-times"></i> Cancel
            </a>
          </div>
        </form>
      </div>
    `;
    
    res.send(renderHTML(`Edit Note #${note.id}`, formContent));
  } else {
    res.redirect('/api/notes');
  }
});

// Delete confirmation
app.get('/api/notes/:id/delete', (req, res) => {
  const id = req.params.id;
  const note = notes.find(note => note.id === id);
  
  if (note) {
    const deleteContent = `
      <div class="note-detail">
        <h2 style="margin-bottom: 1.5rem;">Delete Note #${note.id}</h2>
        <div class="note-content" style="background-color: #fff3f3; border-left: 4px solid var(--danger);">
          ${note.content}
        </div>
        <p style="margin: 1.5rem 0;">Are you sure you want to delete this note? This action cannot be undone.</p>
        <form action="/api/notes/${note.id}" method="POST" style="display: inline;">
          <input type="hidden" name="_method" value="DELETE">
          <button type="submit" class="btn btn-danger">
            <i class="fas fa-trash-alt"></i> Confirm Delete
          </button>
        </form>
        <a href="/api/notes/${note.id}" class="btn btn-primary">
          <i class="fas fa-times"></i> Cancel
        </a>
      </div>
    `;
    
    res.send(renderHTML(`Delete Note #${note.id}`, deleteContent));
  } else {
    res.redirect('/api/notes');
  }
});

// API Endpoints for CRUD operations
app.post('/api/notes', (req, res) => {
  const body = req.body;
  
  if (!body.content) {
    return res.status(400).json({ 
      error: 'content missing' 
    });
  }
  
  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
    date: new Date().toISOString(),
    category: body.category || 'Uncategorized'
  };
  
  notes = notes.concat(note);
  
  if (req.accepts('text/html')) {
    res.redirect('/api/notes');
  } else {
    res.status(201).json(note);
  }
});

app.post('/api/notes/:id', (req, res) => {
  // Method override for PUT and DELETE from HTML forms
  if (req.body._method === 'PUT') {
    return updateNote(req, res);
  } else if (req.body._method === 'DELETE') {
    return deleteNote(req, res);
  } else {
    return res.status(400).json({ error: 'Invalid request' });
  }
});

function updateNote(req, res) {
  const id = req.params.id;
  const body = req.body;
  
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }
  
  const updatedNote = {
    ...notes[noteIndex],
    content: body.content || notes[noteIndex].content,
    important: body.important !== undefined ? body.important : notes[noteIndex].important,
    category: body.category || notes[noteIndex].category
  };
  
  notes[noteIndex] = updatedNote;
  
  if (req.accepts('text/html')) {
    res.redirect(`/api/notes/${id}`);
  } else {
    res.json(updatedNote);
  }
}

function deleteNote(req, res) {
  const id = req.params.id;
  notes = notes.filter(note => note.id !== id);
  
  if (req.accepts('text/html')) {
    res.redirect('/api/notes');
  } else {
    res.status(204).end();
  }
}

// Helper function to generate IDs
function generateId() {
  return Math.floor(Math.random() * 1000000).toString();
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Homepage: http://localhost:${PORT}`);
  console.log(`Notes API: http://localhost:${PORT}/api/notes`);
});