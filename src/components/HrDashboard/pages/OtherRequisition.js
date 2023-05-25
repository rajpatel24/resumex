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
import { Padding } from '@mui/icons-material';
import { apiInstance } from 'src/utils/apiAuth';
import UserInfo from 'src/utils/Authorization/UserInfo';

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

export default function OtherRequisition() {
    const navigate = useNavigate();
    // state to save requisition ID
    const [rowClickData, setRowClickData] = useState([])
    const [empData, setEmpData] = useState([])
    const userInfo = UserInfo()

    const handleOnRowClick = (rowData) => {
        setRowClickData(rowData[0])
    
        let requisitionTemplate = requisitionData.filter(item => {
            return item.id === rowData[0]
        })
    
        navigate("/resumeX/requisition/edit", {state:{
            from: requisitionTemplate, 
            office:officeLocationData,
            fsdMembers: fsdMembersData,
            technologyData: technologyData,
            fromPage: "OtherRequisition"
        }})
    }

    const options = {
        selectableRows: "none", // <===== will turn off checkboxes in rows
        filter: true,
        filterType: "multiselect",
        responsive: "standard",
        onRowClick: (rowData) => {handleOnRowClick(rowData)},
        download: false,
        print: false,
        draggableColumns: {enabled: true},
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
          <td colSpan={15}>
            <TableContainer style={{ width: "100%" }}>
              <Table>
                <TableHead>
                    <TableCell></TableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Experience</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Technology</StyledTableCell>
                    <StyledTableCell>Notice Period</StyledTableCell>
                    <StyledTableCell>Expected CTC</StyledTableCell>
                    <StyledTableCell>Source</StyledTableCell>
                    <StyledTableCell>Current Location</StyledTableCell>
                    <StyledTableCell>Preferred Location</StyledTableCell>
                </TableHead>
                <TableBody>
                    {candidateData[0].candidate.length > 0 ? (
                        candidateData[0].candidate.map((candidate) => (
                        <StyledTableRow>
                            <TableCell></TableCell>
                            <StyledTableCell>
                                {/* 
                                <a href={`/resumeX/candidates/edit/${candidate.id}`} 
                                style={{textDecoration: 'none', 
                                        color: '#00AB55', 
                                        fontWeight: 'bold'}}
                                >
                                    {candidate.user.first_name + " " + candidate.user.last_name}
                                </a> */}
                                <RouterLink 
                                to={`/resumeX/candidates/edit/${candidate.id}`} state={{fromPage: "OtherRequisition"}}  
                                style={{textDecoration: 'none', 
                                color: '#00AB55', fontWeight: 'bold'}}> 
                                {candidate.user.first_name + " " + candidate.user.last_name} 
                                </RouterLink>
                            </StyledTableCell>
                            <StyledTableCell>{candidate.total_experience} Years</StyledTableCell>
                            <StyledTableCell>{candidate.status.status}</StyledTableCell>
                            <StyledTableCell>{candidate.technology.map(
                                (tech, index) => (index ? ', ': '') + (tech.technology_name)
                            )}
                            </StyledTableCell>
                            <StyledTableCell>{candidate?.notice_period?.notice_period}</StyledTableCell>
                            <StyledTableCell>{candidate?.expected_ctc}</StyledTableCell>
                            <StyledTableCell>{candidate?.source?.source}</StyledTableCell>
                            <StyledTableCell>{candidate.current_location}</StyledTableCell>
                            <StyledTableCell>{candidate.preferred_location.map(
                                (tech, index) => (index ? ', ': '') + (tech.office_location)
                            )}
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
            name: "RRF Number",
            options: {                
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        // <span style={{textDecoration: 'none', color: '#00AB55', fontWeight: 'bold'}}>{value}</span>
                        <a href="" style={{textDecoration: 'none', color: '#00AB55', fontWeight: 'bold'}}>{value}</a>
                    )
                }
            },            
        },
        {
            name: "Requisitioner",
            options: {
                filter: false
            }
        },
        {
            name: "Business Unit",
            options: {
                filter: false
            }
        },
        {
            name: "Requisition Date",
            options: {
                filter: true
            }
        },
        {
            name: "Expected DOJ",
            options: {
                filter: true
            }
        },
        {
            name: "Category",
            options: {
                filter: false
            }
        },
        {
            name: "Recruiters",
            options: {
                filter: false
            }
        },
        {
            name: "Project",
            options: {
                filter: false
            }
        },
        {
            name: "Technology Stack",
            options: {
                filter: true
            }
        },
        {
            name: "Type",
            options: {
                filter: true
            }
        },
        {
            name: "Status",
            options: {
                filter: true
            }
        },
    ];

    //Local Username
    const local_user = JSON.parse(localStorage.getItem("user"))
    const local_username = (local_user.username);

    // Linear progress bar state
    const [isLoading, setIsLoading] = useState(true)

    // Get requisition template data
    const [requisitionData, setRequisitionData] = useState([])
    
    const getRequisitionData = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/requisitions/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {

            var filtered_OtherReqData = response.data.data.filter(data => data.requisite_creator.username != local_username).map(filtereddata => filtereddata)
            setRequisitionData(filtered_OtherReqData)
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
                localStorage.setItem("Employee_Details", JSON.stringify(emp_info))                
            })
            .catch((e) => console.log('something went wrong :(', e));
        }         

    };

    const getReqFilterData = () => {
        if (userInfo.role === 'BU_HEAD')
        {
            let user_bu = empData?.bu_group?.bu_name
            let filteredreq = requisitionData.filter((item) => item.bu_group.bu_name === user_bu);
            return filteredreq            
        }
        else{
            return requisitionData
        }
    };

    useEffect(() => {
        getRequisitionData()
        getOfficeLocations()
        getFsdMembers()
        getTechnologyData()
        getEmployeeData()
    }, [])

    return (
        <Page title='Requisition Templates | ResumeX'>
            <Container maxWidth="xl">

                <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '30px'}}>Other Requisitions</h2>

                {/* <Typography variant="h4" sx={{ mb: 5 }} align="center">
                    Other Requisitions
                </Typography> */}
{/* 
                <div>
                    <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700, mb: 5 }} aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell>Department</StyledTableCell>
                            <StyledTableCell align="right">RRF Count</StyledTableCell>
                            <StyledTableCell align="right">Requisitioned&nbsp;</StyledTableCell>
                            <StyledTableCell align="right">Processed&nbsp;</StyledTableCell>
                            <StyledTableCell align="right">In Process&nbsp;</StyledTableCell>
                            <StyledTableCell align="right">Pending&nbsp;</StyledTableCell>
                            <StyledTableCell align="right">Offer Accepted&nbsp;</StyledTableCell>
                            <StyledTableCell align="right">Joined&nbsp;</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.name}>
                            <StyledTableCell component="th" scope="row">
                                {row.name}
                            </StyledTableCell>
                            <StyledTableCell align="right">{row.calories}</StyledTableCell>
                            <StyledTableCell align="right">{row.fat}</StyledTableCell>
                            <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                            <StyledTableCell align="right">{row.calories}</StyledTableCell>
                            <StyledTableCell align="right">{row.fat}</StyledTableCell>
                            <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                            <StyledTableCell align="right">{row.calories}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </div>  */}

                {isLoading ? (
                    <Typography variant="h4" sx={{ mt: 0, paddingTop: "-10px" }} align="center">
                        <LinearProgress />
                    </Typography>
                    ) : (
                    <ThemeProvider theme={theme}>
                        <MUIDataTable
                            // data={requisitionData.map(data => {
                            //     return [
                            //         data.id,
                            //         data.requisite_number, 
                            //         data.tech_stack.tech_stack_name,
                            //         data.requisite_type.req_type_name,
                            //         data.requisite_status.requisition_status,
                            //         data.default_fsd_users.recruiters.map(
                            //             (user, index) => (index ? ', ': '') + user.member.first_name + " " + user.member.last_name),
                            //         data.department.job_category_name,
                            //         data.expected_join_date.substring(0, 10).split('-').reverse().join('-'),
                            //         data.bu_group.bu_name,
                            //         data.requisite_creator.first_name + " " +  data.requisite_creator.last_name,
                            //         data.created.substring(0, 10).split('-').reverse().join('-'),
                            //     ]
                            // })}
                            data={getReqFilterData().slice(0).reverse().map(data => {
                                return [
                                data.id,
                                data.requisite_number,
                                data.requisite_creator.first_name + " " +  data.requisite_creator.last_name,
                                data.bu_group.bu_name,
                                data.created.substring(0, 10).split('-').reverse().join('-'),
                                data.expected_join_date.substring(0, 10).split('-').reverse().join('-'),
                                data.department.job_category_name,
                                data.default_fsd_users.recruiters.map(
                                    (user, index) => (index ? ', ': '') + user.member.first_name + " " + user.member.last_name),
                                data.project_name,
                                data.tech_stack.tech_stack_name,
                                data.requisite_type.req_type_name,
                                data.requisite_status.requisition_status,
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
