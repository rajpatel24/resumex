import { useState, useEffect } from 'react';
import Page from '../../Page';
import axios from 'axios';
import * as constants from 'src/utils/constants';
import { Modal } from 'react-bootstrap';
import {
    Button, Card, CardContent, Container,Checkbox,
    Link, Stack, TextField, Typography,
    InputAdornment, InputLabel, MenuItem
}
    from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha, styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable, { ExpandButton } from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSnackbar } from 'notistack'
import { apiInstance } from 'src/utils/apiAuth';

//There is a Necessity for a ROLE named DRM for this to work.
export default function RRFPool() {

    // Linear progress bar state
    const [isLoading, setIsLoading] = useState(true)

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    //Get DRM Data
    const [ DRMUserData, setDRMUserData] = useState([]);

    const getDRMUserData = () => {
      axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/fsd-members/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
      .then((response) => {
        setDRMUserData(response.data.data)
      })
      .catch((e) => console.log('something went wrong :(', e));
    };

    //Get Requisition Data
    const [requisitionData, setRequisitionData] = useState([])


    const getRequisitionData = () => {
        apiInstance({
            method: "get",
            url: "requisitions/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                setRequisitionData(response.data.data)
                setIsLoading(false)    
            })
            .catch(function (error) {
                enqueueSnackbar('Something went wrong. Please try after sometime.', {
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    variant: 'error',
                    autoHideDuration: 2000,
                });

            });

    }
    

//---------------------------------------------------------------------------------------
    useEffect(() => {
        getRequisitionData();
        getDRMUserData();
    }, [])
//---------------------------------------------------------------------------------------

    let DRMuserNames = [];

    const [checked, setChecked] = useState(true);
    var RRFValue;
    var drmName;
    var thisRRFData;
    var RRFData;
    var thisDRMAssReq;
    var thisDRMAssReqName;
    var thisDRMID;

    var [ DRMValue, setDRMValue] = useState([]);

    const DRMUser = DRMUserData.filter(items => {
        if(items.member.role.role_name === "DRM"){
                DRMuserNames.push(items.id + " " + items.member.first_name + " " + items.member.last_name);
            }
        }
    )
    // const [intstatus, setIntStatus] = useState(false);

    const filterRequisitionData = requisitionData.map((item) => { if(item?.assigned_fsd_user?.length === 0){ return(item) } })
    const unAssignedReqData = filterRequisitionData.filter(function (el) { return el != null; });

    //Modal
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    //---------------FUNCTIONS-----------------------------------------------


    function handleClose(){
        setShow(false);
        thisDRMAssReq = 0 ;
    };

    function handleAssignModal(){
        // RRFvalue DRMvalue
        //thisDRMID
        const thisDRMIDList = Array.from(String(thisDRMID), Number);
        const thisJobLocList = thisRRFData?.[0]?.job_loc?.map(item => item.id)
        const thisPrimaryTechList = thisRRFData?.[0]?.primary_technology?.map(item => item.id)
        const thisOtherTechList = thisRRFData?.[0]?.other_technology?.map(item => item.id); 
        assignFSDApiCall(thisDRMIDList,thisJobLocList,thisPrimaryTechList,thisOtherTechList);
    }

    function assignFSDApiCall(thisDRMIDList,thisJobLocList,thisPrimaryTechList,thisOtherTechList){

        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
        const data = {
            rrf_template: thisRRFData?.[0]?.rrfTemplate,

            designation: thisRRFData?.[0]?.designation,
            positions: thisRRFData?.[0]?.positions,
            tech_stack_id: thisRRFData?.[0]?.tech_stack.tech_stack_id,
            default_fsd_users_id: thisRRFData?.[0]?.default_fsd_users.id,
            assigned_fsd_user_id: thisDRMIDList,
            bu_group_id: thisRRFData?.[0]?.bu_group.id,
            department_id: thisRRFData?.[0]?.department.id,
            requisite_type_id: thisRRFData?.[0]?.requisite_type.id,
            requisite_status_id: thisRRFData?.[0]?.requisite_status?.id,
            expected_join_date: thisRRFData?.[0]?.expected_join_date,
            job_name: thisRRFData?.[0]?.job_name,
            required_exp: thisRRFData?.[0]?.required_exp,
            project_name: thisRRFData?.[0]?.project_name,
            project_loc: thisRRFData?.[0]?.project_loc,
            project_duration: thisRRFData?.[0]?.project_duration,
            opportunity_id: thisRRFData?.[0]?.opportunity_id,
            project_start_date: thisRRFData?.[0]?.project_start_date,
            job_loc_id: thisJobLocList,
            max_budget: thisRRFData?.[0]?.max_budget,
            client_interview: thisRRFData?.[0]?.client_interview,
            project_sum: thisRRFData?.[0]?.project_sum,
            job_description: thisRRFData?.[0]?.job_description,
            responsibilities: thisRRFData?.[0]?.responsibilities,
            hr_summary: thisRRFData?.[0]?.hr_summary,
            comment: thisRRFData?.[0]?.comment,
            target_company: thisRRFData?.[0]?.target_company,
            reference_profile: thisRRFData?.[0]?.reference_profile,
            project_personality_traits: thisRRFData?.[0]?.project_personality_traits,
            is_active: checked,
            primary_technology_id: thisPrimaryTechList,
            other_technology_id: thisOtherTechList,
        }
        axios.put(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/requisitions/" + thisRRFData?.[0]?.id + "/", data, {headers})
        .then(function (response) {
            if (response.status === 200) {
                enqueueSnackbar("Requisition updated successfully !!", {
                    anchorOrigin: {
                                    vertical: 'top',
                                    horizontal: 'right',
                                  },
                    variant: 'success',
                    autoHideDuration: 1500,
                  });
                  navigate('/resumeX/rrfpool', {replace: true});
                  window.location.reload(false);                    
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });    
    }

    function  handleAssignDRM(){
        RRFValue = rowClickData;
        RRFData = requisitionData.map((items) => { if(items?.requisite_number === RRFValue){return(items)}else{return null} })
        thisRRFData = RRFData.filter(function (el) { return el != null; });
        
        let thisDRMIDstr = String(DRMValue).substring(0,1);
        thisDRMID = parseInt(thisDRMIDstr);
        const thisDRMReq = requisitionData.map((items) => {if(items?.assigned_fsd_user?.[0]?.id === thisDRMID){ return(items)}})
        const thisDRM = thisDRMReq.filter(function (el) { return el != null; });
        thisDRMAssReq = thisDRM.length;
        thisDRMAssReqName = String(DRMValue).substring(1,30);
    }


    //***************************************Styling********************************


  const InfoStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
    color: theme.palette.text.disabled
  }));


    const [rowClickData, setRowClickData] = useState([]) 
 
    const options = {
        selectableRows: false, // <===== will turn off checkboxes in rows
        filter: true,
        print: false,
        download: false,
        filterType: "dropdown",
        responsive: "standard",
        onRowClick: (rowData) => {setRowClickData(rowData[0])},
    };

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
            MUIDataTableBodyCell: {
                styleOverrides: {
                    root: {
                        maxWidth: "232px",
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


  const columns = [
    {
        name: "Requisition ID",
        options: {
            filter: false,
        },
    },
    {
        name: "Business-Unit",
        options: {
            filter: true,
        }
    },
    {
        name: "Requisitioner",
        options: {
            filter: true,
        }
    },
    {
        name: "Tech-Stack",
        options: {
            filter: true,
        }
    },
    {
        name: "Type",
        options: {
            filter: true,
        }
    },
    {
        name: "Designation",
        options: {
            filter: true,
        }
    },
    {
        name: "Requisition Date",
        options: {
            filter: true,
            customBodyRender: (value, tableMeta, updateValue) => {
                return (
                    <b style={{color: "#f05e0a"}}>{value}</b>
                )
            }
        }
    },
    {
        name: "Assign",
        options: {
            filter: false,
        }
    },
];

    return (
        <Page title="Requisition Pool">
            <Container maxWidth="xl">
                <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '30px'}}>Requisition Pool</h2>
            {/* <Typography variant="h4" gutterBottom sx={{ mb: 5 }} align="center"> Requisitions Pool </Typography> */}

            {isLoading ? (
                    <Typography variant="h4" sx={{ mt: 0 }} align="center">
                        <LinearProgress />
                    </Typography>
                    ) : (  
                        <>
            <ThemeProvider theme={theme}>
                    <MUIDataTable
                    style={{justifyContent: "center"}}
                     data={unAssignedReqData.slice(0).reverse().map((data) => {
                        return [
                            data?.requisite_number,

                            data?.bu_group?.bu_name,

                            data?.requisite_creator?.first_name + " " + data?.requisite_creator?.last_name ,

                            data?.tech_stack?.tech_stack_name,

                            data?.requisite_type?.req_type_name,

                            data?.designation,

                            data?.created.substring(0, 10).split('-').reverse().join('-'),

                            <Button size="medium" variant="outlined" onClick={handleShow}> Assign </Button>,
                            
                        ]
                    })}
                    columns={columns}
                    options={options}
                    components={components}
                />
            </ThemeProvider>   

            <Modal
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              scrollable={true}
              backdrop='static'
              centered
              show={show}
              onHide={handleClose}
              style={{
                left: "780px",
                top: "80px",
                height: "90%",
                width: "30%",
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Assign Requisition </Modal.Title>
              </Modal.Header> 
              <Modal.Body>
              <p><font style={{fontWeight: "500"}}>Unassigned Requisition ID: </font>&nbsp;<font style={{fontWeight:"medium", color: "green"}}>{rowClickData?.props?.children}</font></p>
              <p><font style={{fontWeight: "500"}}>Assign To: </font> &emsp; <TextField style={{width: "250px"}} select  label="Recruiters" onClick={handleAssignDRM()} onChange={(e) => {setDRMValue(e.target.value)}}>
                            {DRMuserNames.map((unit) => {if(unit){ drmName = {unit}; return(<MenuItem key={unit} value={unit}>{unit?.substring(1,30)}</MenuItem>)}} )}
                            </TextField></p> 
             <p><font style={{fontWeight: "500"}}>No. of Requisitions in-process under {thisDRMAssReqName} : </font>&nbsp;<font style={{fontWeight:"medium", color: "green"}}>{thisDRMAssReq}</font></p>

                </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleAssignModal}>
                  <font style={{fontWeight: "bolder", fontSize: "larger", color: "green", borderRadius: "5px"}}>Assign</font>
                </Button>
              </Modal.Footer>
            </Modal>

            </>
            )}   
            </Container>
        </Page>
    )
}