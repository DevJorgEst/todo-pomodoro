import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export function TodoInput({ onAdd }) {
    const [draft, setDraft] = useState('');
    const canSubmit = draft.trim().length > 0;
    function handleSubmit(event) {
        event.preventDefault();
        if (onAdd(draft))
            setDraft('');
    }
    return (_jsxs("form", { onSubmit: handleSubmit, "aria-label": "A\u00F1adir tarea", className: "flex items-center gap-2", children: [_jsx("label", { htmlFor: "new-todo", className: "sr-only", children: "Nueva tarea" }), _jsx("input", { id: "new-todo", type: "text", value: draft, onChange: (event) => setDraft(event.target.value), placeholder: "\u00BFQu\u00E9 necesitas hacer?", autoComplete: "off", maxLength: 200, className: "min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-500/30" }), _jsx("button", { type: "submit", disabled: !canSubmit, className: "shrink-0 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:focus:ring-zinc-500", children: "A\u00F1adir" })] }));
}
