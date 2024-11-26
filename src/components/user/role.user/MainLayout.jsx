import { BottomNavigation, BottomNavigationAction, Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import IconIndexPage from "@mui/icons-material/SpaceDashboard";
import IconFavoritePage from "@mui/icons-material/Favorite";
import IconProfilePage from "@mui/icons-material/Person";
import IconLightMode from "@mui/icons-material/LightMode";
import IconDarkMode from "@mui/icons-material/DarkMode";
import IconSearch from "@mui/icons-material/Search";
import { useState } from "react";
import { useThemeContext } from "./ModeTheme";
import "../../../styles/css/user/index.layout.css";
import ViewStreamJSX from "./ViewStream";

const IndexLayoutUser = () => {
    const [value, setValue] = useState('for-you');

    const { toggleTheme, mode } = useThemeContext();

    const handleChangeNav = (e, newValue) => {
        setValue(newValue);
    }

    return(
        <div id="root-user">
            <Box>
                <Grid 
                    container
                    className="wrap-container user-index"
                >
                    {/* Phần Header */}
                    <Grid size={12} className="">
                        <Box 
                            textAlign={"center"} 
                            mb={2} 
                            className="container-header user-index"
                            sx={{
                                backgroundColor: mode==='light'? 'white': '#1d1d1d'
                            }}
                        >
                            <h3>LiveApp</h3>
                            <Grid size={{ md: 5}}>
                                <div 
                                    className={`area-search user-index ${mode==='light'? '': 'dark-mode'}`}
                                    style={{
                                        backgroundColor: mode==='light'? '#d4d4d4': 'GrayText'
                                    }}
                                    
                                >
                                    <input 
                                        type="text" 
                                        placeholder="Tìm kiếm" 
                                        style={{ 
                                            color: mode==='light'? '#000': '#fff',
                                            borderRight: mode==='light'? '1px solid #121212': '1px solid #fff'
                                        }} 
                                    />
                                    <div className={`btn-search user-index ${mode==='light'? '': 'dark-mode'}`}>
                                        <IconSearch sx={{ color: mode==='light'? 'black': '#fff' }} />
                                    </div>
                                </div>
                            </Grid>
                            <Button variant="outlined" onClick={toggleTheme} startIcon={mode==='light'? <IconDarkMode/>: <IconLightMode/>}></Button>
                        </Box>
                    </Grid>
                    {/* Phần Header */}

                    <Grid size={12}>
                        {/* Phần xem Stream */}
                        <Box textAlign={"center"} mb={2} className="container-view user-index">
                            <ViewStreamJSX/>
                        </Box>
                        {/* Phần xem Stream */}
                    </Grid>

                    <Grid size={12}>
                        {/* Phần Nav-Bottom */}
                        <BottomNavigation className="container-nav-bottom user-index" value={value} onChange={handleChangeNav}>
                            <BottomNavigationAction 
                                label="Dành cho bạn"
                                value={'for-you'}
                                icon={<IconIndexPage/>}
                            />
                            <BottomNavigationAction
                                label="Yêu thích"
                                value={'favourite'}
                                icon={<IconFavoritePage/>}
                            />
                            <BottomNavigationAction
                                label="Tôi"
                                value={'profile'}
                                icon={<IconProfilePage/>}
                            />
                        </BottomNavigation>
                        {/* Phần Nav-Bottom */}
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default IndexLayoutUser;