import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { TodoItem } from './TodoItem';
export function TodoList({ todos, filterLabel, activeTaskId, onToggle, onRemove, onSelectTask, }) {
    if (todos.length === 0) {
        return (_jsxs("p", { className: "px-4 py-10 text-center text-sm text-zinc-400 dark:text-zinc-500", children: ["No hay tareas ", filterLabel.toLowerCase(), "."] }));
    }
    return (_jsx("ul", { className: "divide-y divide-zinc-100 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-800", children: todos.map((todo) => (_jsx(TodoItem, { todo: todo, isActiveTask: todo.id === activeTaskId, onToggle: onToggle, onRemove: onRemove, onSelect: onSelectTask }, todo.id))) }));
}
