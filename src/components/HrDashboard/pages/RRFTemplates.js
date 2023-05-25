import {useState, useEffect} from "react";
import Page from '../../Page';
import { Button, Container, Typography } from '@mui/material';
import MUIDataTable, { ExpandButton } from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';

import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import * as constants from "src/utils/constants";

const theme = createTheme({
    components: {
        MUIDataTable: {
        styleOverrides: {
            root: {
            backgroundColor: 'white',
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
            backgroundColor: 'rgb(0 171 85)',
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#00AB55",
        color: theme.palette.common.white,
        fontWeight: "bold",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
    }));
    
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 1,
    },
}));

export default function RRFTemplates() {
    const navigate = useNavigate();

    // state to save requisition template ID
    const [rowClickData, setRowClickData] = useState([])

    const handleOnRowClick = (rowData) => {
        setRowClickData(rowData[0])

        let requisitionTemplate = requisitionTemplateData.filter(item => {
            return item.id === rowData[0]
        })

        navigate("/resumeX/rrf-templates/edit", {state:{
            requisitionTemplate: requisitionTemplate,
            technologyData: technologyData
        }})
    }    

    const options = {
        selectableRows: false, // <===== will turn off checkboxes in rows
        filter: true,
        filterType: "multiselect",
        responsive: "standard",
        download: false,
        print: false,
        draggableColumns: {enabled: true},
        onRowClick: (rowData) => {handleOnRowClick(rowData)},
        expandableRows: true,
        expandableRowsHeader: false,
        expandableRowsOnClick: false,
        isRowExpandable: (dataIndex, expandedRows) => {
        //   if (dataIndex === 3 || dataIndex === 4) return false;
    
            // Prevent expand/collapse of any row if there are 4 rows expanded already (but allow those already expanded to be collapsed)
            if (
                expandedRows.data.length > 4 &&
                expandedRows.data.filter((d) => d.dataIndex === dataIndex).length === 0
            )
            return false;
            return true;
        },

        customToolbarSelect: () => {},
    
    renderExpandableRow: (rowData, rowMeta) => {
        const colSpan = rowData.length + 1;
        
        let requisitions = requisitionData.filter(item => {
            return item.rrf_template === rowData[0]
        })
        
        return (
            <tr>
            <td colSpan={9}>
              <TableContainer style={{ width: "100%" }}>
                <Table>
                  <TableHead>
                      <TableCell></TableCell>
                      <StyledTableCell>RRF Number</StyledTableCell>
                      <StyledTableCell>Requisitioner</StyledTableCell>
                      <StyledTableCell>Technology Stack</StyledTableCell>
                      <StyledTableCell>Business Unit</StyledTableCell>
                      <StyledTableCell>Requisition Date</StyledTableCell>
                      <StyledTableCell>Expected DOJ</StyledTableCell>
                  </TableHead>
                  <TableBody>
                      {requisitions.length > 0 ? (
                          requisitions.map((requisition) => (
                          <StyledTableRow>
                              <TableCell></TableCell>
                              <StyledTableCell><font style={{color: "#00AB55", fontWeight: "bolder"}}>{requisition.requisite_number}</font></StyledTableCell>
                              <StyledTableCell>{requisition.requisite_creator.first_name + " " +  requisition.requisite_creator.last_name}</StyledTableCell>
                              <StyledTableCell>{requisition.tech_stack.tech_stack_name}</StyledTableCell>
                              <StyledTableCell>{requisition.bu_group.bu_name}</StyledTableCell>
                              <StyledTableCell>{requisition.created.substring(0, 10).split('-').reverse().join('-')}</StyledTableCell>
                              <StyledTableCell>{requisition.expected_join_date.substring(0, 10).split('-').reverse().join('-')}
                              </StyledTableCell>
                          </StyledTableRow>
                          ))) : (
                          <StyledTableRow>
                              <StyledTableCell>No Data Available</StyledTableCell>
                          </StyledTableRow>
                          )
                      }
                  </TableBody>
              </Table>
              </TableContainer>
          </td>
          </tr>
        );
    },
    
    onRowExpansionChange: (curExpanded, allExpanded, rowsExpanded) =>
        console.log(curExpanded, allExpanded, rowsExpanded)
    };

    const columns = [
        {
            name: "ID",
            options: {
                filter: false
            }
        },
        {
            name: "Job Name",
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
            name: "Technology Stack",
            options: {
                filter: true
            }
        },
        {
            name: "Default FSD Members",
            options: {
                filter: false
            }
        },
        {
            name: "Primary Technology",
            options: {
                filter: true
            }
        },
        {
            name: "Required Experience",
            options: {
                filter: true
            }
        },
        {
            name: "Department",
            options: {
                filter: true
            }
        }
    ];

    // Linear progress bar state
    const [isLoading, setIsLoading] = useState(true)

    // Get requisition template data
    const [requisitionTemplateData, setRequisitionTemplateData] = useState([])
    
    const getRequisitionTemplateData = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/requisition-template/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRequisitionTemplateData(response.data.data)
            setIsLoading(false)            
        })
        .catch((e) => console.log('something went wrong :(', e));
      };

    // Get requisition data
    const [requisitionData, setRequisitionData] = useState([])

    const getRequisitionData = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/requisitions/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRequisitionData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    // technology data state
    const [technologyData, setTechnologyData] = useState([])

    const getTechnologyData = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/technology/', {headers: {"Authorization": `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setTechnologyData(response.data.data)
        })
        .catch((e) => console.log('something went wrong (:', e));
    };      

    useEffect(() => {
        getRequisitionTemplateData()
        getTechnologyData()
        getRequisitionData()
    }, [])

    return (
        <Page title='Requisition Templates | ResumeX'>
            <Container maxWidth="xl">

                <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '30px'}}>Requisition Template</h2>

                {/* <Typography variant="h4" sx={{ mb: 5 }} align="center">
                    Requisition Template
                </Typography> */}

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
                                startIcon={<Icon icon={plusFill} />} 
                                style={StyledButton}
                                component={RouterLink}
                                to="/resumeX/rrf-templates/create"
                                >
                                    Create RRF Template
                            </Button>
                            }
                            data={requisitionTemplateData.slice(0).reverse().map(data => {
                                return [
                                    data.id,
                                    data.job_name,
                                    data.tech_stack.tech_stack_name,
                                    data.fsd_members.recruiters.map(
                                        (user, index) => (index ? ', ': '') + user.member.first_name + " " + user.member.last_name),
                                    data.primary_technology?.map(
                                        (technology, index) => (index ? ', ': '') + technology.technology_name),
                                    data.job_exp,
                                    data.department.job_category_name
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
    );
}