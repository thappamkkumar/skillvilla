// NoInterestResultsMessage.js
import {memo} from 'react';

const NoInterestResultsMessage = ({ section  }) => {
   
     
       return (
                <div className="px-2 px-sm-3 px-md-4 px-lg-5 py-4 text-center">
                    <h4>We couldn't find any {section} related to your interests.</h4>
                    <p className="text-muted">
                        Try searching for something specific or explore other categories!
                    </p>
                </div>
            );
     
};

export default memo(NoInterestResultsMessage);
