import Grid from "@mui/material/Grid2";
import { Button } from "@mui/material";
import "../../../styles/css/creator/livestream.css";
import { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import webcasterConfig from "../../../config/webcaster.config";
import { sendStreamReq } from "../../../service/service.api";
import { API_Nanostream } from "../../../router/router.server";
import SettingStreamJSX from "./components_2nd/stream/SettingStream";

const mic_on = <i className="fa-solid fa-microphone"></i>;
const mic_off = <i className="fa-solid fa-microphone-slash"></i>;
const cam_on = <i className="fa-solid fa-video"></i>;
const cam_off = <i className="fa-solid fa-video-slash"></i>;
const setting = <i className="fa-solid fa-gear"></i>;

const Livestream = () => {
    let client;

    const [currentTheme, setCurrentTheme] = useState();
    const [displayComponent, setDisplayComponent] = useState('flex');
    const [iconMic, setIconMic] = useState(mic_on);
    const [iconCam, setIconCam] = useState(cam_on);
    const [stream, setStream] = useState();
    const [openSetting, setOpenSetting] = useState(false);

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

    const handleClickBtnInit = async () => {
        const url = API_Nanostream.CREATE_STREAM;
        const res = await sendStreamReq(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        });

        if(res.ok){
            const dataRes = await res.json();
            const streamName = dataRes.ingest.rtmp.streamname;
            if(!streamName) return alert('Lỗi xử lý stream!');

            // Cấu hình thông tin webcaster stream
            const webcaster = webcasterConfig();
            webcaster.streamName = streamName;

            if (window.WebcasterApiV6) {
                const { Webcaster, HelperUtils, DeviceUtils } = window.WebcasterApiV6;
      
                client = window.client = new Webcaster(webcaster);
                client.setup().then(() => {
                  console.log('Webcaster.setup done');
                }).catch(() => console.log('Webcaster.setup error!'));
              } else {
                console.error('WebcasterApiV6 is not loaded properly');
            }

            alert('Khởi tạo livestream thành công');
        }

        const getVideoLocal = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        if(videoRef.current){
            videoRef.current.srcObject = getVideoLocal;
        }
        setStream(getVideoLocal);
        setDisplayComponent(display => display==='flex'? 'none !important': 'flex');
    }

    const handleClickSetting = () => {
        setOpenSetting(!openSetting);
    }

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
                    <Button variant="contained" onClick={handleClickBtnInit}>Khởi tạo stream</Button>
                </div>
            </Grid>

            <Grid 
                className="wrap-container livestream" 
                // sx={{ display: displayComponent==='flex'? 'none': 'flex' }}
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
                        />
                    </div>
                </div>
                <div className="container-info livestream">
                    info
                </div>
            </Grid>
        </>
    )
}

export default Livestream;