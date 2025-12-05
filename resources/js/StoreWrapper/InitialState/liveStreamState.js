//state for live stream

const liveStreamState = {
	liveId: null,
	liveType: null,
	startedAt: null,
	liveStatus: 'idle',
	isEnd: false,
	totalViewer: 0,
	
	liveSession: null, //{id, title, description,etc}
	liveDetail: null, //if(type prof. stream) && {id, title, description,etc}
	
	publisherHold: false,	
	publisher: null,
	
	publisherId: null,
	viewerList: [],//[{id,name,user id, image, can_msg, can_live, is_live},{}]
	currentViewer: null, //{id,name,user id, image,...}
	
	joinedRequest: [],
	chatMessages: [],
	
  isMuted: false,
  cameraOn: true,
  speakerOff: false, 
	
	micId:null,
	speakerId:null,
	cameraId:null,
	
	cameraListShow: false,
	micListShow: false,
	speakerListShow: false,
	reactionListShow: false,
	
	isConnecting:false,  
	error: null, 
	 
};

export default liveStreamState;
