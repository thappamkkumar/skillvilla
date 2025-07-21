import {memo} from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const CommunityActionButton =  ({ 
    community, 
    submitting, 
    handleJoinCommunity, 
    handleLeaveCommunity, 
    handleRequestToJoin,
		size = 'sm'
}) => {
	
	const { id, has_joined, privacy, requests   } = community;
	
    if (has_joined) {
        return (
            <Button 
                variant="danger" 
                size={size}
                onClick={handleLeaveCommunity}
                id={`leaveCommunityBTN${id}`}
                title="Leave Community" 
                disabled={submitting}
            >
                {submitting ? <Spinner size="sm" animation="border" /> : 'Leave'}
            </Button>
        );
    }

    if (has_joined === false) {
        if (privacy === 'public') {
            return (
                <Button 
                    variant="outline-dark" 
                    size={size}
                    onClick={handleJoinCommunity}
                    id={`joinCommunityBTN${id}`}
                    title="Join Community" 
										className="border border-2 border-dark"
                    disabled={submitting}
                >
                    {submitting ? <Spinner size="sm" animation="border" /> : 'Join'}
                </Button>
            );
        }

				if (privacy !== null) {
					const hasPendingRequest = requests?.length > 0;
					const requestStatus = hasPendingRequest ? requests[0]?.status : null;
					const isRejected = requestStatus === 'rejected';

					return (
							<Button 
									variant={hasPendingRequest ? (isRejected ? "secondary" : "danger") : "outline-dark"} 
									 size={size}
									onClick={!isRejected ? handleRequestToJoin : undefined}
									id={`requestCommunityBTN${id}`}
									title={hasPendingRequest ? (isRejected ? "Request Rejected" : "Cancel Request") : "Request to Join"}
									  
									 className={hasPendingRequest ? (isRejected ? " " : " ") : "border border-2 border-dark"} 
									disabled={submitting || isRejected} 
							>
									{submitting ? <Spinner size="sm" animation="border" /> : 
									hasPendingRequest ? (isRejected ? 'Rejected' : 'Cancel') : 'Request'}
							</Button>
					);
			}

    }

    return null;
};

export default memo(CommunityActionButton);
