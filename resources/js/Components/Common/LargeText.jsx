import { memo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

// A simple safe HTML sanitizer (basic, not for user-submitted data)
const basicSanitize = (html) => {
  return html
    .replace(/<script.*?>.*?<\/script>/gi, '')
    .replace(/on\w+=".*?"/gi, '')
    .replace(/javascript:/gi, '');
};

const LargeText = ({ largeText = '', uniqueID = 'text', collapsedHeight = 150 }) => {
  const [expanded, setExpanded] = useState(false);

  const sanitizedHtml = basicSanitize(largeText);

  return (
    <div>
      <div
        id={`contentBox${uniqueID}`}
        style={{
          maxHeight: expanded ? 'none' : `${collapsedHeight}px`,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
          position: 'relative',
        }}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />

      {/* Fade effect at bottom when collapsed */}
      {!expanded && (
        <div
          style={{
            position: 'relative',
            marginTop: '-2em',
            height: '2em',
            background: 'linear-gradient(to bottom, transparent, white)',
          }}
        />
      )}

      {sanitizedHtml.length > 0 && (
        <Button
          variant="outline-secondary"
          onClick={() => setExpanded(!expanded)}
          title={expanded ? "Show less" : "Show more"}
          id={`${expanded ? 'showLessTextBtn' : 'showMoreTextBtn'}${uniqueID}`}
          className="mx-2 py-1 lh-1 mt-2"
        >
          {expanded ? <BsChevronUp className="fs-6" /> : <BsChevronDown className="fs-6" />}
        </Button>
      )}
    </div>
  );
};

export default memo(LargeText);
