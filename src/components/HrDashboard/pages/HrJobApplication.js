import axios from 'axios';
import Page from '../../Page';
import { useState } from 'react';
import React, { useEffect } from "react";
import LinearProgress from '@mui/material/LinearProgress';
import {Stack, Container, Typography} from '@mui/material';
import MUIDataTable, { ExpandButton } from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UserInfo from 'src/utils/Authorization/UserInfo';
import { apiInstance } from 'src/utils/apiAuth';


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

export default function HrJobApplication() {
    // state to save job application ID
    const [rowClickData, setRowClickData] = useState([]) 

    const options = {selectableRows: 'none', // It will turn off rows selection
        filter: true,
        filterType: "multiselect",
        responsive: "standard",
        draggableColumns: {enabled: true},
        onRowClick: (rowData) => {setRowClickData(rowData[0])},
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
                    return (
                        <a href={`/resumeX/job-application/edit/${rowClickData}`} style={{textDecoration: 'none', color: '#00AB55', fontWeight: 'bold'}}>{value}</a>
                    )
                }
            }
        },
        {
            name: "RRF Number",
            options: {
                filter: true,
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
            name: "Source",
            options: {
                filter: true
            }
        },
        {
            name: "Tech Stack",
            options: {
                filter: true
            }
        },
        {
            name: "Business Unit",
            options: {
                filter: true
            }
        },
        {
            name: "Status",
            options: {
                filter: true,
            }
        },
        {
            name: "DRM",
            options: {
                filter: true
            }
        },
        {
            name: "Application Date",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        value.substring(0, 10).split('-').reverse().join('/')
                    )
                }
            }
        }
    ];

    // Linear progress bar state
    const [isLoading, setIsLoading] = useState(true)
    const userInfo = UserInfo()
    const [jobApplicationData, setJobApplicationData] = useState([])
    const [empData, setEmpData] = useState([])

    const getJobApplication = () => 
    {
        apiInstance({
            method: "get",
            url: "job-application/",
            headers: {
                Authorization: "token " + localStorage.getItem('authToken'),
            }
        })
        .then(function (response) {
            setJobApplicationData(response.data.data)
            setIsLoading(false)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    const getEmployeeData = () => 
    {
        let user = JSON.parse(localStorage.getItem("user"))
        let user_role = user.role.role_name

        if(user_role === 'BU_HEAD')
        {
            apiInstance({
                method: "get",
                url: "employee-data/",
                headers: {
                    Authorization: "token " + localStorage.getItem('authToken'),
                }
            })
            .then(function (response) {
                var emp_info = response.data.data
                setEmpData(emp_info)
            })
            .catch((e) => console.log('something went wrong :(', e));
        }
    };

    const getJobData = () => {
        if (userInfo.role === 'BU_HEAD')
        {
            let user_bu = empData?.bu_group?.bu_name
            let filteredApps = jobApplicationData.filter((item) => item.requisition.bu_group === user_bu);
            return filteredApps            
        }
        else if(userInfo.role === 'DRM'){
            let uid = userInfo.pk
            let filteredData = jobApplicationData.filter((item) => item.drm_user?.user?.pk === uid)
            return filteredData
        }
        else{
            return jobApplicationData
        }
    }
  
    useEffect(() => {
      getJobApplication()
      getEmployeeData()
    }, [])

    return(
        <Page title="Job Application | ResumeX">
            <Container maxWidth="xl">
                {/* <Typography variant="h4" sx={{ mb: 5 }} align="center">
                    Job Applications
                </Typography> */}

                <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '30px'}}>Job Applications</h2>

                {isLoading ? (
                    <Typography variant="h4" sx={{ mt: 0 }} align="center">
                        <LinearProgress />
                    </Typography>
                    ) : (
                <ThemeProvider theme={theme}>
                    <MUIDataTable
                        // data={jobApplicationData.map(data => {
                        //     return [
                        //         data.id,
                        //         data?.resume?.candidate?.user?.first_name + " " + data?.resume?.candidate?.user?.last_name,
                        //         data.resume.candidate.requisition.requisite_number,
                        //         data.resume.candidate.user.email,
                        //         data.resume.candidate.user.mobile,
                        //         data.resume.candidate.source.source,
                        //         data.resume.candidate.requisition.bu_group,
                        //         data.resume.candidate.status.status,
                        //         data.created
                        //     ]
                        // })}
                        data={getJobData().slice(0).reverse().map(data => {
                            return [
                                data.id,
                                data?.resume?.candidate?.user?.first_name + " " + data?.resume?.candidate?.user?.last_name,
                                data.requisition.requisite_number,
                                data.resume.candidate.user.email,
                                data.resume.candidate.user.mobile,
                                data.resume?.candidate?.source?.source,
                                data.requisition.tech_stack.tech_stack_name,
                                data.requisition.bu_group,
                                data.resume?.candidate?.status?.status,
                                data.drm_user?.user ? data.drm_user?.user?.first_name + " " +data.drm_user?.user?.last_name : " - ",
                                data.created
                            ]
                          }
                        )}
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