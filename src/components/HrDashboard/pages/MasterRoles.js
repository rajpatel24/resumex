import React, { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import Page from '../../Page';
import LinearProgress from '@mui/material/LinearProgress';
import {Button,Container,Typography,} from '@mui/material';
import MUIDataTable, { ExpandButton } from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import plusFill from '@iconify/icons-eva/plus-fill';

import axios from 'axios';
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

export default function MasterRoles() {
    const [rowClickData, setRowClickData] = useState([]) 

    const options = {
        selectableRows: false, // It will turn off checkboxes in rows
        filter: false,
        download: false,
        print: false,
        filterType: "dropdown",
        responsive: "standard",
        rowHover:false,
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
            name: "Role Name",
            options: {
                filter: false,
            }
        },
        {
            name: "Is Active",
            options: {
                filter: false,
            }
        }
    ];

    // Linear progress bar state
    const [isLoading, setIsLoading] = useState(false)

    const [rolesData, setRolesData] = useState([])
    
    const getRoles = () => {
      axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/master-roles/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
      .then((response) => {
        setRolesData(response.data.data)
        setIsLoading(false)
      })
      .catch((e) => console.log('something went wrong :(', e));
    };
  
    useEffect(() => {
      getRoles()
    }, [])

    return (
        <Page title="Roles | ResumeX">
            <Container maxWidth="xl">
                {/* <Typography variant="h4" gutterBottom sx={{ mb: 5 }} align="center" >
                    Master Roles
                </Typography> */}

                <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '30px'}}>Master Roles</h2>

                {isLoading ? (
                    <Typography variant="h4" sx={{ mt: 0 }} align="center">
                        <LinearProgress />
                    </Typography>
                    ) : (
                <ThemeProvider theme={theme}>
                    <MUIDataTable
                        data={rolesData.map(data => {
                            return [
                                data?.id,
                                data?.master_role,
                                data?.is_active ? 
                                <CheckOutlinedIcon 
                                fontSize='medium' color='success' /> : 
                                <CloseRoundedIcon  
                                fontSize='medium' color='error'/>
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
