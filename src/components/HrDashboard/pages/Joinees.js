import axios from 'axios';
import Page from '../../Page';
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from "react";
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import {Button,Container,Typography,} from '@mui/material';
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

const StyledButton = {
    backgroundColor: "#00AB55", 
    fontFamily: "Public Sans,sans-serif", 
    fontWeight: "700", 
    borderRadius: "8px",
    boxShadow: "0 8px 16px 0 rgb(0 171 85 / 10%)"
}

export default function Joinees() {
    // state to save candidate ID

    const options = {
        selectableRows: "none", // It will remove checkbox
        filter: true,
        filterType: "dropdown",
        responsive: "standard",
        draggableColumns: {enabled: true},
        fixedHeader: true,
        fixedSelectColumn: false,
    };
    
    const columns = [
        {
            name: "ID",
            options: {
                filter: false,
            },
        },
        {
            name: "Candidate Name",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    var jid = tableMeta.rowData[0]
                    return (
                        // <a href={`/resumeX/candidates/edit/${rowClickData}`} style={{textDecoration: 'none', color: '#00AB55', fontWeight: 'bold'}}>{value}</a>
                        <RouterLink 
                            to={`/resumeX/candidates/edit/${jid}`} 
                            state={{fromPage: "joinees"}}  
                            style={{textDecoration: 'none', 
                                    color: '#00AB55', 
                                    fontWeight: 'bold'}}
                        > 
                           {value} 
                        </RouterLink>
                    )
                },
                setCellProps: () => ({
                    style: {
                      whiteSpace: "nowrap",
                      position: "sticky",
                      left: 0,
                      background: "white",
                      zIndex: 100
                    }
                  }),
                  setCellHeaderProps: () => ({
                    style: {
                      whiteSpace: "nowrap",
                      position: "sticky",
                      left: 0,
                      background: "white",
                      zIndex: 101
                    }
                  })
            }
        },
        {
            name: "Email",
            options: {
                filter: false
            }
        },
        {
            name: "Phone Number",
            options: {
                filter: false
            }
        },
        {
            name: "Experience",
            options: {
                filter: true,
            }
        },
        {
            name: "BU",
            options: {
                filter: true,
            }
        },
        {
            name: "Department",
            options: {
                filter: true,
            }
        },
        {
            name: "RRF Number",
            options: {
                filter: true,
            }
        },  
        {
            name: "Status",
            options: {
                filter: true,
            }
        },
        {
            name: "Designation",
            options: {
                filter: true,
            }
        },
        {
            name: "Joining Date",
            options: {
                filter: true,
            }
        },   
        {
            name: "Created By",
            options: {
                filter: true,
            }
        },          
   ];

    // Linear progress bar state
    const [isLoading, setIsLoading] = useState(true)

    const [candidateData, setCandidateData] = useState([])

    const getCandidates = () => {
      axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/candidate-viewset/joinees_list/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
      .then((response) => {
        setCandidateData(response.data.data)
        setIsLoading(false)
      })
      .catch((e) => console.log('something went wrong :(', e));
    };
  
    useEffect(() => {
      getCandidates()
    }, [])

    return (
        <Page title="Joinees | ResumeX">
            <Container maxWidth="xl">
                {/* <Typography variant="h4" gutterBottom sx={{ mb: 5 }} align="center">
                    Joinees
                </Typography> */}

                <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '30px'}}>Joinees</h2>

                {isLoading ? (
                    <Typography variant="h4" sx={{ mt: 0 }} align="center">
                        <LinearProgress />
                    </Typography>
                    ) : (
                <ThemeProvider theme={theme}>
                    <MUIDataTable
                        data={candidateData?.slice(0).reverse().map(data => {
                            return [
                                data.id,
                                // {name: data.user?.first_name + " " + data.user?.last_name, uid: data.id},
                                data.user?.first_name + " " + data.user?.last_name,
                                data.user.email,
                                data.user.mobile,
                                data.total_experience,
                                data.requisition.bu_group,
                                data.requisition.department,
                                data.requisition.requisite_number,
                                data.status.status,
                                data.requisition.designation,
                                data.onboard_details.join_date,   
                                data.created_by?.member?.first_name + " " + data.created_by?.member?.last_name,
                               
                            ]
                        })}
                        columns={columns}
                        options={options}
                        components={components}
                    />
                </ThemeProvider>
                )}   
            </Container>
        </Page>
    )
}