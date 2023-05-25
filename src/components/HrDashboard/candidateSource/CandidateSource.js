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
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
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

export default function CandidateSource() {
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
            name: "Candidate Source",
            options: {
                filter: false,
                sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    var sid = tableMeta.rowData[0]
                    return (

                        <RouterLink 
                            to={`/resumeX/candidate-source/edit/${sid}`}
                            state={{fromPage: "candidate-source"}} 
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
            name: "Created",
            options: {
                filter: false,
            }
        },
        {
            name: "Modified",
            options: {
                filter: true,
            }
        },
        {
            name: "Active",
            options: {
              filter: true,
              customFilterListOptions: { render: v => `Is Active: ${v}` },
              customBodyRender: (value, tableMeta, updateValue) => {
                          if (value) 
                           return <CheckOutlinedIcon 
                          fontSize='medium' color='success' />
                          else
                           return <CloseRoundedIcon  
                              fontSize='medium' color='error'/>
                      }                
          }
        }
    ];

    // Linear progress bar state
    const [isLoading, setIsLoading] = useState(true)

    const [candidateSourceData, setCandidateSourceData] = useState([])
    const getcandidateSources = () => {
      axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/candidate-source/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
      .then((response) => {
        setCandidateSourceData(response.data.data)
        setIsLoading(false)
      })
      .catch((e) => console.log('something went wrong :(', e));
    };
  
    useEffect(() => {
      getcandidateSources()
    }, [])

    return (
        <Page title="Candidate Source | ResumeX">
            <Container maxWidth="xl">


                <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '30px'}}>Candidate Source</h2>

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
                                to="/resumeX/candidate-source/add-candidate-source/"
                                startIcon={<Icon icon={plusFill} />}
                                style={StyledButton}
                            >
                                Add Candidate Source
                            </Button>
                        }

                        data={candidateSourceData.slice(0).reverse().map(data => {
                            return [
                                data?.id,
                                data?.source,
                                data?.created,
                                data?.modified,
                                data?.is_active,
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