import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { TODO_FILTER_LABELS, TODO_FILTERS } from '../../types/todo';
const FILTER_COUNTS = {
    all: 'total',
    active: 'active',
    completed: 'completed',
};
export function TodoFilters({ filter, counts, onChange }) {
    return (_jsx("div", { role: "group", "aria-label": "Filtrar tareas", className: "flex flex-wrap gap-2", children: TODO_FILTERS.map((option) => {
            const isActive = option === filter;
            return (_jsxs("button", { type: "button", onClick: () => onChange(option), "aria-pressed": isActive, className: `rounded-full px-3 py-1 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 ${isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'}`, children: [TODO_FILTER_LABELS[option], ' ', _jsxs("span", { className: isActive
                            ? 'text-zinc-300 dark:text-zinc-600'
                            : 'text-zinc-400 dark:text-zinc-500', children: ["(", counts[FILTER_COUNTS[option]], ")"] })] }, option));
        }) }));
}
