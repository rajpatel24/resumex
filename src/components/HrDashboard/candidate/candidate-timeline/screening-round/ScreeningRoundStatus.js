export default function ScreeningRoundStatus(props) {
    function getHRInterviewDateTime(){ 
        const HRDateTime = props?.jobApplicationData?.interview_details.filter(item => {
            return item.interview_round === 'SCREENING_ROUND'
        })
        return HRDateTime[0]?.modified?.substring(0, 10).split('-').reverse().join('/') + " | " + HRDateTime[0]?.modified?.substring(11, 16)
    }

    return (
        <div>
            {props?.jobApplicationData?.is_hr_interview_completed ? (
                <b style={{color: "green"}}>
                <b style={{color: "black"}}>Status: </b>
                <b style={{color: "green"}}>Completed </b><br></br>
                <b style={{color: "black"}}>Date Time: </b> 
                {getHRInterviewDateTime()}
                </b>
            ) : (
                <b>Status: &nbsp;
                <b style={{color: "red"}}>Pending</b></b>
            )}
        </div>
    )
}