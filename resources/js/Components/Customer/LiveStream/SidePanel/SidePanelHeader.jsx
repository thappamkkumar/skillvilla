import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';

const SidePanelHeader = ({ 
 selectedPanel,
 setSelectedPanel=()=>{},

 }) => {
  const liveStreamData = useSelector((state) => state.liveStreamData);
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user));

  const isPublisher = useMemo(()=>{ return logedUserData?.id === liveStreamData?.publisher?.id },[logedUserData, liveStreamData.publisher]);
  const isCurrentViewer = useMemo(()=>{ return logedUserData?.id === liveStreamData?.currentViewer?.viewer_id  },[logedUserData, liveStreamData.currentViewer]);
  const isSharing = useMemo(()=>{ return liveStreamData?.currentViewer?.is_sharing  },[liveStreamData.currentViewer]);

  const buttons = [];

  if (isPublisher) { 
    buttons.push({ title: 'Chat', code: 'chat' });
    buttons.push({ title: 'Viewer', code: 'viewer' });
   // buttons.push({ title: 'Request', code: 'request' });
   // buttons.push({ title: 'Member', code: 'member' });
  }

  if (isCurrentViewer) {
    if (isSharing) {
      buttons.push({ title: 'Chat', code: 'chat' });
      buttons.push({ title: 'Member', code: 'member' });
    } else {
      buttons.push({ title: 'Chat', code: 'chat' });
    }
  }

  // Remove duplicates based on code
  const uniqueButtons = Array.from(new Map(buttons.map(b => [b.code, b])).values());

  return (
    <div className="w-100 h-auto p-2 text-white border-bottom border-2 border-secondary d-flex justify-content-end gap-2">
      {uniqueButtons.map(({ title, code }) => (
        <Button
          key={code}
          variant="outline-secondary"
          id={`${code}PaneltoggleBtn`}
          title={title}
					className={`${selectedPanel == code ? 'bg-secondary text-white' : 'text-light'} bg-opacity-75 border-0 `}
          onClick={() => setSelectedPanel(code)} // call function with code
        >
          {title}
        </Button>
      ))}
    </div>
  );
};

export default memo(SidePanelHeader);
