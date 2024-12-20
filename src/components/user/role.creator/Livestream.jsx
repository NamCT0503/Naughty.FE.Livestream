import Grid from "@mui/material/Grid2";
import { Button, List, ListItem, ListItemText } from "@mui/material";
import "../../../styles/css/creator/livestream.css";
import { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import webcasterConfig from "../../../config/webcaster.config";
import { sendReq, sendStreamReq, timeClockStream } from "../../../service/service.api";
import { API_Nanostream, API_SERVER, DOMAIN_SERVER } from "../../../router/router.server";
import SettingStreamJSX from "./components_2nd/stream/SettingStream";
import DiaLogInitstream from "./components_2nd/stream/Dialog.InitStream";
import { NanostreamConfig } from "../../../config/nanostream.config";

const mic_on = <i className="fa-solid fa-microphone"></i>;
const mic_off = <i className="fa-solid fa-microphone-slash"></i>;
const cam_on = <i className="fa-solid fa-video"></i>;
const cam_off = <i className="fa-solid fa-video-slash"></i>;
const setting = <i className="fa-solid fa-gear"></i>;

const url_infoStream = API_SERVER.GET_STREAM_BY_ID;

const Livestream = () => {
    let client;

    const [currentTheme, setCurrentTheme] = useState();
    const [displayComponent, setDisplayComponent] = useState('flex');
    const [iconMic, setIconMic] = useState(mic_on);
    const [iconCam, setIconCam] = useState(cam_on);
    const [streamVideo, setStreamVideo] = useState();
    const [streamName, setStreamName] = useState();
    const [streamId, setStreamId] = useState();
    const [recordStreamId, setRecordStreamId] = useState();
    const [infoStream, setInfoStream] = useState();
    const [timeLivestream, setTimeLivestream] = useState();
    const [isShowStream, setIsShowStream] = useState(true); // Hiển thị khung livestream
    const [openSetting, setOpenSetting] = useState(false);
    const [openInitStreamDialog, setOpenInitStreamDialog] = useState(false);
    const [isStartStream, setIsStartStream] = useState(true);


    // Tạo kết nối ban đầu cho peer
    const configWebRTC = {
        iceServer: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    };
    const videoRef = useRef(null);
    const peerConnection = new RTCPeerConnection(configWebRTC);

    // Cài đặt script webcaster nanostream.
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/src/nanostream/webcaster-main/dist/nanostream.webcaster.js';
        script.async = true;
        script.onload = () => {
            console.log('WebcasterApiV6 loaded:', window.WebcasterApiV6);
        };
        script.onerror = () => {
            console.error('Failed to load WebcasterApiV6');
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Cập nhật giao diện dựa trên màu sắc hệ thống của người dùng
    useEffect(() => {
        const observer = new MutationObserver(() => {
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            setCurrentTheme(theme);
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if(recordStreamId){
            const url = url_infoStream.replace(':streamid', recordStreamId);
            const fetcher = async (url) => {
                try {
                    const res = await sendReq(url, { method: "GET"});
                    const dataRes = await res.json();
                    if(res.ok){
                        return setInfoStream(dataRes);
                    }
                    return alert(dataRes.message? dataRes.message: "Lỗi quá trình lấy thông tin stream!");
                } catch (error) {
                    console.error(error);
                }
            }

            fetcher(url);
        } else {
            setIsShowStream(true);
        }
    }, [recordStreamId]);

    useEffect(() => {
        if(infoStream){
            const interval = setInterval(() => {
                setTimeLivestream(timeClockStream(infoStream.start_time));
            }, 1000);
            console.log('invertal: ', interval)
            return () => clearInterval(interval);
        }
    }, [infoStream]);

    const handleClickSetting = () => {
        setOpenSetting(!openSetting);
    }

    const handleStartStream = async () => {
        try {
            if(!streamName) return alert('Stream chưa được khởi tạo!');

            const sdpOffer = await createSDPOffer();
            const res = await fetch(API_Nanostream.START_STREAM.replaceAll(':streamName', streamName), {
                method: "POST",
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: `${sdpOffer}`
            });

            if(res.ok){
                const dataRes = await res.text();
                console.log('res startStream: ', dataRes);

                await peerConnection.setRemoteDescription(new RTCSessionDescription({
                    type: 'answer',
                    sdp: dataRes
                }));
                setIsStartStream(false);
                return alert('Livestream đã bắt đầu!');
            }
            return alert('Lỗi quá trình bắt đầu livestream!');
        } catch (error) {
            console.error(error);
        }
    }

    const createSDPOffer = async () => {
        if(!streamVideo) return alert('Stream chưa được khởi tạo!');

        streamVideo.getTracks().forEach(tracks => {
            peerConnection.addTrack(tracks, streamVideo)
        });

        // Tạo SDP Offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Lấy SDP Offer dưới dạng chuỗi
        return offer.sdp;
    }

    const handleStopLivestream = async () => {
        try {
            if(!streamId) return alert('Stream chưa được khởi tạo!');

            const url = API_Nanostream.STOP_STREAM.replace(':id', streamId);
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'X-BINTU-APIKEY': NanostreamConfig.API_KEY
                }
            });
            if(res.ok){
                const url_stopStreamDB = API_SERVER.UPDATE_STREAM;
                const resDB = await sendReq(url_stopStreamDB, {
                    method: "PUT",
                    body: JSON.stringify({ 
                        id: recordStreamId,
                        end_time: new Date()
                    })
                });
                const dataResDB = await resDB.json();
                if(resDB.ok){
                    setStreamName('');
                    setStreamId('');
                    setIsStartStream(true);
                    setDisplayComponent('flex');
                    setIsShowStream(true);

                    if(streamVideo){
                        streamVideo.getTracks().forEach(tracks => tracks.stop());
                        if(videoRef.current){
                            videoRef.current.srcObject = null
                        }
                    }

                    return alert('Đã dừng livestream!');
                }
                return alert(dataResDB.message? dataResDB.message: "Lỗi quá trình dừng livestream!");
            }
            return alert('Lỗi quá trình dừng stream!');
        } catch (error) {
            console.error(error);
        }
    }

    const toggleMedia = (isCamera) => {
        if(!streamVideo){
            return alert('Chưa cấp quyền truy cập camera/mic!');
        }

        // Phần tắt cam chưa hoạt động như mong đợi do phần xử lý track video của webrtc.
        if(isCamera){
            const videoTracks = streamVideo.getVideoTracks();
            videoTracks.forEach((track) => {
                console.log('track video: ', track)
                if (track.enabled) {
                    // Tắt camera: Dừng track hiện tại và thêm track trống
                    track.stop();
    
                    // Tạo track trống
                    const emptyCanvas = document.createElement('canvas');
                    emptyCanvas.width = 640;
                    emptyCanvas.height = 480;
                    const emptyStream = emptyCanvas.captureStream();
                    const emptyTrack = emptyStream.getVideoTracks()[0];
    
                    updatePeerConnectionTrack(track, emptyTrack);

                    // Thay thế track hiện tại bằng track trống
                    streamVideo.removeTrack(track);
                    streamVideo.addTrack(emptyTrack);
                } else {
                    // Bật lại camera: Lấy track mới từ thiết bị
                    navigator.mediaDevices.getUserMedia({ video: true }).then((newStream) => {
                        const newTrack = newStream.getVideoTracks()[0];
    
                        // Thay thế track trống bằng track mới
                        streamVideo.getTracks().forEach((t) => {
                            if (t.readyState === 'ended') {
                                streamVideo.removeTrack(t);
                            }
                        });
                        streamVideo.addTrack(newTrack);
                    });
                }
            });

            setIconCam(icon => icon===cam_on? cam_off: cam_on);
        } else {
            const audioTracks = streamVideo.getAudioTracks();
            audioTracks.forEach(tracks => {
                tracks.enabled = !tracks.enabled
            });

            setIconMic(icon => icon===mic_on? mic_off: mic_on);
        }
    }

    const updatePeerConnectionTrack = (oldTrack, newTrack) => {
        if(!streamVideo || !peerConnection) return alert('Track Media chưa sẵn sàng!');

        const sender = peerConnection.getSenders().find(s => s.track===oldTrack);
        if(sender){
            // Thay thế track cũ bằng track mới
            sender.replaceTrack(newTrack);
            console.log('Track updated in peer connection!');
        } else {
            // Thêm track mới nếu không tìm thấy
            peerConnection.addTrack(newTrack, streamVideo);
            console.log('New track added to peer connection!');
        }
    }

    console.log('info: ', infoStream);
    // console.log('stream id record: ', recordStreamId);
    console.log('stream video: ', streamVideo)
    return(
        <>
            <Grid 
                className="wrap-container init-stream" 
                sx={{ display: displayComponent}}
            >
                <div 
                    className="container init-stream"
                    style={{
                        boxShadow: currentTheme==='light'? 'rgba(0, 0, 0, 0.16) 0px 1px 4px': 'white 0px 1px 4px'
                    }}
                >
                    <h3>Khởi tạo stream của riêng bạn</h3>
                    <DotLottieReact src="https://lottie.host/ff8cb3e2-9a97-4eb4-aa54-26d9f26ce806/Yobx0m11Zp.lottie" loop autoplay />
                    <Button variant="contained" onClick={() => setOpenInitStreamDialog(true)}>Khởi tạo stream</Button>
                    <DiaLogInitstream 
                        open={openInitStreamDialog}
                        onClose={() => setOpenInitStreamDialog(false)}
                        stream={{ streamName, streamId, recordStreamId, streamVideo }}
                        setStream={{ setStreamName, setStreamId, setRecordStreamId, setStreamVideo }}
                        display={{ displayComponent, isShowStream }}
                        setDisplay={{ setDisplayComponent, setIsShowStream }}
                        videoRef={ videoRef }
                    />
                </div>
            </Grid>

            <Grid 
                className="wrap-container livestream" 
                sx={{ display: isShowStream? 'none !important': 'flex' }}
            >
                <div className="container-main livestream">
                    <video className="frame-video-stream" ref={videoRef} autoPlay playsInline></video>
                    <div className="area-btn-options">
                        <div className="btn-media">
                            <button onClick={() => toggleMedia(false)}>{iconMic}</button>
                            <button onClick={() => toggleMedia(true)}>{iconCam}</button>
                        </div>
                        <div className="btn-start-live">
                            <Button variant="contained" onClick={isStartStream? handleStartStream: handleStopLivestream}>
                                {isStartStream? 'Bắt đầu live': 'Dừng live'}
                            </Button>
                        </div>
                        <div className="btn-setting" onClick={handleClickSetting}>
                            <button>{setting}</button>
                        </div>
                        <SettingStreamJSX 
                            open={openSetting} 
                            onClose={() => setOpenSetting(false)}
                            currentTheme={currentTheme}
                            stream={{streamName, streamId}}
                        />
                    </div>
                </div>
                <div className="container-info livestream">
                    <h3>Thông tin stream</h3>
                    <List>
                        <ListItem key={1}><ListItemText primary={`Tiêu đề live: ${infoStream?.title}`} /></ListItem>
                        <ListItem key={2}>
                            <ListItemText primary='Ảnh bìa' />
                            <img 
                                src={
                                    infoStream?.thumbnails.img.startsWith('http')?
                                    infoStream?.thumbnails.img:
                                    `${DOMAIN_SERVER}/${infoStream?.thumbnails.img}`
                                } 
                                alt="" 
                                style={{ maxHeight: '100px'}}
                            />
                        </ListItem>
                        <ListItem key={3}>
                            <ListItemText primary={`Thời lượng live: ${timeLivestream}`}></ListItemText>
                        </ListItem>
                    </List>
                </div>
            </Grid>
        </>
    )
}

export default Livestream;