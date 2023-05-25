import 'scrollable-component';
import React from "react";  
import PrintButton from "./PrintButton";// material
import { Button, Typography } from '@mui/material';
import { apiInstance } from 'src/utils/apiAuth';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import UserInfo from '../../../utils/Authorization/UserInfo';
import { renderToString } from 'react-dom/server';
import { jsPDF } from "jspdf";
import { useRef } from 'react';


const styles = {
  page: {
    marginLeft: "2rem",
    marginRight: "2rem",
    "page-break-after": "always",
    fontSize: "16px",
    lineHeight: "22px",
    align: "justify",
  
  },
  mycontent: {
    height: "600px",
    border: "1px solid black",
    marginTop: "20px",
  },

  columnLayout: {
    display: "flex",
    justifyContent: "space-between",
    margin: "02rem 0rem 0rem 0rem",
    gap: "1rem"
  },

  spacer2: {
    height: "2.5rem"
  },

  fullWidth: {
    width: "90%"
  },

  marginb0: {
    marginBottom: 0
  },
  
};

export default function GOL2(candData) {
  
  const hrToken = localStorage.getItem("authToken");

  var cand_id = candData?.candidateData?.id

  const offerLetterRef = useRef(null);

  const offerLetterRef1 = useRef(null);

  const offerLetterRef2 = useRef(null);

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const userInfo = UserInfo()

  const pdfRef = React.useRef();

    // ------------------- Functions --------------------

    function handleSendMail(){

      const candId = candData?.candidateData?.id

      const hrToken = localStorage.getItem("authToken");

      var apiData = {
          "cand_id": candId,
      }

      apiInstance({
          method: "post",
          url: "candidate-viewset/send_mail/",
          headers: {
              Authorization: "token " + hrToken,
          },
          data: apiData,
      })
      .then(function (response) {
          enqueueSnackbar(response.data.message, {
              anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
              },
              variant: 'success',
              autoHideDuration: 2000,
          });
          navigate("/resumeX/candidates", { replace: true });
      })
      .catch(function (error) {
          enqueueSnackbar('Insufficient Candidate Information. Please fill up necessary data.', {
              anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
              },
              variant: 'error',
              autoHideDuration: 2000,
          });
      });
  }
  function handleGeneratePDF(){

		const doc = new jsPDF('landscape', 'pt','a2');
    let pageHeight = doc.internal.pageSize.getHeight();
    doc.html(document.getElementById("Page1"), {
       callback: function (pdf) {
         pdf.addPage("a2", "l");
         pdf.html(document.getElementById("Page2"), {
           callback: function (pdf2) {
             pdf2.addPage("a2", "l");
             pdf2.html(document.getElementById("Page3"), {
               callback: function (pdf3) {
                  var blob = doc.output('blob');
                  var formData = new FormData();
                  formData.append('offer_letter_file', blob); 

                  apiInstance({
                    method: "put",
                    url: "candidate-viewset/" + cand_id + "/",
                    headers: {
                        Authorization: "token " + hrToken,
                        'Content-Type': "multipart/form-data",
                    },
                    data: formData,
                })
                    .then(function (response) {
                        enqueueSnackbar('Offer Letter Stored Successfully', {
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success',
                            autoHideDuration: 2000,
                        });
                        navigate("/resumeX/candidates", { replace: true });
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

               },
               x: 0,
               y: 2 * pageHeight,
             });
           },
           x: 0,
           y: pageHeight,
         });
       },
       x: 0,
       y: 0,
     });
  }

    return (
      <>
      <scrollable-component style={styles.mycontent}>       
      <div ref={pdfRef} id="pdf" style={{float: "left"}}>
        <table>
          <tr>
            <td>
            <div id="Page1" ref={offerLetterRef}>    
              <div style={styles.page}>
                <div style={styles.columnLayout}>
                  <div style={styles.column}>
                    <p><font>{candData?.candidateData?.onboard_details?.ref_no}</font>
                    <font style={{float: "right"}} >{candData?.candidateData?.onboard_details?.offer_date}</font></p>
                    <p>
                      <center><h4 style={styles.marginb0}><u><b>Offer Letter</b></u></h4></center></p>
                    <p>
                    Dear <b>{candData?.candidateData?.user?.first_name}  {candData?.candidateData?.user?.last_name}</b>,<br/>
                    Heartiest Congratulations!<br/>
                    With great pleasure, we invite you to become a part of our tenacious team.
                    Our inherent organizational DNA is to deliver tangible and measurable business value to 
                    our Global Customers and we take extreme pride in having you as a part of our team.
                    We are pleased to offer you the position of “<b>{candData?.candidateData?.job_application?.[0]?.job_name}</b>” 
                    in our organization on the terms discussed and agreed by you during your
                    interactions with us. The details of the offer are mentioned below and in the 
                    Annexure I & II attached herewith.<br/></p>
                    <p>
                    <b>Joining Date</b>&emsp;&emsp;&ensp;&ensp;:  &emsp; &emsp;{candData?.candidateData?.onboard_details?.join_date}<br/>
                    <b>Reporting Time</b>&emsp;&ensp;:  &emsp; &emsp; 9:30 a.m.<br/>
                    </p>
                    <p>
                    Your formal Letter of Appointment will be issued to you upon your joining the organization.
                    This will contain details of all our terms and conditions of employment.<br/></p>
                    <p>
                    <b>{candData?.candidateData?.user?.first_name}</b> , we look forward to having you on board with us on this exciting journey.
                    In case you have any feedback/suggestion or have any query, feel free to contact any of the
                    following individuals:<br/>
                    </p>
                    <p>
                    Recruitment team member: {candData?.candidateData?.created_by?.member?.first_name} {candData?.candidateData?.created_by?.member?.last_name} – hr@thegatewaycorp.com<br/>
                    Onboarding team member : {candData?.candidateData?.onboard_details?.onboarding_hr?.hr_name} – onboarding@thegatewaycorp.com<br/>
                    </p>
                    <p>
                    We take this opportunity to wish you a great career ahead with Gateway.<br/>
                    With Best Regards,<br/></p>
                    <p>
                    <b>For, Gateway Group Of Companies  <font style={{float: "right"}}>Read and Accepted:</font></b><br/></p>
                    <p>
                    _________________________________<font style={{float: "right"}}>___________________</font><br/>
                    <font><b>( {candData?.candidateData?.onboard_details?.sign_authority?.authority_name} ) <font style={{float: "right"}}>( {candData?.candidateData?.user?.first_name}  {candData?.candidateData?.user?.last_name} )</font></b></font><br/>
                    <font><b>Authorized Signatory</b></font><br/><br/><br/><br/><br/>
                    </p>
                </div>
              </div>
            </div>
          </div>
          </td>
        </tr>
        <tr>
          <td>
          <div id="Page2" ref={offerLetterRef1}>    
              <div style={styles.page}>
                <div style={styles.columnLayout}>
                  <div style={styles.column}>
                    <p><center><h4 style={styles.marginb0}><b>Annexure I</b></h4></center></p>
                    <p style={styles.marginb0}><b>Below are further details of your offer:</b></p>
                    <p style={{align: "justify"}}>
                      1. The company will be aligning your growth with that of the company’s growth and expect a 
                      mutual understanding that you will refrain from directly or indirectly engaging in any other business.<br/><br/>
                      2. We request you to kindly share your acceptance before the expiration of three (3) days from
                      the date of this letter, or the joining date, whichever is earlier. In case we don’t receive any 
                      acceptance as above from you or you remain absent on the joining day post acceptance, this will 
                      automatically be treated as the offer being rejected by you and no communication regarding the 
                      same shall be made from the company’s side.<br/><br/>
                      3. We further request you to ready the material (copies of documents pertaining to the statements/claims 
                      made in your resume), for satisfactory verification of references, non-compete obligations, background,
                        education and employment history since it is contingent for your appointment.<br/><br/>
                      4. Your compensation package & structure is unique to you & is not liable for comparison with any other
                      employee of the company. It is determined by numerous factors such as your job, skill specific background
                      and professional merit. This information and any subsequent changes made there in should be treated as 
                      strictly personal and confidential.<br/><br/>
                      5. Information pertaining to Company operations and intellectual property is confidential and you will be
                      required to sign a non-disclosure agreement for the same.If you are bound by a confidentiality agreement 
                      with a previous employer, you must notify the Company and indemnify the Company against any breach thereof.<br/><br/>
                      6. Upon acceptance of this offer, we expect you to comply with the code of conduct as well as the policies 
                      of the Company.<br/><br/>
                      7. If amendments to your offer are required, such as joining date or designation, they will be confirmed 
                      and communicated to you by the company in writing (on paper ordigital).<br/><br/>
                      8. Based on the specific needs and exigencies of work, the company reserves right to deploy you for work in 
                      any of its offices within India or abroad. You are expected to respect the judgement and the decision of the 
                      company in this regard.<br/>
                    </p>
                    <p style={styles.marginb0}><b>Agreed and accepted:</b></p>
                    <br/>
                    <p>...................................................<br/>
                    Candidate’s Signature</p>
                    <p> Name:<br/> Date:<br/>Place:</p>
                </div>
              </div>
            </div>
         </div>
          </td>
        </tr>
        <tr>
          <td>
          <div id="Page3" ref={offerLetterRef2}>   
            <div style={styles.page}>
                <div style={styles.columnLayout}>
                  <div style={styles.column}>
                    <p><center><h4 style={styles.marginb0}><b>Annexure II</b></h4></center></p>
                    <p>After accepting this offer, you will be receiving a link from ‘Gateway Talent Hub’ over email
                        on your email id. We request you to kindly click on the link which will enable you to get onto our portal.</p>
                    <p>Please create your credentials there to complete your joining formalities prior to your date of joining.</p>
                    <p>You are required to upload the following documents at Gateway Talent Hub Portal:</p>
                    <p>1)Passport size photograph (Upload Softcopy & Bring 4 Hard Copies as well).<br/>
                        2)Identity Proof (PAN, AADHAR, Voter ID, DL, PASSPORT)<br/>
                        3)Relieving & Experience Letters of all the companies worked with<br/>
                        4)Last Salary Slip/Bank Statement<br/>
                        5) Academic Mark Sheets/Certificates (10th , 12th , Diploma, Bachelors, Masters)<br/>
                    </p>
                    <p> Please note that all the documents listed above are mandatory to be brought with you in its original form at the time of joining for verification purposes. </p>
                    <p>On our portal, you can access assistance, support & live feeds about us.</p>
                    <p style={styles.marginb0}><b>Agreed and accepted:</b></p>
                      <br/>
                      <p>...................................................<br/> Candidate’s Signature</p>
                      <p> Name:<br/> Date:<br/>Place:</p>
                    </div>
                  </div>
                </div>
             </div>
              </td>
            </tr>
          </table>
        </div>
      </scrollable-component>

      {userInfo.role !== 'BU_HEAD' ? 
      <div>
        <PrintButton refsToPrint={[pdfRef]} />
        <Button style={{float: "right" ,fontWeight: "bold", 
                        padding: "10px", borderRadius: "10px", 
                        color: "white", backgroundColor: "#009999", 
                        margin: "10px", fontSize: "medium"}} 
                onClick={handleSendMail}> 
          Send Mail 
        </Button>
        <Button style={{float: "right" ,fontWeight: "bold", 
                        padding: "10px", borderRadius: "10px", 
                        color: "white", backgroundColor: "rgb(55 151 250)", 
                        margin: "10px", fontSize: "medium"}} 
                onClick={handleGeneratePDF}> 
          Save PDF 
        </Button>
      </div>
      : null }
    </>
  );
}