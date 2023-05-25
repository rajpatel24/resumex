import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from 'axios';
import { apiInstance } from 'src/utils/apiAuth';
import * as constants from 'src/utils/constants';
import UserInfo from 'src/utils/Authorization/UserInfo';


export default function BasicTable(tableContent) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const userInfo = UserInfo()

    const handleFileDelete = (docType) => {
        const candId = tableContent?.tableContent?.candidateData?.id
        const hrToken = localStorage.getItem("authToken");


        var apiData = {
            "cand_id": candId,
            "doc_type": docType,
        }

        apiInstance({
            method: "put",
            url: "candidate-viewset/delete_documents/",
            headers: {
                Authorization: "token " + hrToken,
            },
            data: apiData,
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
            navigate(0);
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

    
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Owner </TableCell>
                        <TableCell>Document Type </TableCell>
                        <TableCell>Document Name </TableCell>
                        <TableCell>File Size (KB)</TableCell>
                        <TableCell>Last Modification </TableCell>
                        { userInfo?.role !== 'BU_HEAD' ? <TableCell>Action </TableCell> : null}
                    </TableRow>
                </TableHead>
                <TableBody>                                 

                    {/* -------- Documents --------- */}

                    {tableContent?.tableContent?.candidateData?.documents?.recording?.recording ? (

                    <TableRow
                        key="recording"
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        {tableContent?.tableContent?.candidateData?.documents?.recording?.recording !== null ? (
                            <TableCell component="th" scope="row">
                                {tableContent?.tableContent?.candidateData?.created_by?.member?.first_name + " " + tableContent?.tableContent?.candidateData?.created_by?.member?.last_name }                                
                            </TableCell>

                        ) : null }                               

                        <TableCell> 
                        {tableContent?.tableContent?.candidateData?.documents?.recording && tableContent?.tableContent?.candidateData?.documents?.recording?.recording !== null ? "INITIAL RECORDING" : ''} 
                        </TableCell>
                        <TableCell>
                        <a href={constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + `${tableContent?.tableContent?.candidateData?.documents?.recording?.recording}`} 
                            target="_blank" style={{color: "brown", fontWeight: "italic"}
                        }>                        
                        {tableContent?.tableContent?.candidateData?.documents?.recording?.recording}
                        </a>
                        </TableCell>
                        <TableCell>{Math.round(tableContent?.tableContent?.candidateData?.documents?.recording?.size * 0.001).toFixed(1)}</TableCell>
                        <TableCell>{tableContent?.tableContent?.candidateData?.documents?.recording?.recording_uploaded_on}</TableCell>
                        <TableCell>
                        {tableContent?.tableContent?.candidateData?.documents?.recording?.recording ? (
                            userInfo?.role !== 'BU_HEAD' ?
                            <Button color="error" onClick={() => handleFileDelete('RECORDING')}>
                                <DeleteIcon  fontSize="medium"  />
                            </Button> : null) : null }
                        </TableCell>

                    </TableRow> ) : null }

                    {/* -------- resume --------- */}

                    {tableContent?.tableContent?.candidateData?.resume?.resume_file ? (

                    <TableRow
                        key="resume"
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        {tableContent?.tableContent?.candidateData?.resume && tableContent?.tableContent?.candidateData?.resume?.resume_file !== '' ? (
                            <TableCell component="th" scope="row">
                                {tableContent?.tableContent?.candidateData?.created_by?.member?.first_name + " " + tableContent?.tableContent?.candidateData?.created_by?.member?.last_name}
                            </TableCell>

                        ) : null }  

                        <TableCell>                         
                        {tableContent?.tableContent?.candidateData?.resume && tableContent?.tableContent?.candidateData?.resume?.resume_file !== '' ? "RESUME" : ''} 
                        
                        </TableCell>
                        <TableCell>
                        <a href={constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + `${tableContent?.tableContent?.candidateData?.resume?.resume_file}`} 
                            target="_blank" style={{color: "brown", fontWeight: "italic"}
                        }>
                            {tableContent?.tableContent?.candidateData?.resume?.resume_file}
                        </a>    
                        </TableCell>
                        <TableCell>{Math.round(tableContent?.tableContent?.candidateData?.resume?.size * 0.001).toFixed(1)}</TableCell>
                        <TableCell>{tableContent?.tableContent?.candidateData?.resume?.modified}</TableCell>
                        <TableCell>
                        {tableContent?.tableContent?.candidateData?.resume?.resume_file ? (
                            userInfo?.role !== 'BU_HEAD' ?
                            <Button color="error" onClick={() => handleFileDelete('RESUME')}>
                                <DeleteIcon  fontSize="medium"  />
                            </Button> : null ) : null }
                        </TableCell>

                    </TableRow>  ) : null }    

                    {/* -------- photo_id --------- */}

                    {tableContent?.tableContent?.candidateData?.documents?.photo_id?.photo_id ? (
                    <TableRow
                        key="photo_id"
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        {tableContent?.tableContent?.candidateData?.documents?.photo_id && tableContent?.tableContent?.candidateData?.documents?.photo_id?.photo_id !== null ? (
                            <TableCell component="th" scope="row">
                                {tableContent?.tableContent?.candidateData?.created_by?.member?.first_name + " " + tableContent?.tableContent?.candidateData?.created_by?.member?.last_name }
                            </TableCell>

                        ) : null
                            
                        }
                        <TableCell>
                        {tableContent?.tableContent?.candidateData?.documents?.photo_id && tableContent?.tableContent?.candidateData?.documents?.photo_id?.photo_id !== null ? "PHOTO ID" : ''} 
                        </TableCell>
                        <TableCell>
                        <a href={constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + `${tableContent?.tableContent?.candidateData?.documents?.photo_id?.photo_id}`} 
                            target="_blank" style={{color: "brown", fontWeight: "italic"}
                        }>                       
                        {tableContent?.tableContent?.candidateData?.documents?.photo_id?.photo_id}
                        </a>
                        </TableCell>
                        <TableCell>{Math.round(tableContent?.tableContent?.candidateData?.documents?.photo_id?.size * 0.001).toFixed(1)}  </TableCell>
                        <TableCell>{tableContent?.tableContent?.candidateData?.documents?.photo_id?.photo_id_uploaded_on}</TableCell>
                        <TableCell>
                        {tableContent?.tableContent?.candidateData?.documents?.photo_id?.photo_id ? (
                            userInfo?.role !== 'BU_HEAD' ?
                            <Button color="error" onClick={() => handleFileDelete('PHOTOID')}>
                                <DeleteIcon  fontSize="medium"  />
                            </Button> : null) : null }
                        </TableCell>


                    </TableRow> ) : null }
                    
                    {/* -------- offer_letter --------- */}

                    {tableContent?.tableContent?.candidateData?.documents?.offer_letter?.offer_letter ? (
                    <TableRow
                        key="offer_letter"
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        {tableContent?.tableContent?.candidateData?.documents?.offer_letter && tableContent?.tableContent?.candidateData?.documents?.offer_letter?.offer_letter !== null ? (
                            <TableCell component="th" scope="row">
                                {tableContent?.tableContent?.candidateData?.created_by?.member?.first_name + " " + tableContent?.tableContent?.candidateData?.created_by?.member?.last_name }
                            </TableCell>

                        ) : null  }
                        <TableCell> 
                        
                        {tableContent?.tableContent?.candidateData?.documents?.offer_letter?.offer_letter !== null ? "OFFER LETTER" : ''} 
                        </TableCell>
                        <TableCell>
                            <a href={constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + `${tableContent?.tableContent?.candidateData?.documents?.offer_letter?.offer_letter}`} 
                            target="_blank" style={{color: "brown", fontWeight: "italic"}}>
                                {tableContent?.tableContent?.candidateData?.documents?.offer_letter?.offer_letter}
                            </a>
                        </TableCell>
                        <TableCell>{Math.round(tableContent?.tableContent?.candidateData?.documents?.offer_letter?.size * 0.001).toFixed(1)}</TableCell>
                        <TableCell>{tableContent?.tableContent?.candidateData?.documents?.offer_letter?.offer_letter_uploaded_on}</TableCell>
                        <TableCell>
                        {tableContent?.tableContent?.candidateData?.documents?.offer_letter?.offer_letter ? (
                            userInfo?.role !== 'BU_HEAD' ?
                            <Button color="error" onClick={() => handleFileDelete('OFFERLETTER')}>
                                <DeleteIcon  fontSize="medium"  />
                            </Button> : null) : null }
                        </TableCell>

                    </TableRow> ) : null }

                    {/* -------- payslips --------- */}


                    {tableContent?.tableContent?.candidateData?.payslips?.map((row, i) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                { row.payslip ?
                                tableContent?.tableContent?.candidateData?.created_by?.member?.first_name + " " + tableContent?.tableContent?.candidateData?.created_by?.member?.last_name :null}
                            </TableCell>
                            <TableCell> {row.payslip ? "PAYSLIP" : null }</TableCell>
                            <TableCell>
                            <a href={constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + `${row.payslip}`} 
                            target="_blank" style={{color: "brown", fontWeight: "italic"}}>
                                {row.payslip}
                            </a>
                            </TableCell>
                            <TableCell>{row.payslip ? Math.round(row.size * 0.001).toFixed(1): null}</TableCell>
                            
                            <TableCell> {row.payslip ? row.modified : null }</TableCell>

                            { i === 0 && row.payslip ?  (
                            <TableCell rowSpan={3}>
                            { userInfo?.role !== 'BU_HEAD' ?
                             <Button color="error" onClick={() => handleFileDelete('PAYSLIPS')}>
                                <DeleteIcon  fontSize="large" border={3} />
                            </Button> : null }
                            </TableCell> )
                         : null }                 
                            

                        </TableRow> 
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    );
}
