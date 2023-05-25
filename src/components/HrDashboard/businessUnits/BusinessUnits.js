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
// import UserInfo from 'src/utils/Authorization/UserInfo';
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

export default function BusinessUnits() {
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
            name: "Business Units",
            options: {
                filter: false,
                sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    var bid = tableMeta.rowData[0]
                    return (

                        <RouterLink 
                            to={`/resumeX/business-units/edit/${bid}`}
                            state={{fromPage: "business-units"}} 
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
        }
    ];

    // Linear progress bar state
    const [isLoading, setIsLoading] = useState(true)

    const [BusinessUnitsData, setBusinessUnitsData] = useState([])
    const getBusinessUnits = () => {
      axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/business-units/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
      .then((response) => {
        setBusinessUnitsData(response.data.data)
        setIsLoading(false)
      })
      .catch((e) => console.log('something went wrong :(', e));
    };
  
    useEffect(() => {
      getBusinessUnits()
    }, [])

    return (
        <Page title="Business Unit | ResumeX">
            <Container maxWidth="xl">


                <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '30px'}}>Business Unit</h2>

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
                                to="/resumeX/business-units/add-business-units/"
                                startIcon={<Icon icon={plusFill} />}
                                style={StyledButton}
                            >
                                Add Business Unit 
                            </Button>
                        }

                        data={BusinessUnitsData.slice(0).reverse().map(data => {
                            return [
                                data?.id,
                                data?.bu_name,
                                data?.created,
                                data?.modified,
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