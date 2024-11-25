import { Button, Dialog, DialogTitle, TextField } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import webcasterConfig from "../../../../../config/webcaster.config";
import { sendReq, sendStreamReq } from "../../../../../service/service.api";
import { API_Nanostream, API_SERVER, DOMAIN_SERVER } from "../../../../../router/router.server";

const url_getlistThumbnail = API_SERVER.GETLIST_THUMBNAIL;

const DiaLogInitstream = (props) => {
    const { onClose, open, stream, setStream, display, setDisplay, videoRef } = props;

    const inputFileRef = useRef();

    const [file, setFile] = useState();
    const [dataForm, setDataForm] = useState({
        title: ''
    });
    const [thumbnailLastest, setThumbnailLastest] = useState();
    const [streamVideo, setStreamVideo] = useState();

    useEffect(() => {
        const fetcher = async (url) => {
            try {
                const res = await sendReq(url, { method: "GET"});
                const dataRes = await res.json();
                if(res.ok){
                    return setThumbnailLastest(dataRes[0]);
                }
                return alert(dataRes.message? dataRes.message: "Lỗi quá trình xử lý thumbnail!");
            } catch (error) {
                console.error('[Fetch Error]: ', error);
            }
        }

        fetcher(url_getlistThumbnail);
    }, []);

    const handleClickUploadFile = () => {
        if(inputFileRef.current){
            inputFileRef.current.click();
        }
    }

    const handleClickBtnInit = async () => {
        const url = API_Nanostream.CREATE_STREAM;
        const res = await sendStreamReq(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        });

        if(res.ok){
            const dataRes = await res.json();
            const streamname = dataRes.ingest.rtmp.streamname;
            if(!streamname) return alert('Lỗi xử lý stream!');

            // Cấu hình thông tin webcaster stream
            const webcaster = webcasterConfig();
            webcaster.streamName = streamname;

            if (window.WebcasterApiV6) {
                const { Webcaster, HelperUtils, DeviceUtils } = window.WebcasterApiV6;
      
                client = window.client = new Webcaster(webcaster);
                client.setup().then(() => {
                  console.log('Webcaster.setup done');
                }).catch(() => console.log('Webcaster.setup error!'));
              } else {
                console.error('WebcasterApiV6 is not loaded properly');
            }

            const url_createThumbnail = API_SERVER.CREATE_THUMBNAIL;
            const url_saveStreamDB = API_SERVER.CREATE_STREAM;
            try {
                if(file){
                    const accessToken = Cookies.get('accessToken');
                    const formData = new FormData();
                    formData.append('img', file);

                    const resThumbnail = await fetch(url_createThumbnail, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        },
                        body: formData
                    });

                    if(resThumbnail.ok){
                        const resDB = await sendReq(url_saveStreamDB, {
                            method: "POST",
                            body: JSON.stringify({
                                title: dataForm.title
                            })
                        });
                        const dataResDB = await resDB.json();
                        if(resDB.ok){
                            setStream.setStreamName(streamname);
                            setStream.setStreamId(dataRes.id);
                            setStream.setRecordStreamId(dataResDB.metadata);
                            alert('Khởi tạo livestream thành công');      
                        }
                        alert(dataResDB.message? dataResDB.message: "Lỗi xử khởi tạo stream!");
                    } else {
                        const dataResThumbnail = await resThumbnail.json();
                        alert(dataResThumbnail.message? dataResThumbnail.message: "Lỗi xử lý thumbnail!");
                    }
                } else {
                    const resDB = await sendReq(url_saveStreamDB, {
                        method: "POST",
                        body: JSON.stringify({
                            title: dataForm.title
                        })
                    });
                    
                    if(resDB.ok){
                        const dataResDB = await resDB.json();
                        setStream.setStreamName(streamname);
                        setStream.setStreamId(dataRes.id);
                        setStream.setRecordStreamId(dataResDB.metadata);
                        alert('Khởi tạo livestream thành công');      
                    } else {
                        const dataResDB = await resDB.json();
                        alert(dataResDB.message? dataResDB.message: 'Khởi tạo stream không thành công!');
                    }
                }
            } catch (error) {
                console.error('[Fetch Error]: ', error);
            }
        }

        const getVideoLocal = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        if(videoRef.current){
            videoRef.current.srcObject = getVideoLocal;
        }
        console.log("MediaStream: ", getVideoLocal);
        setStreamVideo(getVideoLocal);

        onClose(); // Đóng khung khởi tạo stream.
        setDisplay.setDisplayComponent(display => display==='flex'? 'none !important': 'flex');
        setDisplay.setIsShowStream(false);
    }

    const handleChangeDataForm = (e) => {
        setDataForm({
            [e.target.name]: e.target.value
        });
    }

    console.log('file: ', file);
    console.log('thumbnail: ', thumbnailLastest);
    console.log('record id: ', stream.recordStreamId);
    console.log("Video Element: ", videoRef.current);
    return(
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Thông tin stream</DialogTitle>
            <TextField label="Tiêu đề" name="title" onChange={handleChangeDataForm} />
            <div className="area-choose-thumbnail stream">
                <span>Hệ thống sẽ tự động sử dụng hình ảnh mới nhất trong Thư viện ảnh của bạn</span>
                <div>Hoặc</div>
                <Button variant="outlined" sx={{ width: '30%'}} startIcon={<UploadFile/>} onClick={handleClickUploadFile}>
                    Poster Stream
                </Button>
            </div>
            <input type="file" ref={inputFileRef} onChange={(e) => setFile(e.target.files[0])} style={{ display: 'none'}}/>
            <div className="area-preview-img-thumbnail">
                <img src={file? URL.createObjectURL(file): thumbnailLastest?.img.startsWith('http')? `${thumbnailLastest?.img}`: `${DOMAIN_SERVER}/${thumbnailLastest?.img}`} alt="" />
            </div>
            <Button variant="contained" onClick={handleClickBtnInit}>Tạo stream</Button>
        </Dialog>
    )
}

export default DiaLogInitstream;