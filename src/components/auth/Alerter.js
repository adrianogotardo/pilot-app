
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import {IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function Alerter(props) {
    const { severity, errorMessage, alertTitle, getOffScreen, isOpen } = props;

    if(!isOpen) return <></>
    return (
            <Alert id="alert" severity={severity}
                action={
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={getOffScreen}
                >
                    <CloseIcon />
                </IconButton>
                }
            >
                <AlertTitle>{alertTitle}</AlertTitle>
                {`Sorry, ${errorMessage}`}
            </Alert>
    )
}