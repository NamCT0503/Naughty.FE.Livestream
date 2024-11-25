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


    // Tạo kết nối ban đầu cho peer
    const configWebRTC = {
        iceServer: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    };
    const videoRef = useRef(null);
    const peerConnection = new RTCPeerConnection(configWebRTC);

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

    console.log('info: ', infoStream);
    console.log('stream id record: ', recordStreamId);
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
                        stream={{ streamName, streamId, recordStreamId }}
                        setStream={{ setStreamName, setStreamId, setRecordStreamId }}
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
                            <button>{iconMic}</button>
                            <button>{iconCam}</button>
                        </div>
                        <div className="btn-start-live">
                            <Button variant="contained">Bắt đầu live</Button>
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