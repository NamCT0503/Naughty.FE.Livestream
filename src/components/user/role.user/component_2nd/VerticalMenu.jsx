import { Box } from "@mui/material";
import "../../../../styles/css/user/vertical.menu.css";
import { useEffect, useState } from "react";
import { API_SERVER, DOMAIN_SERVER } from "../../../../router/router.server";
import { sendReq } from "../../../../service/service.api";
import { customIcon } from "../../../../styles/icon/icon";
import { useLocation } from "react-router-dom";

const User_VerticalMenuJSX = ({ width, mode, setChooseStream }) => {
    const [infoTopStreamHot, setInfoTopStreamHot] = useState([]);
    const [topCreatorHot, setTopCreatorHot] = useState([]);
    const [listStreaming, setListStreaming] = useState([]); // Danh sách creator đã theo dõi kèm stream mới nhất của creator đó.

    const location = useLocation();

    // Lấy dữ liệu cho menu dọc trang Dành cho bạn
    useEffect(() => {
        const url_streamMostView = API_SERVER.GETLIST_STREAM_MOST_VIEW;
        const url_creatorHot = API_SERVER.GETLIST_TOP_CREATOR_HOT;
        const url_getListStreaming = API_SERVER.GET_INFO_LIST_STREAMING;

        const fetcher = async (url) => {
            try {
                const res = await sendReq(url, { method: "GET" });
                if(res.ok){
                    const dataRes = await res.json();
                    if(url.includes('/top-most-view')){
                        return setInfoTopStreamHot(dataRes)
                    }
                    if(url.includes('/top-creator-hot')){
                        return setTopCreatorHot(dataRes);
                    }
                    if(url.includes('/get-info-list-stream')){
                        return setListStreaming(dataRes);
                    }
                    return;
                }
                return alert('Có lỗi xảy ra trong quá trình xử lý dữ liệu!');
            } catch (error) {
                console.log('[Fetch Error]: ', error);
            }
        }

        if(location.pathname.endsWith('/user')){
            fetcher(url_streamMostView);
            fetcher(url_creatorHot);
        } else {
            fetcher(url_getListStreaming);
        }
    }, [location.pathname]);

    const handleClickStream = (stream) => {
        setChooseStream(stream);
    }

    return(
        <Box className="wrap-container vertical-menu-jsx">
            {
                location.pathname.endsWith('/user')?

                // Menu dọc cho trang Dành cho bạn
                <>
                <h4 
                    style={{ 
                        display: width==='1fr 5fr'? 'block': 'none',
                        color: mode==='light'? 'rgba(22, 24, 35, 0.75)': 'rgba(255, 255, 255, 0.75)',
                        textAlign: 'left',
                        marginLeft: '10px'
                    }}
                >
                    LIVE đang được quan tâm
                </h4>
                {
                    infoTopStreamHot.length>0?
                    infoTopStreamHot.map(items => {
                        const infoCreator = items.thumbnails.users;

                        return(
                            <div 
                                key={items.id} 
                                className="container-stream-hot vertical-menu-jsx"
                                onClick={() => handleClickStream(items)}
                            >
                                <div 
                                    className="area-avatar-creator vertical-menu-jsx"
                                    style={{
                                        width: width==='1fr 5fr'? '24%': '100%'
                                    }}
                                >
                                    <img 
                                        src={
                                            infoCreator.avatar?
                                            infoCreator.avatar?.startsWith('http')?
                                            infoCreator.avatar:
                                            `${DOMAIN_SERVER}/${infoCreator.avatar}`:
                                            `${API_SERVER.DEFAULT_AVATAR}`
                                        } 
                                        alt="Nhà sáng tạo"
                                    />
                                </div>
                                <div 
                                    className="area-info-creator vertical-menu-jsx"
                                    style={{
                                        display: width==='1fr 5fr'? 'flex': 'none'
                                    }}
                                >
                                    <span style={{ fontWeight: 600}}>{infoCreator.fullname}</span>
                                    <span 
                                        style={{ 
                                            fontSize: '12px', 
                                            color: mode==='light'? 'rgba(22, 24, 35, 0.75)': 'rgba(255, 255, 255, 0.75)'
                                        }}
                                    >
                                        {infoCreator.username}
                                    </span>
                                </div>
                                <div 
                                    className="area-total-view vertical-menu-jsx"
                                    style={{
                                        display: width==='1fr 5fr'? 'flex': 'none'
                                    }}
                                >
                                    {customIcon.eye}
                                    <p>{items.totalView}</p>
                                </div>
                            </div>
                        )
                    }):
                    <span>Tạm chưa có LIVE!</span>
                }
                <h4 
                    style={{ 
                        display: width==='1fr 5fr'? 'block': 'none',
                        color: mode==='light'? 'rgba(22, 24, 35, 0.75)': 'rgba(255, 255, 255, 0.75)',
                        textAlign: 'left',
                        marginLeft: '10px'
                    }}
                >
                    Nhà sáng tạo HOT
                </h4>
                {
                    topCreatorHot.length>0?
                    topCreatorHot.map(items => {
                        return(
                            <div 
                                key={items.id} 
                                className="container-creator-hot vertical-menu-jsx"
                                onClick={() => handleClickStream(items)}
                            >
                                <div 
                                    className="area-avatar-creator vertical-menu-jsx"
                                    style={{
                                        width: width==='1fr 5fr'? '24%': '100%',
                                        border: mode==='light'? '1px solid #121212': '1px solid #fff'
                                    }}
                                >
                                    <img 
                                        src={
                                            items.avatar?
                                            items.avatar?.startsWith('http')?
                                            items.avatar:
                                            `${DOMAIN_SERVER}/${items.avatar}`:
                                            `${API_SERVER.DEFAULT_AVATAR}`
                                        } 
                                        alt="Nhà sáng tạo"
                                    />
                                </div>
                                <div 
                                    className="area-info-creator vertical-menu-jsx"
                                    style={{
                                        display: width==='1fr 5fr'? 'flex': 'none'
                                    }}
                                >
                                    <span style={{ fontWeight: 600}}>{items.fullname}</span>
                                    <span 
                                        style={{ 
                                            fontSize: '12px', 
                                            color: mode==='light'? 'rgba(22, 24, 35, 0.75)': 'rgba(255, 255, 255, 0.75)'
                                        }}
                                    >
                                        {items.username}
                                    </span>
                                </div>
                            </div>
                        )
                    }):
                    <span>Trống</span>
                }
                </>:

                // Menu dọc cho trang Yêu thích
                <>
                <h4 
                    style={{ 
                        display: width==='1fr 5fr'? 'block': 'none',
                        color: mode==='light'? 'rgba(22, 24, 35, 0.75)': 'rgba(255, 255, 255, 0.75)',
                        textAlign: 'left',
                        marginLeft: '10px'
                    }}
                >
                    Nhà sáng tạo LIVE Yêu thích
                </h4>
                {
                    listStreaming.length>0?
                    listStreaming.map(items => {
                        return(
                            <div 
                                key={items.id} 
                                className="container-stream-hot vertical-menu-jsx"
                                onClick={() => handleClickStream(items)}
                            >
                                <div 
                                    className="area-avatar-creator vertical-menu-jsx"
                                    style={{
                                        width: width==='1fr 5fr'? '24%': '100%'
                                    }}
                                >
                                    <img 
                                        src={
                                            items.users.avatar?
                                            items.users.avatar?.startsWith('http')?
                                            items.users.avatar:
                                            `${DOMAIN_SERVER}/${items.users.avatar}`:
                                            `${API_SERVER.DEFAULT_AVATAR}`
                                        } 
                                        alt="Nhà sáng tạo"
                                    />
                                </div>
                                <div 
                                    className="area-info-creator vertical-menu-jsx"
                                    style={{
                                        display: width==='1fr 5fr'? 'flex': 'none'
                                    }}
                                >
                                    <span style={{ fontWeight: 600}}>{items.users.fullname}</span>
                                    <span 
                                        style={{ 
                                            fontSize: '12px', 
                                            color: mode==='light'? 'rgba(22, 24, 35, 0.75)': 'rgba(255, 255, 255, 0.75)'
                                        }}
                                    >
                                        {items.users.username}
                                    </span>
                                </div>
                                <div 
                                    className="area-total-view vertical-menu-jsx"
                                    style={{
                                        display: width==='1fr 5fr'? 'flex': 'none'
                                    }}
                                >
                                    {customIcon.eye}
                                    <p>{items.totalView}</p>
                                </div>
                            </div>
                        )
                    }):
                    <span>Tạm chưa có LIVE!</span>
                }
                </>
            }
        </Box>
    )
}

export default User_VerticalMenuJSX;