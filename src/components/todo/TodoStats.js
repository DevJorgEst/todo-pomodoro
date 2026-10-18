import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function TodoStats({ counts, onClearCompleted }) {
    return (_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("p", { className: "text-xs text-zinc-500 dark:text-zinc-400", "aria-live": "polite", children: counts.active === 0
                    ? '¡Todo completado! 🎉'
                    : `${counts.active} de ${counts.total} ${counts.active === 1 ? 'tarea pendiente' : 'tareas pendientes'}` }), _jsxs("button", { type: "button", onClick: onClearCompleted, disabled: counts.completed === 0, className: "text-xs text-zinc-500 underline-offset-2 transition hover:text-zinc-900 hover:underline focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40 dark:text-zinc-400 dark:hover:text-zinc-100 dark:focus:ring-zinc-500", children: ["Limpiar completadas (", counts.completed, ")"] })] }));
}
