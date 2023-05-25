import Page from '../../Page';
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from "react";
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import {Button,Container,Typography,} from '@mui/material';
import MUIDataTable, { ExpandButton } from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    TableRow,
    TableCell,
    TableFooter
  } from "@mui/material";


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

const StyledButton = {
    backgroundColor: "#00AB55", 
    fontFamily: "Public Sans,sans-serif", 
    fontWeight: "700", 
    borderRadius: "8px",
    boxShadow: "0 8px 16px 0 rgb(0 171 85 / 10%)"
}

export default function JoineesList(data) {
    const [rowClickData, setRowClickData] = useState([]) 

    const options = {
        selectableRows: "none",
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
                  <TableCell> <b> Total Joinees: &nbsp; {count} </b></TableCell>
                </TableRow>
              </TableFooter>
            );
          },
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
                        // <a href={`/resumeX/candidates/edit/${rowClickData}`} style={{textDecoration: 'none', color: '#00AB55', fontWeight: 'bold'}}>{value}</a>
                        <RouterLink 
                                to={`/resumeX/candidates/edit/${value.uid}`} state={{fromPage: "app"}}  
                                style={{textDecoration: 'none', 
                                color: '#00AB55', fontWeight: 'bold'}} > 
                            {value.name}
                        </RouterLink>
                    )
                },
            }
        },
        {
            name: "Email",
            options: {
                filter: true,
            }
        }, 
        {
            name: "Mobile",
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
            name: "Status",
            options: {
                filter: true,
            }
        },
             
    ];

    return (
        <Page title="Dashboard | ResumeX">
            <Container maxWidth="xl">

            <ThemeProvider theme={theme}>
                <MUIDataTable
                    data={data.data?.map(data => {
                        return [
                            data.pk,
                            {name: data.Name, uid: data.pk},
                            data.Email,
                            data.Mobile,
                            data.Doj,
                            data.Status,
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