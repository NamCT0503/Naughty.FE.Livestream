import * as React from "react";
import { stringAvatar } from "../../../service/service.component";
import "../../../styles/css/creator/dashboard.css"
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { convertToTimeFormatHHMMSS, sendReq } from "../../../service/service.api";
import { API_SERVER, DOMAIN_SERVER } from "../../../router/router.server";
import Grid from "@mui/material/Grid2";

const darkLive = 'https://lottie.host/c9c09db8-aee8-4221-97bd-fab1a8eec734/86e2o3A74w.lottie';
const lightLive = 'https://lottie.host/600bb81f-f764-4d06-a86e-37ce75bfbb1b/gKna0XiYmS.lottie';
const talk = 'https://lottie.host/46802d94-7b77-4791-b73e-6a4811f4c6af/BchOwpWLwM.lottie';

const CreatorDashboard = ({ props}) => {
    const [currentTheme, setCurrentTheme] = React.useState(); 
    const [allStreamOwner, setAllStreamOwner] = React.useState();

    const profile = props;

    React.useEffect(() => {
        const observer = new MutationObserver(() => {
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setCurrentTheme(theme);
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    React.useEffect(() => {
        const url_getAllStreamOwner = API_SERVER.GET_ALL_STREAM_OWNER;
        const fetcher = async (url) => {
            try {
                const res = await sendReq(url, { method: "GET"});
                const dataRes = await res.json();
                if(res.ok){
                    return setAllStreamOwner(dataRes);
                }

                return alert(dataRes.message? dataRes.message: "Fetch Error!");
            } catch (error) {
                console.log('[Fetch Error]: ', error);
            }
        }

        fetcher(url_getAllStreamOwner);
    }, [])

    const infoStreamMostView = allStreamOwner?.records[0];

    return(
        <Grid className="wrap-container creator-dashboard" container spacing={2}>
            <Grid
                className="area-title creator-dashboard"
                sx={{
                    boxShadow: currentTheme==='light'? 'rgba(0, 0, 0, 0.16) 0px 1px 4px': 'white 0px 1px 4px'
                }}
                size={12}
            >
                <Grid size={{xs: 6, md: 6}}>
                    <h1>Xin chào, {profile.fullname}</h1>
                </Grid>
                <Grid size={{xs: 6, md: 6}}>
                    <DotLottieReact id="live-svg" src={currentTheme==='light'? darkLive: lightLive} loop autoplay/>
                </Grid>
            </Grid>

            <Grid 
                size={{xs: 12, md: 12}}
                className="container-main-content creator-dashboard"
                spacing={2}
                sx={{
                    boxShadow: currentTheme==='light'? 'rgba(0, 0, 0, 0.16) 0px 1px 4px': 'white 0px 1px 4px'
                }}
            >
                <Grid size={{xs: 12, md: 12}}><h1>Các buổi livestream</h1></Grid>
                <Grid size={{xs: 12, md: 12}}><DotLottieReact src={talk} loop autoplay /></Grid>
                <Grid 
                    container
                    spacing={2}
                    className="area-main-content creator-dashboard"
                >
                    <Grid
                        item
                        size={{xs: 12, sm: 6, md: 3}}
                        className="area-statistical creator-dashboard"
                        sx={{
                            boxShadow: currentTheme==='light'? 'rgba(0, 0, 0, 0.16) 0px 1px 4px': 'white 0px 1px 4px'
                        }}
                    >
                        <h3>Stream Nhiều Lượt Xem Nhất</h3>
                        <div className="area-detail-info creator-dashboar">
                            <img 
                                src={
                                    infoStreamMostView?.image.startsWith('http')? 
                                    infoStreamMostView?.image: 
                                    `${DOMAIN_SERVER}/${infoStreamMostView?.image}`
                                } 
                                alt="Thumbnail Image"
                            />
                            <div>Tiêu đề: {infoStreamMostView?.title}</div>
                            <div>Ngày livestream: {infoStreamMostView?.start_time.split(' ')[0]}</div>
                            <div>Thời lượng livestream: {convertToTimeFormatHHMMSS(infoStreamMostView?.timeLive)}</div>
                            <div>Lượt xem: {infoStreamMostView?.totalView}</div>
                        </div>
                    </Grid>
                    <Grid
                        size={{xs: 12, sm: 6, md: 3}}
                        className="area-statistical creator-dashboard"
                        sx={{
                            boxShadow: currentTheme==='light'? 'rgba(0, 0, 0, 0.16) 0px 1px 4px': 'white 0px 1px 4px'
                        }}
                    >
                        <h3>Stream Nhiều Lượt Xem Nhất</h3>
                        <div className="area-detail-info creator-dashboar">
                            <img 
                                src={
                                    infoStreamMostView?.image.startsWith('http')? 
                                    infoStreamMostView?.image: 
                                    `${DOMAIN_SERVER}/${infoStreamMostView?.image}`
                                } 
                                alt="Thumbnail Image"
                            />
                            <div>Tiêu đề: {infoStreamMostView?.title}</div>
                            <div>Ngày livestream: {infoStreamMostView?.start_time.split(' ')[0]}</div>
                            <div>Thời lượng livestream: {convertToTimeFormatHHMMSS(infoStreamMostView?.timeLive)}</div>
                            <div>Lượt xem: {infoStreamMostView?.totalView}</div>
                        </div>
                    </Grid>
                    <Grid
                        size={{xs: 12, sm: 6, md: 3}}
                        className="area-statistical creator-dashboard"
                        sx={{
                            boxShadow: currentTheme==='light'? 'rgba(0, 0, 0, 0.16) 0px 1px 4px': 'white 0px 1px 4px'
                        }}
                    >
                        <h3>Stream Nhiều Lượt Xem Nhất</h3>
                        <div className="area-detail-info creator-dashboar">
                            <img 
                                src={
                                    infoStreamMostView?.image.startsWith('http')? 
                                    infoStreamMostView?.image: 
                                    `${DOMAIN_SERVER}/${infoStreamMostView?.image}`
                                } 
                                alt="Thumbnail Image"
                            />
                            <div>Tiêu đề: {infoStreamMostView?.title}</div>
                            <div>Ngày livestream: {infoStreamMostView?.start_time.split(' ')[0]}</div>
                            <div>Thời lượng livestream: {convertToTimeFormatHHMMSS(infoStreamMostView?.timeLive)}</div>
                            <div>Lượt xem: {infoStreamMostView?.totalView}</div>
                        </div>
                    </Grid>
                    <Grid
                        size={{xs: 12, sm: 6, md: 3}}
                        className="area-statistical creator-dashboard"
                        sx={{
                            boxShadow: currentTheme==='light'? 'rgba(0, 0, 0, 0.16) 0px 1px 4px': 'white 0px 1px 4px'
                        }}
                    >
                        <h3>Stream Nhiều Lượt Xem Nhất</h3>
                        <div className="area-detail-info creator-dashboar">
                            <img 
                                src={
                                    infoStreamMostView?.image.startsWith('http')? 
                                    infoStreamMostView?.image: 
                                    `${DOMAIN_SERVER}/${infoStreamMostView?.image}`
                                } 
                                alt="Thumbnail Image"
                            />
                            <div>Tiêu đề: {infoStreamMostView?.title}</div>
                            <div>Ngày livestream: {infoStreamMostView?.start_time.split(' ')[0]}</div>
                            <div>Thời lượng livestream: {convertToTimeFormatHHMMSS(infoStreamMostView?.timeLive)}</div>
                            <div>Lượt xem: {infoStreamMostView?.totalView}</div>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                size={{xs: 12, sm: 12, md: 12}}
                className="container-main-content creator-dashboard"
                sx={{
                    boxShadow: currentTheme==='light'? 'rgba(0, 0, 0, 0.16) 0px 1px 4px': 'white 0px 1px 4px'
                }}
            >
                Bạn
            </Grid>
        </Grid>
    )
}

export default CreatorDashboard;