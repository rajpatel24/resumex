const PERMISSIONS = {
    'ADMIN': ['can_view_candidates', 'can_create_candidate', 'can_view_requisitions', 'can_create_requisitions', 'can_edit_requisitions', 'can_view_requisitions',
    'can_edit_candidate'],
    'HR': ['can_view_candidates', 'can_view_requisitions', 'can_edit_candidate', 'can_edit_RRF_template', 
    'can_view_RRF_template', 'can_create_RRF_template',
    'can_create_requisitions'],
    'Employee': ['can_view_candidates','can_edit_candidate'],
    'BU_HEAD': ['can_view_requisitions', 'can_create_requisitions', 'can_edit_requisitions', 'can_view_candidates', 'can_view_job_applications', 'can_edit_job_applications']
}

export default PERMISSIONS;
