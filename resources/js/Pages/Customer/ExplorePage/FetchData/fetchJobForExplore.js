 import serverConnection from '../../../../CustomHook/serverConnection';  
 import {updateJobState} from '../../../../StoreWrapper/Slice/JobSlice';
import {updateExploreJobFilterState} from '../../../../StoreWrapper/Slice/ExploreJobFilterSlice';

const fetchJobForExplore = async(setLoading, cursor, authToken, dispatch, searchInput, jobFilter=null, isJobLocationsEmpty) =>
{
	
	if(authToken == null) return;
	try
		{
			setLoading(true);
			
			let requestData = { };
			let url = `/explore/job?cursor=${cursor}`; 
			 
			 //add if  search input  is not empty  
			 if(searchInput != '')
			 {
				 requestData.searchInput = searchInput;
			 }
			 
			 //add if job location is empty to fetch jon locations
			 if(isJobLocationsEmpty)
			 {
				 requestData.isJobLocationsEmpty = isJobLocationsEmpty;
			 }
			 // Add jobFilter properties to requestData based on conditions
			 if(jobFilter != null)
			 {
        if (
            typeof jobFilter.min_salary === 'number' &&
            jobFilter.min_salary > 0
        ) {
            requestData.min_salary = jobFilter.min_salary;
        }

        if (
            typeof jobFilter.max_salary === 'number' &&
            jobFilter.max_salary > 0
        ) {
            requestData.max_salary = jobFilter.max_salary;
        }

        if (
            jobFilter.job_location &&
            jobFilter.job_location.trim() !== ''
        ) {
            requestData.job_location = jobFilter.job_location;
        }

        if (
            jobFilter.employment_type &&
            jobFilter.employment_type.trim() !== ''
        ) {
            requestData.employment_type = jobFilter.employment_type;
        }

        if (
            jobFilter.work_from_home !=  null &&
            jobFilter.work_from_home == true
        ) {
            requestData.work_from_home = jobFilter.work_from_home;
        } 
			 } 
			  
			
			//call the function fetch  data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
		 //console.log(data);
			if(data != null && data.status == true )
			{
					if(data.jobLocations != null && data.jobLocations.length != 0 )
					{
					dispatch(updateExploreJobFilterState({type : 'SetLocations', jobLocations: data.jobLocations}));
					} 
					if(data.jobList.data.length != 0 )
					{
					dispatch(updateJobState({type : 'SetJob', jobList: data.jobList.data}));
					} 
					dispatch(updateJobState({type : 'SetCursor', cursor: data.jobList.next_cursor})); 
					dispatch(updateJobState({type : 'SetHasMore', hasMore: data.jobList.next_cursor != null})); 
				  
			}
		}
		catch(error)
		{
			 //console.log(error);
			setLoading(false);
		}
		finally{setLoading(false);}
}; 
export default fetchJobForExplore;