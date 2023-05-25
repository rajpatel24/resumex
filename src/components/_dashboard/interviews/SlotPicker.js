import { React, useState } from 'react';

// datepicker imports
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.css";
import "./SlotPicker.css";

// datetime imports
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'

import { useSnackbar } from "notistack";


export default function SlotPicker(props) {

    const [startDate, setStartDate] = useState()
    const [newTimeSlots, setNewTimeSlots] = useState([])
    const [btnDisable, setBtnDisable] = useState(true)
    const { enqueueSnackbar } = useSnackbar();

    var finalDateArray = []


    function handleChange(date) {
        let res = mergedTimeArray.filter(element => element.getDate() === date.getDate())

        if (res !== null) {
            setNewTimeSlots(res)
        }
        setStartDate(date)
        setBtnDisable(false)
    }

    function onFormSubmit(e) {
        e.preventDefault();
        let userSelectedDate = startDate.toISOString().split('.')[0] + 'Z'
        let employeeData = props?.eventsData.filter(x => {
            if (x.start === userSelectedDate) {
                return x
            }
        })

        if (employeeData.length !== 0) {
            props.setEventInfo(employeeData);
            props.setOpen(true)
            }
        else {
            var startDtTz = startDate.toISOString().split('T')[0]
          
            let eData = props?.eventsData.filter(y => {
                if (startDtTz >= y.startRecur && startDtTz <= y.endRecur) {
                    return y
                }
            }
            )

            var endDtTz = eData[0]?.endTz.split('T')[1]
            var newEndDt = startDtTz + 'T' + endDtTz

            if (eData.length !== 0) {
                eData[0].start = startDate
                eData[0].end = newEndDt

                props.setEventInfo(eData);
                props.setOpen(true)
            }
            else {
                enqueueSnackbar("No Slots Are Available For The Given Time !", {
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                    variant: "error",
                    autoHideDuration: 1500,
                });
            }
        }
    }



    let includeDateList = props?.eventsData.map(dateObj => {
        if (dateObj?.startRecur) {
            let val = new Date(dateObj.startTz)
            let end_val = new Date(dateObj.endTz)

            for (var arr = [], dt = new Date(val); dt < end_val; dt.setDate(dt.getDate() + 1)) {
                arr.push(new Date(dt));
                finalDateArray.push(new Date(dt));
            }
            return (val)
        }
        else {
            let val = new Date(dateObj.start)
            return (val)
        }
    })

    const mergedDateArray = includeDateList.concat(finalDateArray)

    let new_time_arr = []

    let includeTimeList = props?.eventsData.map(dateObj => {
        if (dateObj?.startRecur) {

            let start_val = new Date(dateObj.startTz)
            let end_val = new Date(dateObj.endTz)

            let firstTimeEle = setHours(setMinutes(new Date(start_val),
                new Date(start_val).getMinutes()),
                new Date(start_val).getHours()
            )

            for (var time_arr = [], tm = start_val; tm < end_val; tm.setDate(tm.getDate() + 1)) {
                let val = setHours(setMinutes(new Date(tm),
                    new Date(tm).getMinutes()),
                    new Date(tm).getHours()
                )

                time_arr.push(new Date(val));
                new_time_arr.push(new Date(val));
            }

            return firstTimeEle
        }
        else {
            let val = setHours(setMinutes(new Date(dateObj.start), new Date(dateObj.start).getMinutes()),
                new Date(dateObj.start).getHours())

            return (val)
        }
    })

    const mergedTimeArray = includeTimeList.concat(new_time_arr)


    const highlightSlotsDates = [
        {
            "react-datepicker__day--highlighted-custom-2": mergedDateArray
        }
    ]

    return (

        <div style={{ margin: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            <form onSubmit={onFormSubmit}>
                <div className="form-group" style={{ display: 'flex'}}>
                    <div>
                    <DatePicker
                        placeholderText="Select Date-Time For Interview"
                        formatWeekDay={nameOfDay => nameOfDay.substring(0,3)}
                        selected={startDate}
                        onChange={handleChange}
                        includeDates={mergedDateArray}
                        includeTimes={newTimeSlots}
                        highlightDates={highlightSlotsDates}
                        disabledKeyboardNavigation
                        showTimeSelect
                        forceShowMonthNavigation
                        timeFormat="HH:mm"
                        timeCaption="Slots"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        onKeyDown={(e) => {
                            e.preventDefault();
                        }}
                    />
                    </div>
                    
                    <div>
                    <button className="btn btn-success" style={{ width: 140, height: "3rem", borderRadius: "0px 20px 20px 0px"}} disabled={btnDisable}> Book Slot </button>
                    </div>
                </div>
            </form>

        </div>

    )
}

