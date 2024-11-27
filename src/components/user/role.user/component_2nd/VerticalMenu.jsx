import { Box } from "@mui/material";
import "../../../../styles/css/user/vertical.menu.css";
import { useEffect, useState } from "react";
import { API_SERVER, DOMAIN_SERVER } from "../../../../router/router.server";
import { sendReq } from "../../../../service/service.api";
import { customIcon } from "../../../../styles/icon/icon";

const User_VerticalMenuJSX = ({ width, mode, setChooseStream }) => {
    const [infoTopStreamHot, setInfoTopStreamHot] = useState([]);

    useEffect(() => {
        const fetcher = async (url) => {
            try {
                const url = API_SERVER.GETLIST_STREAM_MOST_VIEW;
                const res = await sendReq(url, { method: "GET" });
                if(res.ok){
                    const dataRes = await res.json();
                    return setInfoTopStreamHot(dataRes);
                }
                return alert('Có lỗi xảy ra trong quá trình xử lý dữ liệu!');
            } catch (error) {
                console.log('[Fetch Error]: ', error);
            }
        }

        fetcher();
    }, []);

    const handleClickStream = (stream) => {
        setChooseStream(stream);
    }

    return(
        <Box className="wrap-container vertical-menu-jsx">
            <h4 
                style={{ 
                    display: width==='1fr 5fr'? 'block': 'none',
                    color: mode==='light'? 'rgba(22, 24, 35, 0.75)': 'rgba(255, 255, 255, 0.75)'
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
        </Box>
    )
}

export default User_VerticalMenuJSX;