import axios from 'axios';
import Page from '../../Page';
import { Icon } from '@iconify/react';
import {useState, useEffect} from "react";
import TableRow from '@mui/material/TableRow';
import plusFill from '@iconify/icons-eva/plus-fill';
import LinearProgress from '@mui/material/LinearProgress';
import MUIDataTable, { ExpandButton } from "mui-datatables";
import { Button, Container, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import * as constants from 'src/utils/constants';
import UserInfo from 'src/utils/Authorization/UserInfo';
import { ConstructionOutlined } from '@mui/icons-material';

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

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
    }

const rows = [
    createData('Technical', 0, 0, 0, 0, 0, 0, 0, 0),
    createData('Non-Technical', 0, 0, 0, 0, 0, 0, 0, 0),
    createData('HR-Campus', 0, 0, 0, 0, 0, 0, 0, 0),
    ];

export default function DRMRequisition() {
    const navigate = useNavigate();
    // state to save requisition ID
    const [rowClickData, setRowClickData] = useState([])

    const handleOnRowClick = (rowData) => {
        setRowClickData(rowData[0])

        let requisitionTemplate = requisitionData.filter(item => {
            return item.id === rowData[0]
        })

        navigate("/resumeX/requisition/edit", {state:{
            from: requisitionTemplate, 
            office:officeLocationData,
            fsdMembers: fsdMembersData,
            technologyData: technologyData
        }})
    }

    const options = {
        selectableRows: 'none', // <===== will turn off checkboxes in rows
        filter: true,
        filterType: "dropdown",
        responsive: "standard",
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
        let candidateData = requisitionData.filter(item => {
            return item.id === rowData[0]
        })  
        return (
        <tr>
          <td colSpan={20}>
            <TableContainer style={{ width: "100%" }}>
              <Table>
                <TableHead>
                    <TableCell></TableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Mobile</StyledTableCell>
                    <StyledTableCell>Experience</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Technology</StyledTableCell>
                    <StyledTableCell>Notice Period</StyledTableCell>
                    <StyledTableCell>Current CTC</StyledTableCell>
                    <StyledTableCell>Expected CTC</StyledTableCell>
                    <StyledTableCell>Source</StyledTableCell>
                    <StyledTableCell>Current Location</StyledTableCell>
                </TableHead>
                <TableBody>
                    {candidateData[0].candidate.length > 0 ? (
                        candidateData[0].candidate.map((candidate) => (
                        <StyledTableRow>
                            <TableCell></TableCell>
                            <StyledTableCell>
                                {candidate?.job_application?.[0]?.drm_user.pk === userInfo.pk ? (
                                <RouterLink 
                                    to={`/resumeX/candidates/edit/${candidate.id}`}
                                    state={{fromPage: "drm-requisition"}} 
                                    style={{textDecoration: 'none', 
                                            color: '#00AB55', 
                                            fontWeight: 'bold'}}> 
                                    {candidate.user.first_name + " " + candidate.user.last_name}
                                </RouterLink>
                                ) : 
                                candidate?.requisition?.assigned_drm?.uid === userInfo.pk ? 
                                <RouterLink 
                                to={`/resumeX/candidates/edit/${candidate.id}`}
                                state={{fromPage: "drm-requisition"}} 
                                style={{textDecoration: 'none', 
                                        color: '#00AB55', 
                                        fontWeight: 'bold'}}> 
                                {candidate.user.first_name + " " + candidate.user.last_name}
                                </RouterLink> :

                                candidate.user.first_name + " " + candidate.user.last_name
                                
                                }                               
                            </StyledTableCell>

                            <StyledTableCell> {candidate.user.email} </StyledTableCell>
                            <StyledTableCell> {candidate.user.mobile} </StyledTableCell>
                            <StyledTableCell>{candidate.total_experience} Years</StyledTableCell>
                            <StyledTableCell>{candidate.status.status}</StyledTableCell>
                            <StyledTableCell>{candidate.technology.map(
                                (tech, index) => (index ? ', ': '') + (tech.technology_name)
                            )}
                            </StyledTableCell>

                            <StyledTableCell>{candidate?.notice_period?.notice_period}</StyledTableCell>
                            <StyledTableCell>{candidate?.current_ctc}</StyledTableCell>
                            <StyledTableCell>{candidate?.expected_ctc}</StyledTableCell>
                            <StyledTableCell>{candidate?.source?.source}</StyledTableCell>
                            <StyledTableCell>{candidate.current_location}</StyledTableCell>
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
            name: "RRF Number",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <span style={{textDecoration: 'none', color: '#00AB55', fontWeight: 'bold'}}>{value}</span>
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
            name: "Designation",
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
            name: "Requisition Type",
            options: {
                filter: true
            }
        },        
        {
            name: "Requisition Status",
            options: {
                filter: true
            }
        },
        {
            name: "Positions",
            options: {
                filter: true
            }
        },
        {
            name: "Assigned Recruiters",
            options: {
                filter: false
            }
        },
        {
            name: "Expected DOJ",
            options: {
                filter: true
            }
        },
        {
            name: "Created At",
            options: {
                filter: true
            }
        },
        {
            name: "Requisitioner",
            options: {
                filter: false
            }
        },
    ];

    // Linear progress bar state
    const [isLoading, setIsLoading] = useState(true)

    // Get requisition template data
    const [requisitionData, setRequisitionData] = useState([])

    const userInfo = UserInfo()
    const UserID = userInfo.pk;
    
    const getRequisitionData = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/requisitions/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRequisitionData(response.data.data)
            setIsLoading(false)
        })
        .catch((e) => console.log('something went wrong :(', e));
      };

    // get office locations
    const [officeLocationData, setOfficeLocationData] = useState([])
    const getOfficeLocations = () => {
      axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/office-locations/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
      .then((response) => {
        setOfficeLocationData(response.data.data)
      })
      .catch((e) => console.log('something went wrong :(', e));
    };

    // get fsd members
    const [fsdMembersData, setFsdMembers] = useState([])
    const getFsdMembers = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/fsd-members/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setFsdMembers(response.data.data)
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
    
    const getReqData = () => {
        if(userInfo.role === 'DRM'){
            let uid = userInfo.pk
            const result = requisitionData
                .map(item => ({
                    ...item,
                    children: item.assigned_fsd_user?.filter(child => child?.member?.pk === uid)
                }))
                .filter(item => item.children.length > 0)
            return result
        }
        else{
            return requisitionData
        }
    }

    useEffect(() => {
        getRequisitionData()
        getOfficeLocations()
        getFsdMembers()
        getTechnologyData()
    }, [])


    return (
        <Page title='Requisition Templates | ResumeX'>
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Assigned Requisition
                </Typography>
                {isLoading ? (
                    <Typography variant="h4" sx={{ mt: 0 }} align="center">
                        <LinearProgress />
                    </Typography>
                    ) : (
                    <ThemeProvider theme={theme}>
                        <MUIDataTable
                            data={getReqData().map(data => {
                                return [
                                    data.id,
                                    data.requisite_number,
                                    data.tech_stack.tech_stack_name,
                                    data.designation,
                                    data.bu_group.bu_name,
                                    data.requisite_type.req_type_name,
                                    data.requisite_status.requisition_status,
                                    data.positions,
                                    data.assigned_fsd_user.map(
                                        (user, index) => 
                                        (index ? ', ': '') + user.member.first_name + " " + user.member.last_name),
                                    data.expected_join_date.substring(0, 10).split('-').reverse().join('-'),
                                    data.created.substring(0, 10).split('-').reverse().join('-'),
                                    data.requisite_creator.first_name + " " +  data.requisite_creator.last_name, 
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
