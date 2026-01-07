'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';


interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [inputValue, setInputValue] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]); 

  
  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsed = JSON.parse(savedTodos);
        // Validate that it's an array of todos
        if (Array.isArray(parsed)) {
          setTodos(parsed as Todo[]);
        }
      } catch (error) {
        console.error('Failed to parse todos from localStorage');
      }
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  // Toggle completed status
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 ">
      <div className="max-w-lg mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          My To-Do List
        </h1>

        <form onSubmit={addTodo} className="mb-8 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus size={20} />
            Add
          </button>
        </form>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No tasks yet! Add one above
            </p>
          ) : (
            <ul>
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />

                  <span
                    className={`flex-1 text-lg ${
                      todo.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    } transition-all`}
                  >
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {todos.length > 0 && (
          <div className="mt-6 text-center text-gray-600 ">
            <p>
              {todos.filter((t) => !t.completed).length} active,{' '}
              {todos.filter((t) => t.completed).length} completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
