import { React } from "react";
import Page from '../../Page';
import axios from 'axios';
import {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as constants from 'src/utils/constants';

const theme = createTheme({
    components: {
        MUIDataTable: {
        styleOverrides: {
            root: {
            backgroundColor: '#red',
            },
            paper: {
            boxShadow: 'none',
            },
        },
        },
        MuiToolbar: {
        styleOverrides: {
            root: {
            // backgroundColor: 'yellow',
            },
        },
        },
        MuiTableCell: {
        styleOverrides: {
            head: {
            backgroundColor: 'purple',
            },
        },
        },
        MUIDataTableHeadCell: {
            styleOverrides: {
                root: {
                    fontWeight: '700',
                },
                data: {
                fontWeight: '700',
                }
            }
        },
        MUIDataTableSelectCell: {
        styleOverrides: {
            headerCell: {
            // backgroundColor: 'blue',
            fontWeight: '500px'
            },
        },
        },
        MuiTableFooter: {
        styleOverrides: {
            root: {
            '& .MuiToolbar-root': {
            //   backgroundColor: 'purple',
            },
            },
        },
        },
    },
});

export default function CompletedInterview() {
    const options = {
        selectableRows: false,
        filter: true,
        filterType: "multiselect",
        responsive: "standard",
        download: false,
        print: false,
        draggableColumns: {enabled: true},
    };

    const columns = [
        {
            name: "Interview ID",
            options: {
                filter: false,
                display:false
            },
        },
        {
            name: "Job Application ID",
            options: {
                filter: false,
                display:false
            },
        },
        {
            name: "RRF Number",
            options: {
                filter: true,
            },
        },
        {
            name: "Candidate Name",
            options: {
                filter: true,
            }
        },
        {
            name: "Interview Round",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <b>{value}</b>
                    )
                }
            }
        },
        {
            name: "Email",
            options: {
                filter: true
            }
        },
        {
            name: "Phone Number",
            options: {
                filter: true
            }
        },
        {
            name: "Interview Date",
            options: {
                filter: true
            }
        },
        {
            name: "Interview Status",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                       value === 'CONFIRMED' ?  <b style={{color: 'red'}}>Pending</b> : <b style={{color: 'green'}}>Completed</b> 
                    )
                }
            }
        }
    ];

    // get and save employee data
    const [employeeData, setEmployeeData] = useState([])
    const employeeDataLoad = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/employee-data/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setEmployeeData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    }

    useEffect(() => {
        employeeDataLoad()
      }, [])

    const InterviewData = []
    if (employeeData.booked_interviews)
        employeeData.booked_interviews.forEach(data => (data.interview_status=='COMPLETED') ? 
        InterviewData.push({
            id: data.id,
            jobApplicationId: data.job_application_id,
            rrfNumber: data.rrf_number,
            candidateName: data.candidate_name,
            candidateEmail: data.candidate_email,
            candidatePhoneNumber: data.candidate_number,
            interviewRound: data.interview_round,
            start: data.start_date, 
            end: data.end_date, 
            status: data.interview_status, 
            link: data.interview_moderator_link
        }) : "Not Available") 

    return (
    <Page title="Booked Interview | ResumeX">
        <Container maxWidth="xl" align="center">

            <h2 align="center" style={{fontSize: '25px', fontWeight: '800'}}>Completed Interviews</h2>

            <ThemeProvider theme={theme}>
                <MUIDataTable
                    data={InterviewData.map(data => {
                        return [
                            data.id,
                            data.jobApplicationId,
                            data.rrfNumber,
                            data.candidateName,
                            data.interviewRound,
                            data.candidateEmail,
                            data.candidatePhoneNumber,
                            data.start.substring(0, 10).split('-').reverse().join('-'),
                            data.status
                        ]
                    })}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>  
        </Container>
    </Page>
    )
}