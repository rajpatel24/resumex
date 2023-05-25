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
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import * as constants from 'src/utils/constants';

// ----------------------------------------------------------------------


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

export default function FSDUsers() {
  const [rowClickData, setRowClickData] = useState([]) 

  const options = {
      selectableRows: false, // It will turn off checkboxes in rows
      filter: true,
      filterType: "dropdown",
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
        name: "Name",
        options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {
                var fid = tableMeta.rowData[0]
                return (
                    // <a href={`/resumeX/fsdusers/edit/${rowClickData}`} style={{textDecoration: 'none', color: '#00AB55', fontWeight: 'bold'}}>{value}</a>
                   
                    <RouterLink to={`/resumeX/fsdusers/edit/${fid}`}  style={{textDecoration: 'none', color: '#00AB55', fontWeight: 'bold'}}> {value}</RouterLink>
                )
            }
        }
    },
    {
        name: "Email",
        options: {
              filter: false,
          }
    },
    {
        name: "Mobile",
        options: {
              filter: false,
          }
    },
    {
        name: "Bu Group",
        options: {
              filter: true,
          }
    },
    {
        name: "Interview Role",
        options: {
              filter: true,
          }
    },
    {
          name: "Role",
          options: {
              filter: true,
          }
    },      
    {
          name: "IsActive",
          options: {
              filter: true,
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                    value === true ? <CheckIcon fontSize='medium' color='success' /> : < ClearIcon  fontSize='medium' color='error'/>
                )
            }
          }
    }
  ];

    // Linear progress bar state
    const [isLoading, setIsLoading] = useState(true)
  

    const [ UserData, setUserData] = useState([])

    const getUser = () => {
      axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/fsd-members/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
      .then((response) => {
        setUserData(response.data.data)
        setIsLoading(false)
      })
      .catch((e) => console.log('something went wrong :(', e));
    };
  
    useEffect(() => {
      getUser()
    }, [])

    return(

      <Page title="FSD Members | ResumeX">
      <Container maxWidth="xl">
          <Typography variant="h4" gutterBottom sx={{ mb: 5 }} align="center">
            FSD Members
          </Typography>

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
                                to="/resumeX/fsdusers/fsd-create-user/"
                                startIcon={<Icon icon={plusFill} />}
                                style={StyledButton}
                            >
                               Add FSD Member
                                </Button>
                        }
                          
                        data={UserData.slice(0).reverse().map(data => {
                            return [
                                data?.id,
                                // {name: data?.member?.first_name + " " + data?.member?.last_name, uid: data?.id},
                                data?.member?.first_name + " " + data?.member?.last_name,
                                data?.member?.email,
                                data?.member?.mobile,
                                data?.bu_group?.bu_name,
                                data?.interview_role?.interview_role,
                                data?.member?.role?.role_name,
                                data?.member?.is_active
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