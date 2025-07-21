import { memo } from 'react'; 
 
import LargeText from '../../Common/LargeText';

const UserBidOnFreelance = ( 
{ 
	 	bids, 
}) => {
	if(!bids)
	{
		return;
	}
	 

 
 
   return (
    <div className="pt-3 px-2">
				 
				{/*cover letter*/}
				<strong>Cover Letter </strong>
        <p className="px-1 "> 
					<LargeText largeText={ bids.cover_letter} />
            
          
        </p>
				
				{/*amount or payment*/}
        <p className="m-0">
          <strong>Amount :-</strong>
          <span className="ps-2 ">
           ${ bids.bid_amount}  
          </span>
          
					<span className="px-2">
					/
					</span>
					
					<span className=" ">
						{bids.payment_type == 'hourly' && 'Hourly'}
						{bids.payment_type == 'fixed' && 'Fixed'}
						{bids.payment_type == 'negotiable' && 'Negotiable'}
					
					</span>
        </p>
				
				{/*delivery time*/}
        <p className="m-0">
          <strong>Delivery Time :-</strong>
          <span className="ps-2 ">
            { bids.delivery_time}
          </span>
        </p>
				{/*bid status*/}
        <p className="m-0">
          <strong>Bid Status :-</strong>
          <strong className={` ps-2
								${bids.status === 'accepted' && 'text-success'}
								${bids.status === 'submitted' && 'text-primary'}
								${bids.status === 'in_review' && 'text-warning'}
								${bids.status === 'shortlisted' && 'text-info'}
								${bids.status === 'rejected' && 'text-danger'}
							`}>
             
						 
							{bids.status === 'accepted' && ' Accepted'}
							{bids.status === 'submitted' && ' Submitted'}
							{bids.status === 'in_review' && ' In Review'}
							{bids.status === 'shortlisted' && ' Shortlisted'}
							{bids.status === 'rejected' && ' Rejected'}
						 
          </strong>
        </p>
				
		
		</div>
  );
};

export default memo(UserBidOnFreelance);
