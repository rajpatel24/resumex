import React, { useEffect } from "react";
import { useState } from 'react';
import Page from '../../Page';
import * as Yup from "yup";
import { Button, Container, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, LinearProgress, TextField, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from "formik";
import FullCalendar from '@fullcalendar/react' 
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from '@fullcalendar/timegrid';

import axios from 'axios';

import { TimePicker } from '@mui/lab';

import "../calendar/calendarCustom.css"
import {useSnackbar} from 'notistack';
import * as constants from "src/utils/constants";

export default function EmployeeCalendar() {
    const { enqueueSnackbar} = useSnackbar();
    const events = [
    { title: 'Gateway', date: '2022-03-01', allDay: 'false'},
    { title: 'event 2', date: '2022-03-02' },
    { title: 'ResumeX - DSM', start: '2022-03-21T07:00:00Z', end: '2022-03-21T08:00:00Z'},
    { title: 'ICT - NL', start: '2022-03-06T10:00:00.000Z', end: '2022-03-07T06:00:00.000Z', color: "lightblue"},
    { title: 'ICT - Norway', startTime: '10:00:00.000Z', endTime: '10:30:00.000Z', startRecur: '2022-03-08', endRecur: '2022-03-31', color: '#d9648a', borderColor: "black", display: 'false'},
    { title: 'ICT - Finland', startTime: '07:00:00Z', endTime: '08:00:00Z', startRecur: '2022-03-08', endRecur: '2022-03-31', color: '#db4040', borderColor: "black", display: 'false'},
    ]

    // employee technology select dialog
    const [empTechDialog, setEmpTechDialog] = useState(false)

    // get and save employee data
    const [employeeData, setEmployeeData] = useState([])
    const employeeDataLoad = () => {
        const apiInstance = axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/employee-data/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setEmployeeData(response.data.data)
            setEmpTechDialog(response.data.data.interview_tech ? false : true)
        })
        .catch((e) => console.log('something went wrong :(', e));
    }

    // employee technology state
    const [empTechnology, setEmpTechnology] = useState([])

    const EmpTechChange = event => {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          }
        const data = {employee_tech: event.target.value}
        axios.put(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/employee/" + employeeData.id + '/', data, {headers})
        .then(function (response) {
              if (response.status == 200) {
                enqueueSnackbar("Technology updated successfully !!", {
                  anchorOrigin: {
                                  vertical: 'top',
                                  horizontal: 'right',
                                },
                  variant: 'success',
                  autoHideDuration: 1000,
                });
                window.location.reload(false);
              }
            })
        .catch(error => {
            console.error('There was an error!', error);
        });
        setEmpTechnology(event.target.value)
    }

    const [technologyData, setTechnologyData] = useState([])
    const technologyLoad = () => {
    const apiInstance = axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/technology/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
    .then((response) => {
        setTechnologyData(response.data.data)
    })
    .catch((e) => console.log('something went wrong :(', e));
    };

    // progress bar state
    const [isLoading, setIsLoading] = useState(true)
        
    const [employeeEventData, setEmployeeEventData] = useState([])

    const employeeEventsLoad = () => {
    const apiInstance = axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/employee-events/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
    .then((response) => {
        setEmployeeEventData(response.data.data)
        setIsLoading(false)
    })
    .catch((e) => console.log('something went wrong :(', e));
    };

    useEffect(() => {
        technologyLoad()
        employeeEventsLoad()
        employeeDataLoad()
      }, [])

    const [eventData, setEventData] = useState(events)

    // dialog edit state
    const [isEdit, setIsEdit] = useState(false);
    const [editDialogData, setEditDialogData] = useState([{id: '', title: '', start: '', end: ''}]);

    // create event dialog
    const [isCreate, setIsCreate] = useState(false);
    const [createDialogData, setCreateDialogData] = useState([{start: '', end: ''}]);

    const handleDateClick = (arg) => { // select one date
    if (arg?.view.type=="dayGridMonth")
        alert("Please go to week view or day view in order to book your time slots.") 
    }

    const handleEventClick = (props) => { // select or hover event
        let data, startRecur, endRecur, startTime, endTime, endRecurDate = ""
        let start, end = ""

        // check for recurring event and fetch datetime accordingly
        if (props.event._def.recurringDef) {
            data = props.event._def.recurringDef

            startRecur = data?.typeData?.startRecur?.toLocaleString("en-In", { year: 'numeric', month: '2-digit', day: '2-digit',})?.replaceAll('/', '-')

            // substract 1 day from endRecur (Because by default there is one date incremented)
            endRecurDate = new Date(data?.typeData?.endRecur)
            endRecurDate.setDate(endRecurDate.getDate() - 1)
            endRecur = endRecurDate.toLocaleString("en-In", { year: 'numeric', month: '2-digit', day: '2-digit',})?.replaceAll('/', '-')

            startTime = new Date(data ? data.typeData.startTime.milliseconds : '0')?.toISOString()?.slice(11,19)
            endTime = new Date(data ? data.typeData.endTime.milliseconds : '0')?.toISOString()?.slice(11,19)

            start = startRecur?.split('-').reverse().join('-') + "T" + startTime + "+05:30"
            end = endRecur?.split('-').reverse().join('-') + "T" + endTime + "+05:30"
        }
        else {
            start = props.event.startStr
            end = props.event.endStr
        }

    setIsEdit(true)
    setEditDialogData([{id: props.event.id, title: props.event.title, start: start, end: end}])
    }

    const handleEditEvent = () => {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          }
        const data = {
            event_id: editDialogData[0].id, 
            title: editDialogData[0].title, 
            start: editDialogData[0].start.substring(0, 19) + 'Z', 
            end: editDialogData[0].end.substring(0, 19) + 'Z'
        }
        const apiInstance = axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/employee-edit-event/', data, {headers})
        .then(function (response) {
          if (response.status == 200) {
            enqueueSnackbar("Event updated successfully !!", {
              anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'right',
                            },
              variant: 'success',
              autoHideDuration: 1000,
            });
            window.location.reload(false);
          }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    const handleDeleteEvent = () => {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          }
        const data = {instanceStart: editDialogData[0].start.substring(0, 10).split('-').reverse().join('-'), event_id: editDialogData[0].id}
        const apiInstance = axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/employee-events/', data, {headers})
        .then(function (response) {
          if (response.status == 200) {
            enqueueSnackbar("Event deleted successfully !!", {
              anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'right',
                            },
              variant: 'success',
              autoHideDuration: 1000,
            });
            window.location.reload(false);
          }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    const handleSelect = (arg) => { // select multiple dates or time
    setIsCreate(arg?.view.type=="dayGridMonth" ? false: true)
    const startDate = arg.start.toLocaleDateString("en-In", { year: 'numeric', month: '2-digit', day: '2-digit',})?.replaceAll('/', '-')
    const startTime = arg.start.toLocaleTimeString("en-In", { hour12: false, hour: '2-digit', minute:'2-digit' })
    const start = startDate.split('-').reverse().join('-') + "T" + startTime

    const endDate = arg.end.toLocaleDateString("en-In", { year: 'numeric', month: '2-digit', day: '2-digit',})?.replaceAll('/', '-')
    const endTime = arg.end.toLocaleTimeString("en-In", { hour12: false, hour: '2-digit', minute:'2-digit' })
    const end = endDate.split('-').reverse().join('-') + "T" + endTime
    setCreateDialogData([{start: start, end: end}])


    // setEventData([...eventData, {title: 'event 3', start: (arg.start).toISOString(), end: (arg.start).toISOString()}])
    // setEventData([...eventData, {title: 'event 3', date: '2022-03-04'}])
    }

    const [openFilter, setOpenFilter] = useState(false);
    
    const CreateEventFormSchema = Yup.object().shape({
        eventName: Yup.string()
        .min(2, "Too Short!")
        .max(50, "Too Long!")
        .required("Event Name is required"),
    });

    const formik = useFormik({
        initialValues: {
            eventName: '',
          },
          validationSchema: CreateEventFormSchema,
          onSubmit: (formValues) => {
            const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
            }
            const data = {title: formValues.eventName, start: createDialogData[0].start, end: createDialogData[0].end}
            axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/employee-create-event/", data, {headers})
            .then(function (response) {
                  if (response.status == 200) {
                    enqueueSnackbar("Event created successfully !!", {
                      anchorOrigin: {
                                      vertical: 'top',
                                      horizontal: 'right',
                                    },
                      variant: 'success',
                      autoHideDuration: 1000,
                    });
                    window.location.reload(false);
                  }
                })
            .catch(error => {
                console.error('There was an error!', error);
            });

            setIsCreate(false)
            setOpenFilter(false);
          }
        });

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setSubmitting } = formik;
    
    return (
        <Page title="Employee Calendar | ResumeX">
            <Container>
                <Typography align="center" variant="h3" sx={{ mb: 2 }}>
                    Calendar
                </Typography>
                <Typography align="center" variant="h6" sx={{ mb: 8, color: "text.secondary"}}>
                    Give your availability slots to conduct the Interview !
                </Typography>

                {isLoading ? (
                    <Typography variant="h4" sx={{ mt: 0 }} align="center">
                        <LinearProgress />
                    </Typography>
                ) : (
                
                <div>
                {/* ------------------------- select employee technology dialog -------------------------------- */}
                <Dialog open={empTechDialog} onClose={() => {setIsEdit(false)}}>
                    <Typography align="center" variant="h6" sx={{ mt: 2, ml: 2, mr: 2}}>
                        Select your primary technology
                    </Typography>
                    <DialogContent  sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            select
                            label="Technology"
                            value={empTechnology}
                            SelectProps={{
                                multiple: false,
                                value: empTechnology,
                                onChange: EmpTechChange
                              }}
                            >
                            {technologyData.map((technology) => (
                                <MenuItem key={technology.id} value={technology.id}>{technology.technology_name}</MenuItem>
                            ))}
                            </TextField>
                    </DialogContent>
                </Dialog>

                {/* ------------------------- edit event dialog -------------------------------- */}
                <Dialog open={isEdit} onClose={() => {setIsEdit(false)}}>
                    <DialogTitle style={{textAlign: "center"}}>Edit Event</DialogTitle>
                    <DialogContent>
                    <TextField
                        id="standard-basic"
                        variant="standard"
                        value={editDialogData[0].title}
                        onChange={(event) => setEditDialogData([{id: editDialogData[0].id, title: event.target.value,
                            start: editDialogData[0].start, end: editDialogData[0].end}])}
                        fullWidth
                    />
                    </DialogContent>
                    <DialogContent>
                    <TextField
                        id="datetime-local"
                        label="Start"
                        type="datetime-local"
                        value={editDialogData[0]?.start?.substring(0, 16).toString()}
                        onChange={(event) => setEditDialogData([{id: editDialogData[0].id, title: editDialogData[0].title,
                        start: event.target.value, end: editDialogData[0].end}])}
                        fullWidth
                    />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                        id="datetime-local"
                        label="End"
                        type="datetime-local"
                        value={editDialogData[0]?.end?.substring(0, 16).toString()}
                        onChange={(event) => setEditDialogData([{id: editDialogData[0].id, title: editDialogData[0].title,
                        start: editDialogData[0].start, end:  event.target.value}])}
                        fullWidth
                    />
                    <DialogContent sx={{ fontSize: "12px", color: "text.secondary"}}>
                     <p>Note:</p>
                     Changes will be applied to all the events in case of recurring.
                    </DialogContent>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" size="medium" onClick={handleDeleteEvent}>Delete</Button> 
                        <Button variant="contained" size="medium" type="submit" onClick={handleEditEvent}>Update</Button>
                    </DialogActions>
                </Dialog>

                {/* ------------------------- create event dialog -------------------------------- */}
                <Dialog open={isCreate} onClose={() => {setIsCreate(false)}}>
                    <DialogTitle style={{textAlign: "center"}}>Add Event</DialogTitle>
                    <FormikProvider value={formik}>
                        <Form autoComplete="off" onSubmit={handleSubmit}>
                        <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="eventName"
                            label="Event Name"
                            fullWidth
                            variant="standard"
                            {...getFieldProps("eventName")}
                            error={Boolean(touched.eventName && errors.eventName)}
                            helperText={touched.eventName && errors.eventName}
                        />
                        </DialogContent>
                        <DialogContent>
                        <TextField
                            id="datetime-local"
                            label="Start"
                            type="datetime-local"
                            value={createDialogData[0]?.start}
                            onChange={(event) => setCreateDialogData([{start: event.target.value, end: createDialogData[0]?.end}])}
                            fullWidth
                        />
                        </DialogContent>
                        <DialogContent>
                        <TextField
                            id="datetime-local"
                            label="End"
                            type="datetime-local"
                            value={createDialogData[0]?.end}
                            onChange = {(event) => setCreateDialogData([{start: createDialogData[0]?.start, end: event.target.value}])}
                            fullWidth
                            
                        />
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="error" size="medium" onClick={() => setIsCreate(false)}>Cancel</Button>
                            <Button variant="contained" size="medium" type="submit">Add </Button>
                        </DialogActions>
                        </Form>
                    </FormikProvider>
                </Dialog>

                <FullCalendar
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                initialView="timeGridWeek"
                dateClick={handleDateClick}
                events={employeeEventData}
                eventClick={handleEventClick}
                select={handleSelect}
                selectable='true'
                headerToolbar={{
                center: "title", 
                left: "dayGridMonth, timeGridWeek, timeGridDay",
                end: 'today prev,next'
                }}
                eventOverlap='false'
                navLinks='true'
                dragScroll='true'
                editable='true'
                eventResizableFromStart='true'
                eventBackgroundColor='lightpurple'
                eventBorderColor='black'
            />

            </div>
            )}
            </Container>
        </Page>
    )
}