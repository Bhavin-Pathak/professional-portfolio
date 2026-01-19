import React from "react";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import seoConfig from "../static/seo-config.json";

const SEO = ({ title, description, keywords, image, url, type = "website" }) => {
    const {
        siteTitle,
        defaultDescription,
        defaultKeywords,
        siteUrl,
        defaultImage,
        twitterHandle
    } = seoConfig;

    const seoTitle = title ? `${title} | Bhavin Pathak` : siteTitle;
    const seoDescription = description || defaultDescription;
    const seoKeywords = keywords ? `${defaultKeywords}, ${keywords}` : defaultKeywords;
    const seoImage = image || defaultImage;
    const seoUrl = url ? `${siteUrl}${url}` : siteUrl;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{seoTitle}</title>
            <meta name="description" content={seoDescription} />
            <meta name="keywords" content={seoKeywords} />
            <link rel="canonical" href={seoUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDescription} />
            <meta property="og:image" content={seoImage} />
            <meta property="og:url" content={seoUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={twitterHandle} />
            <meta name="twitter:creator" content={twitterHandle} />
            <meta name="twitter:title" content={seoTitle} />
            <meta name="twitter:description" content={seoDescription} />
            <meta name="twitter:image" content={seoImage} />
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string,
    type: PropTypes.string,
};

export default SEO;
