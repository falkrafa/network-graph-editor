import * as React from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Stack from '@mui/material/Stack';

export default function IconAlerts({ message }) {
    return (
        <Stack sx={{ width: '100%', marginBottom: 2}} spacing={2}>
            <Alert sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} icon={false} severity={message.includes('null') ? "error" : "info"}>
                {message}
            </Alert>
        </Stack>
    );
}