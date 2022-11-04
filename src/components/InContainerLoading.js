import { Box, Typography,CircularProgress } from "@mui/material";

export default function InContainerLoading({text="Loading...", mt=15}) {
    return (
        <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress color='secondary' sx={{ marginTop: mt }} />
            <Typography>{text}</Typography>
        </Box>
    )
}