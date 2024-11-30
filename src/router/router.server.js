export const DOMAIN_SERVER = 'http://localhost:5000';

export const API_SERVER = {
    DEFAULT_AVATAR: `${DOMAIN_SERVER}/1731407107915-642157206.jpeg`,

    // ===== Both =====
    GET_PROFILE: `${DOMAIN_SERVER}/api/auth/get-profile`,

    // ===== Admin =====
    //Auth
    ADMIN_SIGNIN: `${DOMAIN_SERVER}/api/admin/signin`,
    ADMIN_CREATENEWACC: `${DOMAIN_SERVER}/api/admin/create-new-admin`,

    // ===== User =====
    //Auth
    USER_SIGNIN: `${DOMAIN_SERVER}/api/user/signin`,
    USER_SIGNUP: `${DOMAIN_SERVER}/api/user/signup`,
    //Stream
    GETLIST_STREAM_MOST_VIEW: `${DOMAIN_SERVER}/api/user/stream/top-most-view`,
    GETLIST_TOP_CREATOR_HOT: `${DOMAIN_SERVER}/api/user/stream/top-creator-hot/:date`,
    GET_STREAM_URL_BY_CREATORID: `${DOMAIN_SERVER}/api/user/stream/get-stream-url/:creator_id`,
    //Follower
    GET_INFO_LIST_STREAMING: `${DOMAIN_SERVER}/api/user/follower/get-info-list-stream`,

    // === Creator ===
    //Stream
    GET_ALL_STREAM_OWNER: `${DOMAIN_SERVER}/api/user/stream/get-all-streams-by/:creator_id/:page`,
    GET_STREAM_BY_ID: `${DOMAIN_SERVER}/api/user/stream/get-stream/:streamid`,
    CREATE_STREAM: `${DOMAIN_SERVER}/api/user/stream/create`,
    UPDATE_STREAM: `${DOMAIN_SERVER}/api/user/stream/update`,
    //Thumbnail
    GETLIST_THUMBNAIL: `${DOMAIN_SERVER}/api/user/thumbnail/get-list`,
    CREATE_THUMBNAIL: `${DOMAIN_SERVER}/api/user/thumbnail/create`
}

export const API_Nanostream = {
    // START_STREAM: 'https://bintu-webrtc.nanocosmos.de/p/webrtc?stream_name=:streamName&stream_url=rtmp://:streamName.bintu-vtrans.nanocosmos.de/live&audio_bitrate=64000',
    START_STREAM: 'https://bintu-webrtc.nanocosmos.de/p/webrtc?stream_name=:streamName&stream_url=rtmp://bintu-stream.nanocosmos.de:1935/live&audio_bitrate=64000',

    STREAM_SINGLE: 'https://demo.nanocosmos.de/nanoplayer/embed/1.3.3/nanoplayer.html?entry.rtmp.streamname=',
    STREAM_GROUP: 'https://demo.nanocosmos.de/nanoplayer/embed/1.3.3/nanoplayer.html?group.id=',

    STREAM_SINGLE_INFO: 'https://bintu.nanocosmos.de/stream/:id',
    STREAM_GROUP_INFO: 'https://bintu.nanocosmos.de/stream/:id/group',
    CREATE_STREAM: 'https://bintu.nanocosmos.de/stream',
    STOP_STREAM: 'https://bintu.nanocosmos.de/stream/:id/stop',
    DELETE_STREAM: 'https://bintu.nanocosmos.de/stream/:id',

    CHANGE_TAGS: 'https://bintu.nanocosmos.de/stream/:id/tag'
}