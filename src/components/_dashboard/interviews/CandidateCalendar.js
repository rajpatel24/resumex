import React from 'react'

// full calendar
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';

export default function CandidateCalendar(props) {
    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
                center: "title",
                left: "dayGridMonth, timeGridWeek, timeGridDay",
                end: "today prev,next",
            }}

            dateClick={props.selectedDateHandler}

            eventTimeFormat={{
                // output:- '14:30'
                hour: "2-digit",
                minute: "2-digit",
                meridiem: false,
            }}

            dayMaxEventRows={true}

            eventClick={function (info) {
                props.setEventInfo(info);
                props.setOpen(true);
            }}

            events={props.eventsData}

            eventBackgroundColor='lightpurple'

            eventBorderColor='black'

            eventDisplay='list-item'
        />
    )
}

