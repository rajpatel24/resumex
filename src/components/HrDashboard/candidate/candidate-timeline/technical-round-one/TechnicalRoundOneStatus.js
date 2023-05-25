export default function TechnicalRoundOneStatus(props) {
    function getTechnicalInterviewDateTime(){
        const TechnicalDateTime = props?.jobApplicationData?.interview_details.filter(item => {
            return item.interview_round === 'TECHNICAL_ROUND_ONE'
        })

        return TechnicalDateTime[0]?.modified.substring(0, 10).split('-').reverse().join('/') + " | " + TechnicalDateTime[0]?.modified.substring(11, 16)
    }

    return (
        <div>
            {props?.jobApplicationData?.is_technical_interview_one_completed ? (
                <b style={{color: "green"}}>
                <b style={{color: "black"}}>Status: </b>
                <b style={{color: "green"}}>Completed </b><br></br>
                <b style={{color: "black"}}>Date Time: </b>
                {getTechnicalInterviewDateTime()}
                </b>
            ) : (
                <b>Status: &nbsp;
                <b style={{color: "red"}}>Pending</b></b>
            )}
        </div>
    )
}