export default function CTORoundStatus(props) {
    const InterviewData = props?.jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'CTO_ROUND'
    })

    function getCTOInterviewDateTime(){
        const InterviewDateTime = props?.jobApplicationData?.interview_details.filter(item => {
            return item.interview_round === 'CTO_ROUND'
        })

        return InterviewDateTime[0]?.modified.substring(0, 10).split('-').reverse().join('/') + " | " + InterviewDateTime[0]?.modified.substring(11, 16)
    }

    return (
        <div>
            {InterviewData?.[0]?.interview_status === 'COMPLETED' ? (
                <b style={{color: "green"}}>
                <b style={{color: "black"}}>Status: </b>
                <b style={{color: "green"}}>Completed </b><br></br>
                <b style={{color: "black"}}>Date Time: </b>
                {getCTOInterviewDateTime()}
                </b>
            ) : (
                <b>Status: &nbsp;
                <b style={{color: "red"}}>Pending</b></b>
            )}
        </div>
    )
}