import { useState, useEffect } from "react";

export default function VisitorCounter() {
    const [count, setCount] = useState(null);

    useEffect(() => {
        const namespace = "bhaviinpathak_portfolio";
        const key = "total_visits";

        const SESSION_KEY = "visitor_counted";
        const alreadyCounted = sessionStorage.getItem(SESSION_KEY);

        if (alreadyCounted) {
            fetch(`https://api.counterapi.dev/v1/${namespace}/${key}`)
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
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs">
            <span className={`flex h-1.5 w-1.5 rounded-full transition-colors ${count === null ? "bg-gray-600" : "bg-blue-400 animate-pulse"}`} />
            <span className="text-gray-400">
                Total Visitors: <span className="text-blue-400 font-bold tracking-wider">{count === null ? "•••" : count.toLocaleString()}</span>
            </span>
        </div>
    );
}
