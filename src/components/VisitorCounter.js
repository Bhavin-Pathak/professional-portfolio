import { useState, useEffect } from "react";

export default function VisitorCounter() {
    const [count, setCount] = useState(null);

    useEffect(() => {
        const namespace = "bhaviinpathak_portfolio";
        const key = "total_visits";

        const SESSION_KEY = "visitor_counted";
        const alreadyCounted = sessionStorage.getItem(SESSION_KEY);

        if (alreadyCounted) {
            fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.count) setCount(data.count);
                })
                .catch(err => console.error("CounterAPI Error:", err));
        } else {
            fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.count) {
                        setCount(data.count);
                        sessionStorage.setItem(SESSION_KEY, "true");
                    }
                })
                .catch(err => console.error("CounterAPI Error:", err));
        }
    }, []);

    return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-[10px] md:text-xs">
            <span className={`flex h-1.5 w-1.5 rounded-full transition-colors ${count === null ? "bg-slate-400 dark:bg-gray-600" : "bg-blue-600 dark:bg-blue-400 animate-pulse"}`} />
            <span className="text-slate-500 dark:text-gray-400 font-medium">
                Total Visitors: <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider">{count === null ? "•••" : count.toLocaleString()}</span>
            </span>
        </div>
    );
}
