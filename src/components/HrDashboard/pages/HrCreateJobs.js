import React, { useEffect } from "react";
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useFormik } from 'formik';
import { useState } from 'react';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// components
import Page from '../../Page';
import axios from 'axios';
import Label from '../../Label';
import Scrollbar from '../../Scrollbar';
import SearchNotFound from '../../SearchNotFound';
import { JobListHead, JobListToolbar, JobMoreMenu } from '../create-jobs';
import Popup from 'reactjs-popup';
import * as constants from "src/utils/constants";

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'pk', label: 'ID', alignRight: false, alignCenter: true },
  { id: 'jobName', label: 'Job Name', alignRight: false },
  { id: 'jobTechnology', label: 'Technology', alignRight: false, alignCenter: true },
  { id: 'jobOpenings', label: 'Openings', alignRight: false },
  { id: 'jobActive', label: 'Active', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.jobName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function HrCreateJobs() {
  // menu open state
  const [isOpen, setIsOpen] = useState(false);

  // popup open state
  const [popupOpen, setPopupOpen] = useState(false);
  const closePopup = () => setPopupOpen(false);

  const [jobData, setJobData] = useState([])
  const getJob = () => {
    const apiInstance = axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/jobs/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
    .then((response) => {
      const jData = getDataArray(response.data.data)
      setJobData(jData)
    })
    .catch((e) => console.log('something went wrong :(', e));
  };

  useEffect(() => {
    getJob()
  }, [])

    const getDataArray = (jData) =>
    jData.map((jobObj) => ({
      pk: jobObj.id,
      jobName: jobObj.job_name,
      jobCategory: jobObj.job_category,
      jobPrimaryTechnology: jobObj.primary_technology,
      jobLocation: jobObj.location,
      jobMaxExp: jobObj.max_exp,
      jobMinExp: jobObj.min_exp,
      jobSkills: jobObj.skills,
      jobRequirements: jobObj.requirements,
      jobResponsibility: jobObj.responsibility,
      jobDescription: jobObj.description,
      jobTechnology: jobObj.technology,
      jobOpenings: jobObj.total_openings,
      jobActive: jobObj.is_active
    }));

  const USERLIST = jobData

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('job_data');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.job_name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, job_name) => {
    const selectedIndex = selected.indexOf(job_name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, job_name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Create Jobs | ResumeX">
      <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Create Jobs
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/resumeX/create-jobs/create-job-form"
            startIcon={<Icon icon={plusFill} />}
          >
            Create Job
          </Button>
        </Stack>

        <Card>
          <JobListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <JobListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const avatarUrl = "/static/mock-images/cities/city.jpg"

                      const { pk, jobName, jobCategory, jobPrimaryTechnology, jobLocation, jobMaxExp, jobMinExp, jobSkills, 
                        jobRequirements, jobResponsibility, jobDescription, jobTechnology, 
                        jobOpenings, jobActive } = row;

                      const isItemSelected = selected.indexOf(jobName) !== -1;

                      const technologies = []
                      const locations = []
                    
                      jobTechnology.forEach(technology => {
                        technologies.push(technology.technology_name + ' | ')
                      });

                      jobLocation.forEach((location) => {
                        locations.push(location.office_location + " | ");
                      });
                        
                      return (
                        <TableRow
                          hover
                          key={pk}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, jobName)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={jobName} src={avatarUrl} />
                              <Typography variant="subtitle2" noWrap>
                                {pk}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <Popup
                            contentStyle={{
                              alignItems: "center",
                              left: "150px",
                              width: "70%",
                              maxHeight: "70vh",
                              overflowY: "auto",
                            }}
                            modal
                            trigger={
                              <TableCell align="left"><a href="#" style={{textDecoration: 'none', color: '#00AB55', fontWeight: 'bold'}}>{jobName}</a></TableCell>
                            }
                            on="click">
                              
                            <div style={{ color: 'black', backgroundColor: '#00AB5514' }}>
                              <h3>{jobName}</h3>
                              <hr></hr>
                            </div>

                            <div style={{paddingTop: "0px", height: "120px"}}>
                              <div style={{width: "30%", height: "100%", float: "left"}}>
                              <h5 style={{paddingTop: "20px", }}>Job Category:</h5>
                                {jobCategory.job_category_name}
                              </div>
                              <div style={{width: "30%", height: "100%", float: "left"}}>
                              <h5 style={{paddingTop: "20px", }}>Location:</h5>
                                {locations}
                              </div>
                              <div style={{width: "30%", height: "100%", float: "left"}}>
                              <h5 style={{paddingTop: "20px", }}>Primary Technology:</h5>
                                {jobPrimaryTechnology}
                              </div>
                            </div>
                            <hr></hr>

                            <div style={{paddingTop: "10px", height: "100px"}}>
                              <div style={{width: "30%", height: "100%", float: "left"}}>
                              <h5 style={{paddingTop: "20px", }}>Technology:</h5>
                                {technologies}
                              </div>

                              <div style={{width: "30%", height: "100%", float: "left"}}>
                              <h5 style={{paddingTop: "20px", }}>Minimum Experience:</h5>
                                {jobMinExp}
                              </div>
                              <div style={{width: "20%", height: "100%", float: "left"}}>
                              <h5 style={{paddingTop: "20px", }}>Maximum Experience:</h5>
                                {jobMaxExp}
                              </div>
                              <div style={{width: "20%", height: "100%", float: "left"}}>
                              <h5 style={{paddingTop: "20px", }}>Total Openings:</h5>
                                {jobOpenings}
                              </div>
                            </div>
                            <hr></hr>

                            <h5 style={{paddingTop: "20px", }}>Skills:</h5>
                            {jobSkills}
                            <hr></hr>

                            <h5 style={{paddingTop: "20px", }}>Requirements:</h5>
                            {jobRequirements}
                            <hr></hr>

                            <h5 style={{paddingTop: "20px", }}>Responsibility:</h5>
                            {jobResponsibility}
                            <hr></hr>

                            <h5 style={{paddingTop: "20px", }}>Description:</h5>
                            {jobDescription}
                          </Popup>

                          <TableCell align="left">{technologies} </TableCell>
                          <TableCell align="left">{jobOpenings}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={jobActive ? "success" : "warning"}
                            >
                            {jobActive ? "Yes" : "No"}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <JobMoreMenu id={pk} jobName={jobName} jobCategory={jobCategory.id}
                             jobPrimaryTechnology={jobPrimaryTechnology}
                             jobLocation={jobLocation} jobMaxExp={jobMaxExp} jobMinExp={jobMinExp}
                             jobSkills={jobSkills} jobRequirements={jobRequirements} 
                             jobResponsibility={jobResponsibility} jobDescription={jobDescription}
                             jobTechnology={jobTechnology} jobOpenings={jobOpenings} jobActive={jobActive}/>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>


      </Container>
    </Page>
  );
}
