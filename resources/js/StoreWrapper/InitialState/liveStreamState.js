//state for live stream

const liveStreamState = {
	liveId: null,
	liveType: null,
	startedAt: null,
	liveStatus: 'idle',
	totalViewer: null,
	
	liveSession: null, //{id, title, description,etc}
	liveDetail: null, //if(type prof. stream) && {id, title, description,etc}
	
	publisherHold: false,	
	publisher: null,
	
	viewerList: [],//[{id,name,user id, image, can_msg, can_live, is_live},{}]
	currentViewer: null, //{id,name,user id, image,...}
	
  isMuted: false,
  cameraOn: true,
  speakerOff: false, 
	
	micId:null,
	speakerId:null,
	cameraId:null,
	
	isConnecting:false,
	
	error: null,
	
	joinedRequest: [],
};

export default liveStreamState;
