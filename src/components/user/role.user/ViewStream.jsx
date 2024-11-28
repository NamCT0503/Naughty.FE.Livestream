import Grid from "@mui/material/Grid2";
import "../../../styles/css/user/view.stream.css";
import User_VerticalMenuJSX from "./component_2nd/VerticalMenu";
import { useState } from "react";
import { customIcon } from "../../../styles/icon/icon";
import ShowLiveJSX from "./component_2nd/ShowLive";
import { Route, Routes, useLocation } from "react-router-dom";

const ViewStreamJSX = ({ mode }) => {
    const [widthVerticalMenu, setWithVerticalMenu] = useState('1fr 5fr');
    const [chooseStream, setChooseStream] = useState();
    const [chooseStreamFavorite, setChooseStreamFavorite] = useState();

    const location = useLocation();

    const handleClickBtnShowHideVM = () => {
        setWithVerticalMenu(width => width==='1fr 5fr'? '1fr 20fr': '1fr 5fr');
    }

    return(
        <Grid 
            container 
            className="wrap-container view-stream vertical-menu"
            sx={{
                gridTemplateColumns: widthVerticalMenu
            }}
        >
            <Grid 
                className="container-vertical-menu view-stream"
                sx={{
                    border: mode==='light'? '1px solid rgba(22, 24, 35, 1)': '1px solid gray'
                }}
            >
                {
                    location.pathname.endsWith('/user')?
                    <User_VerticalMenuJSX width={widthVerticalMenu} mode={mode} setChooseStream={setChooseStream} />:
                    <User_VerticalMenuJSX width={widthVerticalMenu} mode={mode} setChooseStream={setChooseStreamFavorite} />
                }
                <div 
                    className={`btn-show-hide vertical-menu view-stream ${mode==='light'? '': 'dark-mode'}`}
                    onClick={handleClickBtnShowHideVM}
                    style={{
                        right: widthVerticalMenu==='1fr 5fr'? '-6%': '-20%'
                    }}
                >
                    {widthVerticalMenu==='1fr 5fr'? customIcon.arrow_left: customIcon.arrow_right}
                </div>
            </Grid>
            <Grid className="container-view-stream view-stream">
                {
                    location.pathname.endsWith('/user')?
                    <ShowLiveJSX stream={chooseStream} />:
                    <ShowLiveJSX stream={chooseStreamFavorite} />
                }
            </Grid>
        </Grid>
    )
}

export default ViewStreamJSX;