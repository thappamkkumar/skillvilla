// PageMeta.jsx
import { useEffect } from 'react';

const PageSeo = ({
  title,
  description,
  keywords
}) => {
  useEffect(() => {
    // Set the document title
    if (title) {
      document.title = title;
    }

    // Set or create meta description
    if (description) {
      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement('meta');
        descTag.name = "description";
        document.head.appendChild(descTag);
      }
      descTag.setAttribute('content', description);
    }

    // Set or create meta keywords
    if (keywords) {
      let keywordTag = document.querySelector('meta[name="keywords"]');
      if (!keywordTag) {
        keywordTag = document.createElement('meta');
        keywordTag.name = "keywords";
        document.head.appendChild(keywordTag);
      }
      keywordTag.setAttribute('content', keywords);
    }
  }, [title, description, keywords]);

  return null; // This component does not render anything
};

export default PageSeo;
