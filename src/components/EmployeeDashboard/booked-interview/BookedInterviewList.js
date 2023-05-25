import axios from 'axios';
import {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import MUIDataTable, { ExpandButton } from "mui-datatables";
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

const components = {
    ExpandButton: function (props) {
        return <ExpandButton {...props} />;
    }
};

export default function BookedInterviewList() {
    const navigate = useNavigate();
    const handleOnRowClick = (rowData) => {
        navigate("/employee-dashboard/booked-interview/candidate-interview", {state:{
            id: rowData[0],
            jobApplicationId: rowData[1]
        }})
    }   

    const options = {
        selectableRows: false,
        filter: true,
        filterType: "multiselect",
        responsive: "standard",
        download: false,
        print: false,
        draggableColumns: {enabled: true},
        onRowClick: (rowData) => {handleOnRowClick(rowData)},
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
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <a href="" style={{textDecoration: 'none', color: '#00AB55', fontWeight: 'bold'}}>{value}</a>
                    )
                }
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
        employeeData.booked_interviews.forEach(data => (data.interview_status=='CONFIRMED' && data.interview_feedback==null) ? 
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

    return(
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
                    data.start,
                    data.status
                ]
            })}
            columns={columns}
            options={options}
            components={components}
        />
        </ThemeProvider>   
    )
}