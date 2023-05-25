import React from 'react';

export default function ReviewCandidateStatus(props) {
    const confirmedInterviewData = props.jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'REVIEW_CANDIDATE'
    })

    return(
        <div>

        {confirmedInterviewData?.[0]?.interview_status === "COMPLETED" ? (
            <b style={{color: "green"}}>
            <b style={{color: "black"}}>Status: </b>
            <b style={{color: "green"}}>Completed </b><br></br>
            <b style={{color: "black"}}>Date Time: </b> 
            {confirmedInterviewData[0].modified.substring(0, 10).split('-').reverse().join('/') + " | " + confirmedInterviewData[0].modified.substring(11, 16)}
            </b>
            ) : (
                <b>Status: &nbsp;
                <b style={{color: "red"}}>Pending</b></b>
            )}
        </div>
    )
}