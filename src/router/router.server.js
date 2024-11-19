export const DOMAIN_SERVER = 'http://localhost:5000';

export const API_SERVER = {
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

    // === Creator ===
    //Stream
    GET_ALL_STREAM_OWNER: `${DOMAIN_SERVER}/api/user/stream/get-all-streams-by/:creator_id/:page`
}

export const API_Nanostream = {
    START_STREAM: 'https://bintu-webrtc.nanocosmos.de/p/webrtc?stream_name=:streamName&stream_url=rtmp://:streamName.bintu-vtrans.nanocosmos.de/live&audio_bitrate=64000',

    STREAM_SINGLE: 'https://demo.nanocosmos.de/nanoplayer/embed/1.3.3/nanoplayer.html?entry.rtmp.streamname=',
    STREAM_GROUP: 'https://demo.nanocosmos.de/nanoplayer/embed/1.3.3/nanoplayer.html?group.id=',

    STREAM_SINGLE_INFO: 'https://bintu.nanocosmos.de/stream/:id',
    STREAM_GROUP_INFO: 'https://bintu.nanocosmos.de/stream/:id/group',
    CREATE_STREAM: 'https://bintu.nanocosmos.de/stream',
    STOP_STREAM: 'https://bintu.nanocosmos.de/stream/:id/stop',
    DELETE_STREAM: 'https://bintu.nanocosmos.de/stream/:id'
}