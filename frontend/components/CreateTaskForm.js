import React, { useState } from 'react';
import api from '../utils/api';
import { getUser } from '../utils/auth';

export default function CreateTaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('quiz');
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', ''], correct: 'A' }
  ]);
  const [blockContent, setBlockContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const user = getUser();

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', ''], correct: 'A' }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
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
        try {
          content = JSON.parse(blockContent);
        } catch (e) {
          setError('Invalid JSON for Block Test content');
          return;
        }
      }
      await api.post('/tasks', { title, type, content });
      setSuccess(true);
      setTitle('');
      setQuestions([{ text: '', options: ['', '', ''], correct: 'A' }]);
      setTimeout(() => setSuccess(false), 3000);
      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  return (
    <div className="create-task-form">
      <h3>Create New Task</h3>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Task created successfully!</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="quiz">Quiz</option>
          <option value="block_test">Block Test</option>
        </select>

        {type === 'quiz' && (
          <div className="questions">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="question-form">
                <input
                  type="text"
                  placeholder={`Question ${qIndex + 1}`}
                  value={q.text}
                  onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                  required
                />
                {q.options.map((option, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    required
                  />
                ))}
                <select
                  value={q.correct}
                  onChange={(e) => handleQuestionChange(qIndex, 'correct', e.target.value)}
                >
                  <option value="A">Correct: A</option>
                  <option value="B">Correct: B</option>
                  <option value="C">Correct: C</option>
                </select>
              </div>
            ))}
            <button type="button" onClick={handleAddQuestion} className="btn-secondary">
              Add Question
            </button>
          </div>
        )}

        {type === 'block_test' && (
          <div className="block-test-config">
            <p>Define Block Test JSON Structure:</p>
            <textarea
              placeholder='{"blocks": [{"type": "move_forward"}, ...]}'
              value={blockContent}
              onChange={(e) => setBlockContent(e.target.value)}
              name="blockContent"
              rows={10}
              style={{ width: '100%' }}
            />
            <p className="hint">Enter valid JSON for the Blockly configuration.</p>
          </div>
        )}

        <button type="submit" className="btn-primary">
          Create Task
        </button>
      </form>
    </div>
  );
}
