import { useState} from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// MUI Table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// MUI Elements
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

// MUI Icons
import DeleteIcon from '@mui/icons-material/Delete';
import EmergencyRecordingOutlinedIcon from '@mui/icons-material/EmergencyRecordingOutlined';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadingIcon from '@mui/icons-material/Downloading';

// Third-Party Components
import { format } from 'date-fns'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { apiInstance } from 'src/utils/apiAuth';
import UserInfo from 'src/utils/Authorization/UserInfo';


export default function OnboardEngagementList({tableContent}) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [copyStatus, setCopyStatus] = useState(false)
    const userInfo = UserInfo()

    const handleDelete = (obj_id) => {
        const hrToken = localStorage.getItem("authToken");

        apiInstance({
            method: "delete",
            url: "onboard-engagements/" + parseInt(obj_id) + "/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
        .then(function (response) {
            enqueueSnackbar(response.data.message, {
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                variant: 'success',
                autoHideDuration: 2000,
            });
            navigate("/resumeX/candidates", { replace: true });
        })
        .catch(function (error) {
            enqueueSnackbar('Something went wrong. Please try after sometime.', {
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                variant: 'error',
                autoHideDuration: 2000,
            });
        });
    }

    const getRecordingLink = (objectID) => {
        const hrToken = localStorage.getItem("authToken");

        apiInstance({
            method: "post",
            url: "/onboard-engagements/get_recording_link/",
            headers: {
                Authorization: "token " + hrToken,
            },
            data: {
                "id": objectID
            }
        })
        .then(function (response) {
            enqueueSnackbar(response.data.message, {
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                variant: 'success',
                autoHideDuration: 2000,
            });
            navigate("/resumeX/candidates", { replace: true });
        })
        .catch(function (error) {
            enqueueSnackbar('Something went wrong. Please try after sometime.', {
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                variant: 'error',
                autoHideDuration: 2000,
            });
        });
    }

    const getScheduleDateTime = (scheduleDT) => {
        var new_scheduleDT = new Date(scheduleDT)
        var format_scheduleDT = format(new_scheduleDT, "PPpp")
        return format_scheduleDT
    }
    
    return (
        <TableContainer component={Paper}>

            {/* <<<-------- Copy Status Dialog Box -------->>> */}
                        
            <Dialog open={copyStatus} onClose={() => setCopyStatus(false)}>
                <DialogTitle 
                    style={{textAlign: "center", paddingBottom: "40px"}}>
                        Attendee Link
                </DialogTitle>
                <DialogContent style={{textAlign: "center"}}>
                    <DialogContentText>
                        Attendee Link Copied Successfully!
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{justifyContent: "center"}}>
                    <Button size="large" 
                            autoFocus 
                            onClick={() => setCopyStatus(false)}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* <<<-------- Table -------->>> */}

            <Table sx={{ minWidth: 650 }} aria-label="simple table">

                {/* <<<-------- Table Column Titles -------->>> */}

                <TableHead>
                    <TableRow>
                        <TableCell> Call With </TableCell>
                        <TableCell> Details of Call </TableCell>
                        <TableCell> Mode </TableCell>
                        <TableCell> IM </TableCell>
                        <TableCell> Date </TableCell>
                        <TableCell> Moderator Link </TableCell>
                        <TableCell> Attendee Link </TableCell>
                        <TableCell> Recording </TableCell>
                        {userInfo?.role !== 'BU_HEAD' ?
                            <TableCell> Action </TableCell> 
                        : null}
                    </TableRow>
                </TableHead>

                {/* <<<-------- Table Data -------->>> */}

                <TableBody>                                 

                {tableContent?.candidateData?.onboard_engagements?.map((row, i) => (
                    <TableRow
                        key={row?.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >

                        <TableCell component="th" scope="row">
                            {row?.call_with}
                        </TableCell>

                        <TableCell>  {row?.agenda} </TableCell>

                        <TableCell> {row?.mode} </TableCell>

                        <TableCell> {row?.im ? row?.im : "-"} </TableCell>

                        <TableCell> 
                            {getScheduleDateTime(row?.schedule_dt)} 
                        </TableCell>

                        <TableCell>
                            {row?.mod_link ?
                                <Button color="info" 
                                        variant="outlined"    
                                        fontSize='small' 
                                        size="small"
                                        href={row?.mod_link}
                                        target="_blank"
                                        startIcon={<OpenInNewIcon/>} >
                                    Join As Moderator 
                                </Button>
                            : "-" } 
                        </TableCell>

                        <TableCell>  
                            {row?.attendee_link ? 
                                <CopyToClipboard text={row?.attendee_link}
                                    onCopy={() => setCopyStatus(true)} >
                                    
                                    <Button color="info" 
                                            variant="outlined"    
                                            fontSize="small" 
                                            size="small"
                                            startIcon={<CopyAllIcon/>} >
                                        Copy Link
                                    </Button>

                                </CopyToClipboard>                          
                            : "-" }
                        </TableCell>

                        <TableCell>
                            {row?.mode === "BBB" ?
                                row?.recording_link ?
                                <Button color="primary" 
                                        href={row.recording_link}
                                        target="_blank">
                                    <EmergencyRecordingOutlinedIcon          fontSize="medium"/> 
                                </Button> :  
                                <Button color="primary" 
                                        variant="outlined"    
                                        fontSize="small" 
                                        size="small"
                                        startIcon={<DownloadingIcon/>} 
                                        onClick={() => getRecordingLink(row.id)}>
                                    Get Recording
                                </Button> 
                            : "-" }
                        </TableCell>
                    
                    {userInfo?.role !== 'BU_HEAD' ?
                        <TableCell>
                            <Button color="error" 
                                onClick={() => handleDelete(row.id)}
                            >
                                <DeleteIcon  fontSize="medium"  />
                            </Button>
                        </TableCell>  : null }         

                    </TableRow> 
                  ))}

                </TableBody>
            </Table>
        </TableContainer>
    );
}
