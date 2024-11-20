import * as React from "react";
import Grid from "@mui/material/Grid2";
import { API_SERVER } from "../../../router/router.server";
import { sendReq } from "../../../service/service.api";
import "../../../styles/css/creator/stream.css";
import TableIndex from "./components_2nd/stream/table.index";
import SkeletonJSX from "../../Skeleton";

const url_getAllStreamOwner = API_SERVER.GET_ALL_STREAM_OWNER;

const CreatorStream = () => {
    const [currentTheme, setCurrentTheme] = React.useState();
    const [allStreamOwner, setAllStreamOwner] = React.useState();
    const [isLoading, setIsLoading] = React.useState(true);

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
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        const observer = new MutationObserver(() => {
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setCurrentTheme(theme);
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    React.useEffect(() => {
        fetcher(url_getAllStreamOwner);
    }, []);

    if(isLoading){
        return(
            <SkeletonJSX/>
        )
    }

    console.log('all stream: ', allStreamOwner);
    return(
        <Grid container justifyContent={"center"} alignItems={"center"} className="wrap-container creator-stream">
            <Grid size={{ xs: 12, sm: 12, md: 12}}>
                <TableIndex props={allStreamOwner} />
            </Grid>
        </Grid>
    )
}

export default CreatorStream;