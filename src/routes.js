import { Navigate, useRoutes } from 'react-router-dom';
// import HrProducts from './components/HrDashboard/pages/HrProducts';
// import HrBlog from './components/HrDashboard/pages/HrBlog';
// import Employees from './components/HrDashboard/pages/Employees';
// import Requisition from './components/HrDashboard/pages/Requisition';
// import EmployeeProducts from './components/EmployeeDashboard/pages/EmployeeProducts';
// import EmployeeBlog from './components/EmployeeDashboard/pages/EmployeeBlog';

// layouts
import DashboardLayout from './layouts/dashboard';
import HrDashboardLayout from './components/HrDashboard/layouts'
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import Login from './pages/Login';
import OTPForm from './pages/LoginOTP';
import EmpLogin from './pages/EmployeeLogin'
import Register from './pages/Register';
import JobApply from './pages/JobApply';
import DashboardApp from "./pages/DashboardApp";
import NotFound from './pages/Page404';
import Page401 from './pages/Page401';
import HrDashboardApp from './components/HrDashboard/pages/HrDashboardApp';
import HrJobApplication from './components/HrDashboard/pages/HrJobApplication';
import Candidates from './components/HrDashboard/pages/Candidates';
import Joinees from './components/HrDashboard/pages/Joinees';
import MyRequisition from './components/HrDashboard/pages/MyRequisition';
import OtherRequisition from './components/HrDashboard/pages/OtherRequisition';
import CreateRequisition from './components/HrDashboard/requisition/CreateRequisition';
import EditRequisition from './components/HrDashboard/requisition/EditRequisition';
import RRFTemplates from './components/HrDashboard/pages/RRFTemplates';
import EditRRFTemplate from './components/HrDashboard/requisition-template/EditRRFTemplate';
import EditJobApplication from './components/HrDashboard/job-application/EditJobAplication';
import CreateRRFTemplate from './components/HrDashboard/requisition-template/CreateRRFTemplate';
import EditCandidate from './components/HrDashboard/candidate/EditCandidate';
import HrCreateJobs from './components/HrDashboard/pages/HrCreateJobs';
import CreateJobForm from './components/HrDashboard/create-jobs/CreateJobForm';
import CreateCandidateForm from './components/HrDashboard/candidate/CreateCandidateForm';
import BookedInterviews from './components/EmployeeDashboard/pages/BookedInterviews';
import CompletedInterview from './components/EmployeeDashboard/pages/CompletedInterview';
import EmployeeDashboardApp from './components/EmployeeDashboard/pages/EmployeeDashboardApp';
import EmployeeCalendar from './components/EmployeeDashboard/pages/EmployeeCalendar';
import EmployeeDashboardLayout from './components/EmployeeDashboard/layouts';
import EmployeeUser from './components/EmployeeDashboard/pages/EmployeeUser';
import JobOpenings from './pages/JobOpenings';
import ScheduleInterview from "./pages/ScheduleInterview"; 
import InterviewDetails from "./pages/InterviewDetails";
import ProfileUpdateForm from './components/_dashboard/user/profile/ProfileUpdateForm';
import CandidateInterview from './components/EmployeeDashboard/booked-interview/CandidateInterview';
import JobDetails from './components/_dashboard/jobs/JobDetails';
import ResumeParser from './components/HrDashboard/pages/ResumeParser';
import MasterRoles from './components/HrDashboard/pages/MasterRoles';
import Groups from './components/HrDashboard/pages/Groups';
import CreateGroup from './components/HrDashboard/roles-&-rights/CreateGroup';
import EditGroup from './components/HrDashboard/roles-&-rights/EditGroup';
import Timeline from './pages/Timeline';
import { RequireAuth } from './utils/RequireAuth';
import ROLES from './utils/Authorization/Roles';
import UploadDocuments from "./pages/UploadDocuments";
import FSDUsers from './components/HrDashboard/pages/FSDUser';
import EMPUsers from './components/HrDashboard/pages/EmployeeUser';
import User from './pages/User';
import CreateFSDUserForm from './components/HrDashboard/users/CreateFSDUserForm';
import CreateEMPUserForm from './components/HrDashboard/users/CreateEMPUserForm';
import EditFsdUser from './components/HrDashboard/users/EditFSDUser';
import EditEmployee from './components/HrDashboard/users/EditEmployeeUser';
import RRFPool from './components/HrDashboard/RRF_Pool/RRFPoolHome';
import HrAccChangePass from './components/HrDashboard/layouts/HrAccChangePass';
import EmpAccChangePass from './components/EmployeeDashboard/layouts/EmpAccChangePass';
import DRMRequisition from './components/HrDashboard/pages/DRMRequisition';

//----- Master Table Imports --------------------------------------------

import OfficeLocation from './components/HrDashboard/officeLocation/OfficeLocation';
import AddLocationForm from './components/HrDashboard/officeLocation/AddLocationForm';
import EditLocation from './components/HrDashboard/officeLocation/EditLocation';
import Technology from './components/HrDashboard/technology/Technology';
import AddTechnologyForm from './components/HrDashboard/technology/AddTechnologyForm';
import EditTechnology from './components/HrDashboard/technology/EditTechnology';
import CandidateSource from './components/HrDashboard/candidateSource/CandidateSource';
import AddCandidateSourceForm from './components/HrDashboard/candidateSource/AddCandidateSourceForm';
import EditCandidateSource from './components/HrDashboard/candidateSource/EditCandidateSource';
import CandidateStatus from './components/HrDashboard/candidateStatus/CandidateStatus';
import AddCandidateStatusForm from './components/HrDashboard/candidateStatus/AddCandidateStatusForm';
import EditCandidateStatus from './components/HrDashboard/candidateStatus/EditCandidateStatus';
import Currency from './components/HrDashboard/currency/Currency';
import AddCurrencyForm from './components/HrDashboard/currency/AddCurrencyForm';
import EditCurrency from './components/HrDashboard/currency/EditCurrency';
import RequisitionType from './components/HrDashboard/requisitionTypes/RequisitionType';
import AddRequisitionTypeForm from './components/HrDashboard/requisitionTypes/AddRequisitionTypeForm';
import EditRequisitionType from './components/HrDashboard/requisitionTypes/EditRequisitionType';
import RequisitionStatus from './components/HrDashboard/requisitionStatus/RequisitionStatus';
import EditRequisitionStatus from './components/HrDashboard/requisitionStatus/EditRequisitionStatus';
import AddRequisitionStatusForm from './components/HrDashboard/requisitionStatus/AddRequisitionStatusForm';
import TechStackTechnologies from './components/HrDashboard/techStackTechnolgies/TechStackTechnologies';
import AddTechStackTechnologiesForm from './components/HrDashboard/techStackTechnolgies/AddTechStackTechnologiesForm';
import EditTechStackTechnolgies from './components/HrDashboard/techStackTechnolgies/EditTechStackTechnologies';
import EducationalDegree from './components/HrDashboard/educationalDegree/EducationalDegree';
import AddEducationalDegreeForm from './components/HrDashboard/educationalDegree/AddEducationalDegreeForm';
import EditEducationalDegree from './components/HrDashboard/educationalDegree/EditEducationDegree';
import NoticePeriod from './components/HrDashboard/noticePeriod/NoticePeriod';
import AddNoticePeriodForm from './components/HrDashboard/noticePeriod/AddNoticePeriodForm';
import EditNoticePeriod from './components/HrDashboard/noticePeriod/EditNoticePeriod';
import BusinessUnits from './components/HrDashboard/businessUnits/BusinessUnits';
import AddBusinessUnitsForm from './components/HrDashboard/businessUnits/AddBusinessUnitsForm';
import EditBusinessUnits from './components/HrDashboard/businessUnits/EditBusinessUnits';
import TechStack from './components/HrDashboard/techStack/TechStack';
import AddTechStackForm from './components/HrDashboard/techStack/AddTechStackForm';
import EditTechStack from './components/HrDashboard/techStack/EditTechStack';





// ----------------------------------------------------------------------


export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'jobs/openings', element: <JobOpenings /> },
        { path: 'jobs/openings/job-details', element: <JobDetails /> },
        { path: 'jobs/openings/job-details/apply-job', element: <JobApply /> },
        { path: 'interview/schedule/', element: <ScheduleInterview /> },
        { path: 'interview/details/', element: <InterviewDetails /> },
        { path: 'timeline/', element: <Timeline /> },
        { path: 'upload/documents/', element: <UploadDocuments /> }, 
        { path: 'user', element: <User /> }, 
      ],
    },
    {
      path: '/user',
      element: <DashboardLayout />,
      children: [
        { path: 'profile', element: <ProfileUpdateForm /> },
      ],
    },

    // -------- PUBLIC ROUTES --------
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'verify-otp', element: <OTPForm/>},
        { path: 'employee-login', element: <EmpLogin /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '401', element: <Page401 /> },
        { path: '/', element: <Navigate to="/login" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> },

    // -------- PROTECTED ROUTES --------
    {
      path: '/resumeX',
      element: <HrDashboardLayout />,
      children: [
        { element: <Navigate to="/resumeX/app" replace /> },
        { path: 'app', element: <HrDashboardApp /> },

        // ----------- Jobs -----------
        { path: 'create-jobs', element: <HrCreateJobs /> },
        { path: 'create-jobs/create-job-form', element: <CreateJobForm /> },

        // ----------- Job Applications -----------
        { path: 'job-application', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin, ROLES.BU_HEAD, ROLES.DRM,
        ROLES.FSD_HOD, ROLES.RMG]} permissions={['can_view_job_applications']} > <HrJobApplication /> </RequireAuth> },

        { path: 'job-application/edit/:id', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin, ROLES.BU_HEAD, ROLES.DRM, 
        ROLES.FSD_HOD, ROLES.RMG]} permissions={['can_edit_job_applications']} > <EditJobApplication /> 
        </RequireAuth> },

        // ----------- Employees -----------
        //{ path: 'employees', element: <Employees /> },
        { path: 'empusers', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_employees']} > <EMPUsers /> </RequireAuth>},

        { path: 'empusers/emp-create-user', element:  <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_add_employees']} > <CreateEMPUserForm /> </RequireAuth>},

        { path: 'empusers/edit/:id', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_edit_employees']} > <EditEmployee /> </RequireAuth>},

        // ----------- FSD Users -----------
        { path: 'fsdusers', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_fsd_users']}>  <FSDUsers /> </RequireAuth>},

        { path: 'fsdusers/fsd-create-user', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_add_fsd_users']} > 
        <CreateFSDUserForm /> </RequireAuth>},

        { path: 'fsdusers/edit/:id', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_edit_fsd_users']} > <EditFsdUser /> </RequireAuth>},
        
        // ----------- Requisitions -----------
        { path: 'myrequisition', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin, ROLES.BU_HEAD, ROLES.FSD_HOD, 
        ROLES.RMG]} permissions={['can_view_requisitions']}> <MyRequisition /> </RequireAuth>},

        { path: 'otherrequisition', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin, ROLES.BU_HEAD, ROLES.FSD_HOD, 
        ROLES.RMG]} permissions={['can_view_requisitions']}>
        <OtherRequisition /> </RequireAuth> },

        { path: 'requisition/create', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin, ROLES.BU_HEAD, ROLES.FSD_HOD,
        ROLES.RMG]} permissions={['can_add_requisitions']} >
        <CreateRequisition /> </RequireAuth>},

        { path: 'requisition/edit', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin, ROLES.BU_HEAD, ROLES.FSD_HOD, ROLES.DRM, ROLES.RMG]} permissions={['can_edit_requisitions']} > <EditRequisition /> </RequireAuth>},

        { path: 'drm-requisition', element:  <RequireAuth 
        allowedRoles={[ROLES.DRM]} permissions={['can_view_requisitions']} >
        <DRMRequisition /> </RequireAuth>},


        // ----------- RRF Templates -----------
        { path: 'rrf-templates', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin, ROLES.FSD_HOD]} permissions={['can_view_RRF_template']} > <RRFTemplates /> </RequireAuth>},

        { path: 'rrf-templates/edit', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin, ROLES.FSD_HOD]} permissions={['can_edit_RRF_template']} >
        <EditRRFTemplate /> </RequireAuth>},

        { path: 'rrf-templates/create', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin, ROLES.FSD_HOD]} permissions={['can_add_RRF_template']}>
        <CreateRRFTemplate /> </RequireAuth>},

        // ----------- RRF Pool -----------
        { path: 'rrfpool', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin, ROLES.BU_HEAD, ROLES.FSD_HOD]} permissions={['can_view_rrf_pool']}>  <RRFPool /> </RequireAuth>},

        // ----------- Candidates -----------
        { path: 'candidates', element: <RequireAuth 
        allowedRoles={[ROLES.TECHNICAL_EMPLOYEE, ROLES.FSD_Admin, ROLES.BU_HEAD, ROLES.DRM, ROLES.FSD_HOD, ROLES.RMG]} permissions={['can_view_candidates']}> <Candidates /> </RequireAuth> },

        { path: 'candidates/create-candidate', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin, ROLES.DRM, ROLES.FSD_HOD, ROLES.RMG]} permissions={['can_add_candidates']}><CreateCandidateForm /> </RequireAuth>},

        { path: 'candidates/edit/:id', element: <RequireAuth allowedRoles={[  ROLES.FSD_Admin, ROLES.DRM, ROLES.FSD_HOD, ROLES.RMG, ROLES.BU_HEAD, ROLES.OnBoarding_HR]} permissions={['can_edit_candidates']}>  <EditCandidate /> </RequireAuth>},
        
        // ----------- Roles -----------

        { path: 'roles', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_roles']} > <Groups /> </RequireAuth>},

        { path: 'roles/create-role', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_add_roles']} > <CreateGroup /> </RequireAuth>},

        { path: 'roles/edit-role/:id', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_edit_roles']}> <EditGroup /> </RequireAuth> },

        { path: 'master-roles', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_master_roles']}>  <MasterRoles /> </RequireAuth> },

        // ----------- Office Locations ------------------

        { path: 'office-location', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_office_locations']} > <OfficeLocation /> </RequireAuth>},

        { path: 'office-location/add-location', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_office_locations']}><AddLocationForm /> </RequireAuth>},

        { path: 'office-location/edit/:id', element: <RequireAuth allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_office_locations']}>  <EditLocation /> </RequireAuth>},
        
        // ---------- Technology ----------

        { path: 'technology', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']} > <Technology /> </RequireAuth> },

        { path: 'technology/add-technology', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}><AddTechnologyForm /> </RequireAuth>},

        { path: 'technology/edit/:id', element: <RequireAuth allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}>  <EditTechnology /> </RequireAuth>},

        // -------- Candidate Source --------------

        { path: 'candidate-source', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']} > <CandidateSource /> </RequireAuth> },

        { path: 'candidate-source/add-candidate-source', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}><AddCandidateSourceForm /> </RequireAuth>},

        { path: 'candidate-source/edit/:id', element: <RequireAuth allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}>  <EditCandidateSource /> </RequireAuth>},

        // -------- Candidate Status --------------

        { path: 'candidate-status', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']} > <CandidateStatus /> </RequireAuth> },

        { path: 'candidate-status/add-candidate-status', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}><AddCandidateStatusForm /> </RequireAuth>},

        { path: 'candidate-status/edit/:id', element: <RequireAuth allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}>  <EditCandidateStatus   /> </RequireAuth>},

        // -------- Currency --------------

        { path: 'currency', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']} > <Currency /> </RequireAuth> },

        { path: 'currency/add-currency', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}><AddCurrencyForm /> </RequireAuth>},

        { path: 'currency/edit/:id', element: <RequireAuth allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}>  <EditCurrency   /> </RequireAuth>},

        // -------- Requisition Type --------------

        { path: 'requisition-types', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']} > <RequisitionType /> </RequireAuth> },

        { path: 'requisition-types/add-requisition-types', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}><AddRequisitionTypeForm /> </RequireAuth>},

        { path: 'requisition-types/edit/:id', element: <RequireAuth allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}>  <EditRequisitionType   /> </RequireAuth>},
  
        // -------- Requisition Status --------------

        { path: 'requisition-status', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']} > <RequisitionStatus /> </RequireAuth> },

        { path: 'requisition-status/add-requisition-status', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}><AddRequisitionStatusForm /> </RequireAuth>},

        { path: 'requisition-status/edit/:id', element: <RequireAuth allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}>  <EditRequisitionStatus   /> </RequireAuth>},
           
          
        // -------- Educational Degree --------------

        { path: 'education-degree', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']} > <EducationalDegree /> </RequireAuth> },

        { path: 'education-degree/add-education-degree', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}><AddEducationalDegreeForm /> </RequireAuth>},

        { path: 'education-degree/edit/:id', element: <RequireAuth allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}>  <EditEducationalDegree   /> </RequireAuth>},
           

        // -------- Business Units --------------

        { path: 'business-units', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']} > <BusinessUnits /> </RequireAuth> },

        { path: 'business-units/add-business-units', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}><AddBusinessUnitsForm /> </RequireAuth>},

        { path: 'business-units/edit/:id', element: <RequireAuth allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}>  <EditBusinessUnits   /> </RequireAuth>},
            
             
        // -------- TechStack Technologies --------------

        { path: 'techstack-technologies', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']} > <TechStackTechnologies /> </RequireAuth> },

        { path: 'techstack-technologies/add-techstack-technologies', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}><AddTechStackTechnologiesForm /> </RequireAuth>},

        { path: 'techstack-technologies/edit/:id', element: <RequireAuth allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}>  <EditTechStackTechnolgies   /> </RequireAuth>},
            
        // -------- TechStack --------------

        { path: 'tech-stack', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']} > <TechStack /> </RequireAuth> },

        { path: 'tech-stack/add-tech-stack', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}><AddTechStackForm /> </RequireAuth>},

        { path: 'tech-stack/edit/:id', element: <RequireAuth allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}>  <EditTechStack   /> </RequireAuth>},
            
                   
      // -------- Notice Period --------------

      { path: 'notice-period', element: <RequireAuth 
      allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']} > <NoticePeriod /> </RequireAuth> },

      { path: 'notice-period/add-notice-period', element: <RequireAuth 
      allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}><AddNoticePeriodForm /> </RequireAuth>},

      { path: 'notice-period/edit/:id', element: <RequireAuth allowedRoles={[ROLES.FSD_Admin]} permissions={['can_view_technologies']}>  <EditNoticePeriod   /> </RequireAuth>},
          
                                         
        // ----------- Others -----------
        { path: 'joinees', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin, ROLES.OnBoarding_HR, ROLES.FSD_HOD]} permissions={['can_view_joinees']} >   <Joinees /> </RequireAuth>},

        { path: 'resume-parser', element: <RequireAuth 
        allowedRoles={[ROLES.FSD_Admin, ROLES.BU_HEAD, 
        ROLES.DRM, ROLES.FSD_HOD, ROLES.RMG]} permissions={['can_view_resume_parser']} > <ResumeParser /> </RequireAuth>},

        // { path: 'products', element: <HrProducts /> },
        // { path: 'blog', element: <HrBlog /> },
        { path: 'change-password', element:  <HrAccChangePass />},
      ]
    },
    {
      path: '/employee-dashboard',
      element: <EmployeeDashboardLayout />,
      children: [
        { element: <Navigate to="/employee-dashboard/app" replace /> },
        { path: 'app', element: <EmployeeDashboardApp /> },

        // ----------- Employee Calendar -----------

        { path: 'employee-calendar', element: <RequireAuth 
        allowedRoles={[ROLES.TECH_INTERVIEWER, ROLES.NON_TECH_INTERVIEWER]} permissions={['can_view_calendar']} > <EmployeeCalendar /> </RequireAuth>},

        // ----------- Booked Interview -----------

        { path: 'booked-interview', element: <RequireAuth 
        allowedRoles={[ROLES.TECH_INTERVIEWER, ROLES.NON_TECH_INTERVIEWER]} permissions={['can_view_booked_interviews']} > <BookedInterviews /> </RequireAuth>},

        // ----------- Completed Interviews -----------

        { path: 'completed-interview', element:  <RequireAuth allowedRoles={[ROLES.TECH_INTERVIEWER, ROLES.NON_TECH_INTERVIEWER]} permissions={['can_view_completed_interviews']} > <CompletedInterview />  </RequireAuth>},

        // ----------- Booked Candidate Interview -----------

        { path: 'booked-interview/candidate-interview', element: <RequireAuth allowedRoles={[ROLES.TECH_INTERVIEWER, ROLES.NON_TECH_INTERVIEWER]} permissions={['can_view_booked_candidate_interview_details']} >
        <CandidateInterview /> </RequireAuth>},

        // ----------- Others -----------

        { path: 'user', element: <EmployeeUser /> },
        { path: 'change-password', element: <EmpAccChangePass /> },
        // { path: 'products', element: <EmployeeProducts /> },
        // { path: 'blog', element: <EmployeeBlog /> },
      ]
    },
  ]);
}
