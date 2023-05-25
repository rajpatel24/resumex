import Page from '../../Page';
import React, { useState } from "react";
import {Container} from '@mui/material';
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    TableRow,
    TableCell,
    TableFooter
  } from "@mui/material";
  import { useNavigate } from 'react-router-dom';


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
        iconActive: {
                display: 'none',
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

export default function InterviewListDialog(data) {
    const navigate = useNavigate();

    const [rowClickData, setRowClickData] = useState([])

    const handleOnRowClick = (rowData) => {
        navigate("/employee-dashboard/booked-interview/candidate-interview", {state:{
            id: rowData[0],
            jobApplicationId: rowData[1]
        }})
    } 

    const options = {
        selectableRows: false,
        filter: false,
        print: false,
        download: false,
        responsive: "standard",
        fixedHeader: true,
        fixedSelectColumn: false,
        viewColumns: false,
        customFooter: (
            count,
            page,
            rowsPerPage,
            changeRowsPerPage,
            changePage
          ) => {
            return(
                <TableFooter>
                <TableRow>
                  <TableCell> <b> Total: &nbsp; {count} </b></TableCell>
                </TableRow>
              </TableFooter>
            );
          },
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
            name: "Interview DateTime",
            options: {
                filter: true
            }
        },
        {
            name: "Round Status",
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

    return (
        <Page title="Home | ResumeX">
            <Container maxWidth="xl">

            <ThemeProvider theme={theme}>
                <MUIDataTable
                    data={data.data?.map(data => {
                        return [
                            data.id,
                            data.jobApplicationId,
                            data.rrfNumber,
                            data.candidateName,
                            data.interviewRound,
                            data.candidateEmail,
                            data.candidatePhoneNumber,
                            new Date(data.start).toLocaleDateString() + " | " + new Date(data.start).toLocaleTimeString().substring(0, 5) ,
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