"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Check, X } from "lucide-react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // 从localStorage加载数据
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // 保存到localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        title: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTodos([todo, ...todos]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            TodoMaster
          </h1>
          <p className="text-gray-600">简洁高效的待办事项管理</p>
        </div>

        {/* Add Todo */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              placeholder="添加新任务..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTodo}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              添加
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{todos.length}</div>
            <div className="text-sm text-gray-500">总任务</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{activeCount}</div>
            <div className="text-sm text-gray-500">进行中</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-gray-500">已完成</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl shadow p-2">
          {(["all", "active", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                filter === f
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f === "all" ? "全部" : f === "active" ? "进行中" : "已完成"}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">暂无任务</p>
              <p className="text-sm mt-2">添加一个新任务开始吧！</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white rounded-xl shadow hover:shadow-md transition-all duration-200 p-4 flex items-center gap-4 group"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    todo.completed
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300 hover:border-blue-500"
                  }`}
                >
                  {todo.completed && <Check size={16} className="text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-lg transition-all duration-200 ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(todo.createdAt).toLocaleString("zh-CN")}
                  </p>
                </div>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Clear Completed */}
        {completedCount > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={clearCompleted}
              className="px-6 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
            >
              清除已完成任务 ({completedCount})
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-400">
          <p>由软件开发团队模板创建 · 2026</p>
        </div>
      </div>
    </div>
  );
}
