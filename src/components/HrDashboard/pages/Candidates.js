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
import UserInfo from 'src/utils/Authorization/UserInfo';
import _ from 'lodash';


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

export default function Candidates() {
    const userInfo = UserInfo()
    // state to save candidate ID
    const [rowClickData, setRowClickData] = useState([]) 

    const options = {
        selectableRows: false, // It will turn off checkboxes in rows
        filter: true,
        filterType: "dropdown",
        responsive: "standard",
        draggableColumns: {enabled: true},
        onRowClick: (rowData) => {setRowClickData(rowData[0])},
        print: false,
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
                filter: false,
                sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    var cid = tableMeta.rowData[0]
                    return (
                        // <a href={`/resumeX/candidates/edit/${rowClickData}`} style={{textDecoration: 'none', color: '#00AB55', fontWeight: 'bold'}}>{value}</a>

                        <RouterLink 
                            to={`/resumeX/candidates/edit/${cid}`}
                            state={{fromPage: "candidates"}} 
                            style={{textDecoration: 'none', 
                                    color: '#00AB55', 
                                    fontWeight: 'bold'}}> 
                            {value}
                        </RouterLink>
                    )
                }
            }
        },
        {
            name: "RRF Number",
            options: {
                filter: false,
            }
        },
        {
            name: "Project",
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
            name: "Status",
            options: {
                filter: true,
            }
        },
        {
            name: "Notice Period",
            options: {
                filter: true,
            }
        },
        {
            name: "Created By",
            options: {
                filter: true,
            }
        }
    ];

    // Linear progress bar state
    const [isLoading, setIsLoading] = useState(true)

    const [candidateData, setCandidateData] = useState([])
    const getCandidates = () => {
      axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/candidate-viewset/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
      .then((response) => {
        setCandidateData(response.data.data)
        setIsLoading(false)
      })
      .catch((e) => console.log('something went wrong :(', e));
    };

    const getCandData = () => {
        if(userInfo.role === 'DRM')
        {
            let uid = userInfo.pk
            const result = candidateData
                .map(item => ({
                    ...item,
                    children: item.job_application?.filter(child => child?.drm_user?.pk === uid)
                }))
                .filter(item => item.children.length > 0)
            
            const userRecords = candidateData.filter(cand => cand.created_by?.member?.pk === uid)

            // By Using Loadash Library
            const mergedData = _.unionBy(result, userRecords, "created_by")

            // Another way of merging
            // var ids = new Set(userRecords.map(d => d.id));
            // var merged = [...userRecords, ...result.filter(d => !ids.has(d.id))];
            // console.log("\n\n merged --> ", merged)
            
            // return result
            return mergedData

        }
        else{
            return candidateData
        }
    }
  
    useEffect(() => {
      getCandidates()
    }, [])

    return (
        <Page title="Candidates | ResumeX">
            <Container maxWidth="xl">
                {/* <Typography variant="h4" sx={{ mb: 5 }} align="center">
                Candidates
                </Typography> */}

                <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '30px'}}>Candidates</h2>

                {isLoading ? (
                    <Typography variant="h4" sx={{ mt: 0 }} align="center">
                        <LinearProgress />
                    </Typography>
                    ) : (
                <ThemeProvider theme={theme}>
                    <MUIDataTable
                        title={
                            <Button
                                variant="contained"
                                component={RouterLink}
                                to="/resumeX/candidates/create-candidate/"
                                startIcon={<Icon icon={plusFill} />}
                                style={StyledButton}
                            >
                                Create Candidate
                            </Button>
                        }
                        // data={candidateData.map(data => {
                        //     return [
                        //         data?.id,
                        //         {name: data?.user?.first_name + " " + data?.user?.last_name, uid: data?.id},
                        //         data?.requisition?.requisite_number,
                        //         data?.requisition?.bu_group,
                        //         data?.user?.email,
                        //         data?.user?.mobile,
                        //         data?.source?.source,
                        //         data?.status?.status,
                        //         data?.created_by?.member?.first_name + " " + data?.created_by?.member?.last_name
                        //     ]
                        // })}
                        data={getCandData().slice(0).reverse().map(data => {
                            return [
                                data?.id,
                                // {name: data?.user?.first_name + " " + data?.user?.last_name, uid: data?.id},
                                data?.user?.first_name + " " + data?.user?.last_name,
                                data?.requisition?.requisite_number,
                                data?.requisition?.project_name,
                                data?.requisition?.bu_group,
                                data?.user?.email,
                                data?.user?.mobile,
                                data?.source?.source,
                                data?.status?.status,
                                data?.notice_period?.notice_period,
                                data?.created_by.member ? data?.created_by?.member?.first_name + " " + data?.created_by?.member?.last_name : "PORTAL"
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