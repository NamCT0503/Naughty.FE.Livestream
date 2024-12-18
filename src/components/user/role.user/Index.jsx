import { Route, Routes } from "react-router-dom";
import IndexLayoutUser from "./MainLayout"
import { ModeTheme } from "./ModeTheme"

const UserApp = () => {
    return(
        <ModeTheme>
            <IndexLayoutUser/>
        </ModeTheme>
    )
}

export default UserApp;