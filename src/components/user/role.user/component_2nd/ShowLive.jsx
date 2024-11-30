import { useEffect, useState } from "react";
import { API_SERVER, DOMAIN_SERVER } from "../../../../router/router.server";
import "../../../../styles/css/user/show.live.css";
import { sendReq } from "../../../../service/service.api";

const ShowLiveJSX = ({ stream }) => {    
    const [bgImage, setBgImage] = useState('');
    const [urlStream, setUrlStream] = useState('');

    const getStreamUrlCreatorOnTop = async (creator_id) => {
        try {
            const url = API_SERVER.GET_STREAM_URL_BY_CREATORID.replace(':creator_id', creator_id);
            const res = await sendReq(url, { method: "GET" });
            const dataRes = await res.json();
            if(res.ok){
                return dataRes?.stream_url? dataRes.stream_url: null;
            }
            return alert(dataRes.message? dataRes.message: "Lỗi GET dữ liệu!");
        } catch (error) {
            console.log('[Fetch Error]: ', error);
        }
    }
    
    useEffect(() => {
        if(stream?.id){
            setBgImage(stream?.thumbnails.users.avatar);
            setUrlStream(stream?.stream_url? stream?.stream_url: '');
        } else if(stream?.creator_id){
            setBgImage(stream?.avatar);

            const fetchStreamUrl = async () => {
                const url = await getStreamUrlCreatorOnTop(stream.creator_id);
                setUrlStream(url);
            };
    
            fetchStreamUrl();
        } else {
            setBgImage(stream?.users.avatar);
            if(stream?.users.thumbnails.length>0){
                const url = stream?.users.thumbnails[0].streams[0].stream_url;
                setUrlStream(url? url: '');
            }
        }
    }, [stream]);

    if(!stream || (!stream.id && !stream.creator_id && !stream.users)){
        return(
            <span>Chọn LIVE phía bên trái để bắt đầu xem</span>
        )
    }

    console.log('urlStream: ', urlStream);
    return(
        <div 
            className="wrap-container show-live"
            style={{
                "--background-image-url": `url(${
                    bgImage?
                    bgImage.startsWith('http')?
                    `${bgImage}`:
                    `${DOMAIN_SERVER}/${bgImage}`:
                    `${API_SERVER.DEFAULT_AVATAR}`
                })`
            }}
        >
            <div className="container-content-live show-live">
                {/* <iframe src="https://www.youtube.com/embed/vrcjoqeLeJI?si=X6zwVXqYhTe3KwLa&amp;start=10" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}
                {
                    (urlStream==='' || !urlStream)?
                    <span>Nhà sáng tạo này tạm thời chưa LIVE</span>:
                    <iframe src={urlStream} frameBorder={0} autoPlay muted />
                }
            </div>
        </div>
    )
}

export default ShowLiveJSX;