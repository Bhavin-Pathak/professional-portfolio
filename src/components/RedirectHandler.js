import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import redirects from '../static/redirects.json';
import blogData from '../static/blog-posts.json';

export const RedirectHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Normalize pathname: remove trailing slash (except for root "/") 
        const path = location.pathname.length > 1 && location.pathname.endsWith('/')
            ? location.pathname.slice(0, -1)
            : location.pathname;

        let target = redirects[path];

        // DYNAMIC LOGIC: If target is "latest_blog", redirect to the first item in posts.
        if (target === "latest_blog") {
            const latestPost = blogData.posts[0];
            if (latestPost) {
                target = `/blog/${latestPost.id}`;
            }
        }

        if (target) {
            navigate(target, { replace: true });
        }
    }, [location.pathname, navigate]);

    // This component renders nothing – it only performs the side‑effect.
    return null;
};
