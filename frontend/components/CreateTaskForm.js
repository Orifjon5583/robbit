import React, { useState } from 'react';
import api from '../utils/api';
import { getUser } from '../utils/auth';

export default function CreateTaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('quiz');
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', ''], correct: 'A' }
  ]);
  // Block Builder State
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const user = getUser();

  const addBlock = (type) => {
    // Default params based on type
    let params = {};
    if (type === 'repeat') params = { count: 1 };
    if (type === 'move_forward') params = { steps: 1 };

    setBlocks([...blocks, { type, params, id: Date.now() }]);
  };

  const updateBlockParam = (id, key, value) => {
    setBlocks(blocks.map(b =>
      b.id === id ? { ...b, params: { ...b.params, [key]: value } } : b
    ));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.role !== 'teacher' && user?.role !== 'super_admin') {
      setError('Only teachers can create tasks');
      return;
    }

    try {
      let content = {};
      if (type === 'quiz') {
        content = { questions };
      } else if (type === 'block_test') {
        // Serialize visual blocks to JSON
        content = { blocks };
      }
      await api.post('/api/tasks', { title, type, content });
      setSuccess(true);
      setTitle('');
      setQuestions([{ text: '', options: ['', '', ''], correct: 'A' }]);
      setBlocks([]);
      setTimeout(() => setSuccess(false), 3000);
      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  return (
    <div className="create-task-form">
      <h3>Yangi Vazifa Yaratish</h3>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Vazifa muvaffaqiyatli yaratildi!</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Vazifa Nomi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="quiz">Test (Quiz)</option>
          <option value="block_test">Blok Test</option>
        </select>

        {type === 'quiz' && (
          <div className="questions">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="question-form">
                <input
                  type="text"
                  placeholder={`Savol ${qIndex + 1}`}
                  value={q.text}
                  onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                  required
                />
                {q.options.map((option, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    placeholder={`Variant ${String.fromCharCode(65 + oIndex)}`}
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    required
                  />
                ))}
                <select
                  value={q.correct}
                  onChange={(e) => handleQuestionChange(qIndex, 'correct', e.target.value)}
                >
                  <option value="A">To‘g‘ri Javob: A</option>
                  <option value="B">To‘g‘ri Javob: B</option>
                  <option value="C">To‘g‘ri Javob: C</option>
                </select>
              </div>
            ))}
            <button type="button" onClick={handleAddQuestion} className="btn-secondary">
              Savol Qo‘shish
            </button>
          </div>
        )}

        {type === 'block_test' && (
          <div className="block-builder">
            <div className="toolbar">
              <button type="button" onClick={() => addBlock('move_forward')}>+ Oldinga</button>
              <button type="button" onClick={() => addBlock('turn_left')}>+ Chapga</button>
              <button type="button" onClick={() => addBlock('turn_right')}>+ O‘ngga</button>
              <button type="button" onClick={() => addBlock('repeat')}>+ Takrorlash</button>
            </div>

            <div className="workspace-preview">
              {blocks.length === 0 && <p style={{ color: '#999', textAlign: 'center' }}>Bloklarni qo‘shing</p>}

              {blocks.map((block, index) => (
                <div key={block.id} className={`block-item ${block.type}`}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <strong>{index + 1}. {block.type === 'move_forward' ? 'Oldinga Yurish' :
                      block.type === 'turn_left' ? 'Chapga Burilish' :
                        block.type === 'turn_right' ? 'O‘ngga Burilish' : 'Takrorlash'}</strong>

                    {/* Input Parameters */}
                    {block.type === 'move_forward' && (
                      <input
                        type="number"
                        min="1"
                        value={block.params.steps}
                        onChange={(e) => updateBlockParam(block.id, 'steps', parseInt(e.target.value))}
                        style={{ width: '60px', padding: '5px', margin: 0 }}
                      />
                    )}
                    {block.type === 'repeat' && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        marta
                        <input
                          type="number"
                          min="1"
                          value={block.params.count}
                          onChange={(e) => updateBlockParam(block.id, 'count', parseInt(e.target.value))}
                          style={{ width: '60px', padding: '5px', margin: 0 }}
                        />
                      </span>
                    )}
                  </div>
                  <button type="button" onClick={() => removeBlock(block.id)} style={{ color: 'red', background: 'none', padding: 0 }}>✕</button>
                </div>
              ))}
            </div>

            <p className="hint">Tartibi: Yuqoridan pastga bajariladi.</p>
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
          Vazifani Yaratish
        </button>
      </form>
    </div>
  );
}
