import axios from "axios";
import Page from "../components/Page";
import { Form } from 'react-bootstrap';
import { useSnackbar } from "notistack";
import React,  { useEffect, useState } from "react";
import { JobCards } from "../components/_dashboard/jobs";
import { Box, Grid, Button, Container, Stack, Typography } from "@mui/material";
import { apiInstance } from "src/utils/apiAuth";
import * as constants from "src/utils/constants";
import LinearProgress from '@mui/material/LinearProgress';


export default function JobOpenings() {

  const [jobsData, setjobsData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  //Current User Information
  let jobName = localStorage.getItem("candidateJobApplicationReq");
  let intstatus = localStorage.getItem("candIsInterviewed");

  let thisJobAppJobName = localStorage.getItem("thisJobAppJobName");
  let thisJobAppSkills = localStorage.getItem("thisJobAppSkills");
  let thisJobAppExp = localStorage.getItem("thisJobAppExp");
  let thisJobAppLoc = localStorage.getItem("thisJobAppLoc");

  const filteredTechStacks = filterData.map((item) => (item.jobTechStackName))
  const techStacks = [...new Set(filteredTechStacks)]

  // Linear progress bar state
  const [isLoading, setIsLoading] = useState(true)

  const { enqueueSnackbar } = useSnackbar(); 

  // get tech stack data
  const [technologyData, setTechnologyData] = useState([])
  const getTechnologyData = () => {
      axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/technology/', {headers: {"Authorization": `Token ${localStorage.getItem('candidateToken')}`}})
      .then((response) => {
          setTechnologyData(response.data.data)
      })
      .catch((e) => console.log('something went wrong (:', e));
  };

  // get office locations
  const [officeLocationData, setOfficeLocationData] = useState([])
  const getOfficeLocations = () => {
      axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/office-locations/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
      .then((response) => {
          setOfficeLocationData(response.data.data)
      })
      .catch((e) => console.log('something went wrong :(', e));
  };

  // get job category / department
  const [jobCategoryData, setJobCategoryData] = useState([])
  const getJobCategoryData = () => {
      axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/job-category/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
      .then((response) => {
        setJobCategoryData(response.data.data)
      })
      .catch((e) => console.log('something went wrong :(', e));
  }; 

  //get First name


  const [firstNameData, setFirstNameData]  = useState([]);
  const getFirstName = () => {
    const apiInstance = axios.get(constants.HTTP_METHOD+constants.HTTP_URL+constants.HTTP_PORT+'/api/v1/candidate/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
    .then((response) => {
      setFirstNameData(response.data.data.user.first_name)
      console.log("working!")
    })
    .catch((e) => console.log('something went wrong :(', e));
  };

  useEffect(() => {
    getJobsList()
    getTechnologyData()
    getOfficeLocations()
    getJobCategoryData()
    getFirstName()
  }, [])

    const getDataArray = (jData) =>
  jData.map((jobObj) => ({
    pk: jobObj.requisite_number,
    jobName: jobObj.job_name,
    jobCategory: jobObj.department,
    jobLocation: jobObj.job_loc,
    jobExperience: jobObj.required_exp,
    jobSkills: jobObj.required_skills,
    jobRequirements: jobObj.additional_skills,
    jobResponsibility: jobObj.responsibilities,
    jobDescription: jobObj.job_description,
    jobTechnology: jobObj.other_technology,
    jobPrimaryTechnology: jobObj.primary_technology,
    jobPositions: jobObj.positions,
    jobTechStackID: jobObj.tech_stack,
    jobTechStackName: jobObj.tech_stack.tech_stack_name
  }));

  const getJobsList = () => {

    apiInstance({
      method: "get",
      url: "requisitions/",
      headers: {
        Authorization: "token " + localStorage.getItem('candidateToken'),
      }
    })
      .then(function (response) {
          
          // filter requisitions on basis of its status
          let requisitionData = response.data.data.filter(item => {
            return (item.requisite_status.requisition_status === 'In Process' ) && item.assigned_fsd_user.length != 0 && item.is_active == true
          })
         console.log(requisitionData)
          const jData = getDataArray(requisitionData);

          setjobsData(jData)
          setFilterData(jData) 
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



    const [values, setValues] = useState({});

    const onFormChange = (e, updatedAt) => {
      const name = e.target.name;
      const value = e.target.value;
      setValues({ ...values, [name]: value });
      setFilterData(jobsData);
    };

    if(thisJobAppJobName === null){

    const currentJobData = jobsData.map((item) => { if(item.pk === jobName){return (item)}else{return null}})
    var candidateJobData = currentJobData.filter(elements => { return elements !== null});

    }


   function handleFilterSubmit(){
        setFilterData(filterData.filter(item => {
        if(item?.jobPrimaryTechnology?.[0]?.id == values.skills && item?.jobCategory?.job_category_name == values.category && item?.jobLocation?.[0]?.id == values.location){
          return item
          } 
        else if(item?.jobPrimaryTechnology?.[0]?.id == values.skills){
            if(item?.jobPrimaryTechnology?.[0]?.id == values.skills && item?.jobCategory?.job_category_name == values.category && item?.jobLocation?.[0]?.id == values.location){
              return item
            } 
            else if(item?.jobPrimaryTechnology?.[0]?.id == values.skills && item?.jobLocation?.[0]?.id == values.location){
              return item
              }
            else if( item?.jobPrimaryTechnology?.[0]?.id == values.skills && item?.jobCategory?.job_category_name == values.category){
              return item
            }
            else if(item?.jobPrimaryTechnology?.[0]?.id == values.skills && values.location === 'all' && values.category === 'all'){
              return item
            }
            else if(item?.jobPrimaryTechnology?.[0]?.id == values.skills && !values.location && !values.category){
              return item
            } 
        }
        else if(item?.jobLocation?.[0]?.id == values.location){
            if(item?.jobPrimaryTechnology?.[0]?.id == values.skills && item?.jobCategory?.job_category_name == values.category && item?.jobLocation?.[0]?.id == values.location){
              return item
            } 
            else if(item?.jobPrimaryTechnology?.[0]?.id == values.skills && item?.jobLocation?.[0]?.id == values.location){
              return item
              }
            else if( item?.jobLocation?.[0]?.id == values.location && item?.jobCategory?.job_category_name == values.category){
              return item
            }
            else if(item?.jobLocation?.[0]?.id == values.location && values.skills === 'all' && values.category === 'all'){
              return item
            }
            else if(item?.jobLocation?.[0]?.id == values.location && !values.skills && !values.category){
              return item
            }  
        }
        else if(item?.jobCategory?.job_category_name == values.category){
            if(item?.jobPrimaryTechnology?.[0]?.id == values.skills && item?.jobCategory?.job_category_name == values.category && item?.jobLocation?.[0]?.id == values.location){
              return item
            } 
            else if(item?.jobPrimaryTechnology?.[0]?.id == values.skills && item?.jobCategory?.job_category_name == values.category){
              return item
              }
            else if( item?.jobLocation?.[0]?.id == values.location && item?.jobCategory?.job_category_name == values.category){
              return item
            }
            else if(item?.jobCategory?.job_category_name == values.category && values.skills === 'all' && values.location === 'all'){
              return item
            }
            else if(item?.jobCategory?.job_category_name == values.category && !values.skills && !values.location){
              return item
            } 
        }
        if(!values.skills && !values.location && !values.category){
          return item
        }

        if(values.category === 'all' && values.skills === 'all' && values.location === 'all'){
          return item
        }

        }))
      };


      
      if(intstatus === "true"){
        return(
        <Page title="Dashboard: Jobs ">
        <Container maxWidth="xl">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
          </Stack>
        
        {isLoading ? (
            <Typography variant="h4" sx={{ mt: 0 }} align="center">
              <LinearProgress />
            </Typography>

          ) : (
            <div>
        <h5> Hey {firstNameData}! <br></br> It seems you have already applied for the position of  <font color="#f05e0a">{candidateJobData?.[0]?.jobName} {thisJobAppJobName}</font> </h5>
          <p></p>
          <h5>Here are the details for the position you applied for:</h5>
          <div style={{width: "80%", paddingTop: "10px"}}>
  
            <table>
              <tr>
                <td  style={{padding: "0px 70px 0px 0px"}}>
                  <p><h6>Position: <br></br><font style={{color: "#6c757d"}}>{candidateJobData?.[0]?.jobName} {thisJobAppJobName}</font></h6> </p>
                </td> 
                <td  style={{padding: "0px 70px 0px 0px"}}>
                  <p><h6>Must Have Skills: <br></br><font style={{color: "#6c757d", justifyContent: "center"}}>{candidateJobData?.[0]?.jobTechStackID?.fsd_mem_tech_stk_name} {thisJobAppSkills}</font></h6> </p>
                </td>
                <td  style={{padding: "0px 70px 0px 0px"}}>
                  <p><h6>Required Experience: <br></br><font style={{color: "#6c757d"}}>{candidateJobData?.[0]?.jobExperience}{thisJobAppExp} </font></h6> </p>
                </td>
                <td  style={{padding: "0px 70px 0px 0px"}}>
                  <p><h6> Office Location: <br></br><font style={{color: "#6c757d", justifyContent: "center"}}>{candidateJobData?.[0]?.jobLocation?.[0]?.office_location}{thisJobAppLoc}</font></h6> </p>
                </td>
              </tr>
            </table>
          </div>
          <div style={{display: "flex", width: "50%", marginLeft: "40%", marginTop: "5%", textAlign: "center"}}>
            <h2 style={{fontSize: '30px', fontWeight: '1000'}}>Current Openings</h2>
          </div>
  
          <Stack
            direction="row"
            flexWrap="wrap-reverse"
            alignItems="center"
            justifyContent="flex-end"
            sx={{ mb: 5 }}
          >
          </Stack>
          
          <Grid container spacing={5} justifyContent="center" >
          {filterData && techStacks.map((job, index) => (
            <JobCards key={job.id} post={job} index={index} jobsData={filterData} />
            ))}
          </Grid>

          </div>
        )}
  
        </Container>
      </Page>
        
        );}
    
    else{
      return (
        <Page title="Dashboard: Jobs ">
          <Container maxWidth="xl">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={5}
            >
            </Stack>
      
      
            
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <h1 style={{fontSize: '60px', fontWeight: '1000'}}>
                Become a part of <span style={{color: '#f05e0a'}}>Gateway</span> Family
              </h1>
            </div>
      
            <div style={{display: "flex", width: "80%", marginLeft: "10%", marginTop: "3%", textAlign: "center"}}>
              <h6 style={{fontSize: "20px", fontWeight: 'normal'}}>
                Your career is about what you want to be and who you want to be. 
                It’s about bringing your skills, your curiosity and your best true self to your work. 
                Here at Gateway, you’ll match your ingenuity with the latest technology to make incredible things.
                It is a home away from home, where we work as a team for a common goal - 
                to evolve constantly with the latest technologies while taking utmost care of our most valuable assets, 
                our employees.
              </h6>
            </div>
      
            <div style={{display: "flex", width: "50%", marginLeft: "38%", marginTop: "5%", textAlign: "center"}}>
              <h4 style={{color: ''}}>We hire character. Train skill.</h4>
            </div>
      
            <Box sx={{
              width: "100%",
              height: "100%",
              backgroundColor: '#e98e01',
              marginTop: "5%",
              // '&:hover': {
              // backgroundColor: '#e98e01',
              // opacity: [0.9, 0.8, 0.7],
              // },
            }}>
              <div style={{display: "flex", flexWrap: "wrap"}}>
                  <div style={{textAlign: "left", maxWidth: "45%", background: "url('/static/look-job.jpg')", backgroundSize: "cover", backgroundColor: 'red', flexGrow: "0", flexShrink: "0", flexBasis: "50%", alignItems: "center", justifyContent: "center"}}>
                    <h1 style={{fontSize: "3.25em",color: "#fff", textShadow: "2px 2px #000", alignItems: "center", justifyContent: "center",
                    fontWeight: "bold", position: "relative", zIndex: "10", marginTop: "20%"}}>
                      <span style={{color: "#fe9000", marginLeft: "20%", justifyContent: "left"}}>CAN NOT</span> 
                      <br></br>
                      <span style={{marginLeft: "20%", justifyContent: "left"}}>FIND</span> 
                      <br></br>
                      <span style={{alignItems: "left", marginLeft: "20%", justifyContent: "left"}}>YOUR DREAM</span>
                      <br></br>
                      <span style={{alignItems: "left", marginLeft: "20%", justifyContent: "left"}}>JOB YET ?</span>
                    </h1>
                  </div>
                  
                  <div style={{ maxWidth: "20%", padding: "1%", flexGrow: "0", flexShrink: "0", flexBasis: "50%", fontWeight: "bold"}}>
                      <Form style={{marginTop: "30%", paddingLeft: "5px"}}>
                          <Form.Group controlId="formGridEmail" style={{paddingBottom: "15px"}}>
                            <Form.Label>CATEGORY</Form.Label>
        
                            <Form.Select aria-label="Default select example" name="category" onChange={onFormChange}>
      
                            <option value="all">Select Category</option>
                                {jobCategoryData.map((item) => (
                                  <option value={item.job_category_name}>{item.job_category_name}</option>
                                ))}
      
                            </Form.Select>
                          </Form.Group>
      
                          <Form.Group controlId="formGridPassword" style={{paddingBottom: "15px"}}>
                              <Form.Label>LOCATION</Form.Label>
      
                              <Form.Select aria-label="Default select example" name="location" onChange={onFormChange}>
                                <option value="all">Select City</option>
                                {officeLocationData.map((item) => (
                                  <option value={item.id}>{item.office_location}</option>
                                ))}
                              </Form.Select>
                          </Form.Group>
      
                          <Form.Group controlId="formGridQuery" style={{paddingBottom: "20px"}}>
                              <Form.Label>SKILLS</Form.Label>
                              
                              <Form.Select aria-label="Default select example" name="skills" onChange={onFormChange}>
                                <option value="all">Select Skills</option>
                                {technologyData.map((item) => (
                                <option value={item.id}>{item.technology_name}</option>
                                ))}
                              </Form.Select>
                          </Form.Group>
      
                          <Form.Group controlId="formGridQuery" style={{paddingBottom: "15px"}}>
                              <Form.Check name="relocation" label={"Open to Relocation"} onChange={onFormChange}/>
                              <Form.Check name="office" label={"Office"} onChange={onFormChange}/>
                              <Form.Check name="remote" label={"Remote"} onChange={onFormChange}/>
                          </Form.Group>
                          
                          <Button variant="contained" size="medium" onClick={handleFilterSubmit} style={{backgroundColor: 'black', width: '100px'}}>
                              FIND
                          </Button>
                      </Form>
                  </div>
      
                  <div style={{textAlign: "center", maxWidth: "5%", flexGrow: "0", flexShrink: "0", flexBasis: "50%"}}>
                  </div>
      
                  <div style={{textAlign: "center", maxWidth: "25%", flexGrow: "0", flexShrink: "0", flexBasis: "50%"}}>
                      <img src="/static/gateway-girl.png" width="100%" height="100%"></img>
                  </div>
              </div>
            </Box>
      
            <div style={{display: "flex", width: "50%", marginLeft: "40%", marginTop: "5%", textAlign: "center"}}>
              <h2 style={{fontSize: '30px', fontWeight: '1000'}}>Current Openings</h2>
            </div>
      
            <Stack
              direction="row"
              flexWrap="wrap-reverse"
              alignItems="center"
              justifyContent="flex-end"
              sx={{ mb: 5 }}
            >
            </Stack>

            {isLoading ? (
              <Typography variant="h4" sx={{ mt: 0 }} align="center">
                <LinearProgress />
              </Typography>

            ) : (
              
            <Grid container spacing={5} justifyContent="center" >
            {filterData && techStacks.map((job, index) => (
              <JobCards key={job.id} post={job} index={index} jobsData={filterData} />
              ))}
            </Grid>
            )}
      
          </Container>
        </Page>
      );
    }
}



