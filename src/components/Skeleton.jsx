import Grid from "@mui/material/Grid2";
import { Skeleton } from "../service/service.component";

const SkeletonJSX = () => {
    return(
        <Grid container spacing={1}>
            <Grid size={12}>
                <Skeleton height={14} />
            </Grid>
            <Grid size={12}>
                <Skeleton height={14} />
            </Grid>
            <Grid size={4}>
                <Skeleton height={100} />
            </Grid>
            <Grid size={8}>
                <Skeleton height={100} />
            </Grid>

            <Grid size={12}>
                <Skeleton height={150} />
            </Grid>
            <Grid size={12}>
                <Skeleton height={14} />
            </Grid>

            <Grid size={3}>
                <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
                <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
                <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
                <Skeleton height={100} />
            </Grid>
        </Grid>
    )
}

export default SkeletonJSX;