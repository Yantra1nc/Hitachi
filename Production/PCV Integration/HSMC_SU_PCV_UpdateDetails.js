/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @Author
 */
/*************************************************************
 * File Header
 * Script Type: suitelet Script
 * Script Name:
 * File Name: 
 * Created On:
 * Modified On:
 * Created By: Tejaswini (Yantra Inc.)
 * Modified By:
 * Description:suitelet script for  update ticket details.
 *********************************************************** */
define(['N/ui/serverWidget', 'N/log', 'N/currentRecord', 'N/format', 'N/record', 'N/search', './LIB_PC_VISIOR_CONNECTION', 'N/https', 'N/xml', 'N/redirect', 'N/file'],
    function(serverWidget, log, currentRecord, format, record, search, lib, https, xml, redirect, file) {
        function onRequest(context) {
            try {

                var rec_id = context.request.parameters.recId;
                log.debug("rec_id", rec_id);

                var new_session_id = 0;

                var integration_cre_record = record.load({
                    type: 'customrecord_integration_credentials',
                    id: 2,
                    isDynamic: true
                });


                var session_id = integration_cre_record.getValue({
                    fieldId: 'custrecord22'
                });
                log.audit("oldsession_id", session_id);
                //log.debug("session_id", typeof(session_id));

                new_session_id = session_id;

                var pcv_token_url = integration_cre_record.getValue({
                    fieldId: 'custrecord_pcv_get_url'
                });
                var conct_url = pcv_token_url; //create complete url
                log.debug("conct_url", conct_url);



                log.debug('***enter into update api script*****')

                var service_desk_rec = record.load({
                    type: 'customrecord_hsmc_support',
                    id: rec_id,
                    isDynamic: true
                });
                log.debug('service_desk_rec', service_desk_rec);

                var ticket_no = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_ticket_number'
                });
                log.debug("ticket_no", ticket_no);

                //var ticket_no ='IN554079';
                //added by amisha on 04-10-2022


                //body field add by amisha on 06/10/2022

                var tick_status = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_status_field'
                });
                log.audit("tick_status***", tick_status);
                if (tick_status) {
                    if (tick_status == 'Hold') {

                        tick_status = 'WaitingforUserFeedback'
                        log.audit("tick_status***", tick_status);

                    }
                    if (tick_status == 'User not responding') {

                        tick_status = 'Usernotresponding';
                        log.audit("tick_status***", tick_status);

                    }
                    if (tick_status == 'Awaiting user confirmation') {

                        tick_status = 'Awaitinguserconfirmation';
                        log.audit("tick_status***", tick_status);

                    }
                    if (tick_status == 'Scheduled') {

                        tick_status = 'Scheduled'
                        log.audit("tick_status***", tick_status);

                    }
					 if (tick_status == 'WIP') {

                        tick_status = '4.InProgress'
                        log.audit("tick_status***", tick_status);

                    }

                    if (tick_status == 'Resolved') {

                        tick_status = 'Solved'
                        log.audit("tick_status***", tick_status);

                    }
                    if (tick_status == 'Open') {

                        tick_status = '1.New'
                        log.audit("tick_status***", tick_status);

                    }
                    if (tick_status == 'Closed') {

                        tick_status = 'C.Closed'
                        log.audit("tick_status***", tick_status);

                    }
                    if (tick_status == 'Under Observation') {

                        tick_status = 'UnderObservation'
                        log.audit("tick_status***", tick_status);

                    }
                    if (tick_status == 'Pending with OEM') {

                        tick_status = 'PendingwithOEM'
                        log.audit("tick_status***", tick_status);
                    }

                }


                var tick_resolution = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_resolution_field_new'
                });
				
                log.debug("tick_resolution", tick_resolution);
				
				if(tick_resolution){
					if(tick_resolution=='Hardware Replaced'){
						tick_resolution='HardwareReplaced';
					}
					if(tick_resolution=='New software installed'){
						tick_resolution='Newsoftwareinstalled';
					}
					if(tick_resolution=='No Response from User'){
						tick_resolution='NoResponse';
					}
					if(tick_resolution=='Not Resolved'){
						tick_resolution='NotResolved';
					}
					if(tick_resolution=='OS reinstalled'){
						tick_resolution='OSreinstalled';
					}
					if(tick_resolution=='Training Given'){
						tick_resolution='TrainingGiven';
					}
					if(tick_resolution=='Solved'){
						tick_resolution='AdviceGiven';
					}
				}


                var tick_summary = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_summary'
                });
                log.debug("tick_summary", tick_summary);

                var tick_severity = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_severity_field_new'
                });
                log.debug("tick_severity", tick_severity);

                var tickCategory = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_category_field_new'
                });
                log.debug("tickCategory", tickCategory);

                var tickOrganizationName = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_organization'
                });
                log.debug("tickOrganizationName", tickOrganizationName);

                /* var tickOrganization = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_organization'
                });
                log.debug("tickOrganization", tickOrganization); */

                var tickSubmitter = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_submitter_name'
                });
                log.debug("tickSubmitter", tickSubmitter);

                var tickSubmitterEmail = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_submitter_email'
                });
                log.debug("tickSubmitterEmail", tickSubmitterEmail);

                //get custom fields data 



                var ticket_custom_subStatus = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_sub_status_field'
                });
                log.debug("ticket_custom_subStatus", ticket_custom_subStatus)

                var ticket_custom_engineerName = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_engineer_name_field'
                });
                log.debug("ticket_custom_engineerName", ticket_custom_engineerName);

                var ticket_customDefineResponseTime = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_define_response_time'
                });
                log.debug("ticket_customDefineResponseTime", ticket_customDefineResponseTime);

                var ticket_customDefineResolutionTime = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_define_resolution_time'
                });
                log.debug("ticket_customDefineResolutionTime", ticket_customDefineResolutionTime);

                var ticket_customResponseSLA = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_response_sla'
                });
                log.debug("ticket_customResponseSLA", ticket_customResponseSLA);

                var ticket_customResolutionSLA = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_resolution_sla'
                });
                log.debug("ticket_customResolutionSLA", ticket_customResolutionSLA);

                var ticket_customExceptionReason = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_exception_reason'
                });
                log.debug("ticket_customExceptionReason", ticket_customExceptionReason);



                var ticket_customTotalResponseTakenTime = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_totalresponse_taken_time'
                });
                log.debug("ticket_customTotalResponseTakenTime", ticket_customTotalResponseTakenTime);

                var ticket_customVendorOEMTicketNumber = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_vendor_oem_ticket_number'
                });
                log.debug("ticket_customVendorOEMTicketNumber", ticket_customVendorOEMTicketNumber);

                var ticket_customOEMVendor = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_oemvendor'
                });
                log.debug("ticket_customOEMVendor", ticket_customOEMVendor);

                var ticket_customAssetCount = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_asset_count'
                });
                log.debug("ticket_customAssetCount", ticket_customAssetCount);

                var ticket_customPartRequirement = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_part_requirement'
                });
                log.debug("ticket_customPartRequirement", ticket_customPartRequirement);

                var ticket_customPartDescription = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_partdescription'
                });
                log.debug("ticket_customPartDescription", ticket_customPartDescription);

                var ticket_customState = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_state_field_new'
                });
                log.debug("ticket_customState", ticket_customState);

                var ticket_discription = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_resolution_description'
                });
                log.debug("ticket_discription", ticket_discription);

                var ticket_customUserName = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_user_name'
                });
                log.debug("ticket_customUserName", ticket_customUserName);

                var ticket_customResolverGroup = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_resolver_group'
                });
                log.debug("ticket_customResolverGroup", ticket_customResolverGroup);

                var ticket_customFCRprovidede = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_fcr_provided'
                });
                log.debug("ticket_customFCRprovidede", ticket_customFCRprovidede);

                var ticket_customFCREngineer = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_fcr_engineer'
                });
                log.debug("ticket_customFCREngineer", ticket_customFCREngineer);

                var ticket_custom_holdReason = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_hold_reason_field'
                });
                log.debug("ticket_custom_holdReason", ticket_custom_holdReason);

                var ticket_custom_holdDateTime = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_hold_date_time'
                });
                log.debug("ticket_custom_holdDateTime", ticket_custom_holdDateTime);

                var ticket_custom_resolutionTakenTime = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_totalresolutiontakentime'
                });
                log.debug("ticket_custom_resolutionTakenTime", ticket_custom_resolutionTakenTime);

                var ticket_custom_systemSerial = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_system_serial'
                });
                log.debug("ticket_custom_systemSerial", ticket_custom_systemSerial);

                var ticket_custom_organisationAddress = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_organization_address'
                });
                log.debug("ticket_custom_organisationAddress", ticket_custom_organisationAddress);

                var ticket_custom_contractType = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_contract_type'
                });
                log.debug("ticket_custom_contractType", ticket_custom_contractType);

                var ticket_custom_customerContract = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_customer_contact'
                });
                log.debug("ticket_custom_customerContract", ticket_custom_customerContract);

                var ticket_custom_customerEmail = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_customer_email'
                });
                log.debug("ticket_custom_customerEmail", ticket_custom_customerEmail);
                //


                var ticket_custom_totalHoldTime = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_total_hold_time'
                });
                log.debug("ticket_custom_totalHoldTime", ticket_custom_totalHoldTime);



                var ticket_custom_resolutionDateTime = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_resolution_date_time'
                });
                log.debug("ticket_custom_resolutionDateTime", ticket_custom_resolutionDateTime);

                var ticket_custom_requestType = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_request_type'
                });
                log.debug("ticket_custom_requestType", ticket_custom_requestType);

                var ticket_custom_supportType = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_support_type'
                });
                log.debug("ticket_custom_supportType", ticket_custom_supportType);

                var ticket_custom_holdTimeEnd = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_holdtime_end'
                });
                log.debug("ticket_custom_holdTimeEnd", ticket_custom_holdTimeEnd);


                var ticket_custom_responseAt = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_response_at'
                });
                log.debug("ticket_custom_responseAt", ticket_custom_responseAt);


                var ticket_custom_underObservationDate = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_under_observation_date'
                });
                log.debug("ticket_custom_underObservationDate", ticket_custom_underObservationDate);


                var ticket_custom_soNo = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_so_no'
                });
                log.debug("ticket_custom_soNo", ticket_custom_soNo);


                var ticket_custom_invoiceNo = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_invoice_no'
                });
                log.debug("ticket_custom_invoiceNo", ticket_custom_invoiceNo);


                var ticket_custom_closureStatus = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_closure_status'
                });
                log.debug("ticket_custom_closureStatus", ticket_custom_closureStatus);

                var ticket_custom_pendingRemarks = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_pending_remarks'
                });
                log.debug("ticket_custom_pendingRemarks", ticket_custom_pendingRemarks);

                var ticket_customAWS_AccountId = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_aws_account_id'
                });
                log.debug("ticket_customAWS_AccountId", ticket_customAWS_AccountId);

                var ticket_customAWS_CaseId = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_aws_case_id'
                });
                log.debug("ticket_customAWS_CaseId", ticket_customAWS_CaseId);

                var ticket_customAWS_CommTime = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_aws_comm_time'
                });
                log.debug("ticket_customAWS_CommTime", ticket_customAWS_CommTime);

                var tick_resolutionNotes = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_resolution_notes_sd'
                });
                log.debug("tick_resolutionNotes", tick_resolutionNotes);
               // log.audit("tick_resolutionNotes>>>>>>>>>>>>>",


                /* var ticket_customResponseAt = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_response_at'
                });
                log.debug("ticket_customResponseAt", ticket_customResponseAt); */

                var ticket_customTACnumber = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_tac_number'
                });
                log.debug("ticket_customTACnumber", ticket_customTACnumber);

                var ticket_customOEM = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_oem_new'
                });
                log.debug("ticket_customOEM", ticket_customOEM);

                var ticket_customEmpCode = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_emp_code'
                });
                log.debug("ticket_customEmpCode", ticket_customEmpCode);

                var ticket_customCSField = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_cs_field'
                });
                log.debug("ticket_customCSField", ticket_customCSField);

                var ticket_customContract_Location = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_contract_location'
                });
                log.debug("ticket_customContract_Location", ticket_customContract_Location);

                var ticket_customAccount_Manager = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_account_manager'
                });
                log.debug("ticket_customAccount_Manager", ticket_customAccount_Manager);

                var ticket_customPreviousStatus = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_previous_status'
                });
                log.debug("ticket_customPreviousStatus", ticket_customPreviousStatus);

                var ticket_customItemPrice = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_item_price'
                });
                log.debug("ticket_customItemPrice", ticket_customItemPrice);

                var ticket_customExceptionRequesterName = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_exceptionrequestername'
                });
                log.debug("ticket_customExceptionRequesterName", ticket_customExceptionRequesterName);

                var ticket_customExceptionReasonforApproval = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_exceptionreasonapproval'
                });
                log.debug("ticket_customExceptionReasonforApproval", ticket_customExceptionReasonforApproval);

                var ticket_customExceptionApprovedby = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_exceptionapproved_by'
                });
                log.debug("ticket_customExceptionApprovedby", ticket_customExceptionApprovedby);

                var ticket_customExceptionExceptionApprovalRequired = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_exceptionapprovalrequire'
                });
                log.debug("ticket_customExceptionExceptionApprovalRequired", ticket_customExceptionExceptionApprovalRequired);

                var ticket_customResolvedBy = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_resolved_by'
                });
                log.debug("ticket_customResolvedBy", ticket_customResolvedBy);

                var ticket_customGSDAgent = service_desk_rec.getText({
                    fieldId: 'custrecord_hsmc_gsd_agent'
                });
                log.debug("ticket_customGSDAgent", ticket_customGSDAgent);

                var ticket_customSolIdBranchCode = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_solid_branch_code'
                });
                log.debug("ticket_customSolIdBranchCode", ticket_customSolIdBranchCode);
				
				
				var ticket_customEngassignmenttm = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_engassignmenttm'
                });
                log.debug("ticket_customEngassignmenttm", ticket_customEngassignmenttm);
				
				var ticket_customTac_closure_date = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_tac_closure_date'
                });
                log.debug("ticket_customTac_closure_date", ticket_customTac_closure_date);
				
				var ticket_customTaccreation_date = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_taccreation_date'
                });
                log.debug("ticket_customTaccreation_date", ticket_customTaccreation_date);
				
				var assigneeName = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_assignee'
                });
                log.debug("assigneeName", assigneeName);
				
				var assigneeEmail = service_desk_rec.getValue({
                    fieldId: 'custrecord_hsmc_assignee_email'
                });
                log.debug("assigneeEmail", assigneeEmail);
				
				
				
				




               
                    var session_id = lib._pcvisior_getSessionID()
                    log.debug("session_id", session_id);

                    new_session_id = session_id;
					 var strVar = "";
            strVar += "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
            strVar += "<soap:Envelope xmlns:xsi=\"http:\/\/www.w3.org\/2001\/XMLSchema-instance\" xmlns:xsd=\"http:\/\/www.w3.org\/2001\/XMLSchema\" xmlns:soap=\"http:\/\/schemas.xmlsoap.org\/soap\/envelope\/\">";
            strVar += "    <soap:Body>";
            strVar += "        <UpdateIncident xmlns=\"vsaServiceDeskWS\">";
            strVar += "            <req>";
            strVar += "                <UpdateSDIncident id=\"15599257070039272020533499\">";
            strVar += "                    <ServiceDeskName xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">Incident<\/ServiceDeskName>";
            strVar += "                    <IncidentNumber xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">" + ticket_no + "<\/IncidentNumber>";
            if (tick_summary) {
                strVar += "                    <Summary xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">" + tick_summary.replace(/[&\/\\#^+()$~%.'":*?<>{}!@=]/g, '') + "<\/Summary>";
            }
            if (ticket_discription) {
                strVar += "                    <Description xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">" + ticket_discription.replace(/[&\/\\#^+()$~%.'":*?<>{}!@=]/g, '') + "<\/Description>";
            }
            if (tick_status) {
                strVar += "                    <Status xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">Incident||" + tick_status + "<\/Status>";
            }
           
			   
             if(tick_resolution){
                strVar += "                    <Resolution xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">Incident||"+tick_resolution+ "<\/Resolution>";
				} 
			
            /* strVar += "                    <Stage xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">Incident||WIP<\/Stage>"; */
            /* strVar += "                    <Severity xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">Incident||"+tick_severity+"<\/Severity>";
            strVar += "                    <Category xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">Incident||865798361210989<\/Category>"; */
            /* strVar += "                    <Policy xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">Gold_SLA<\/Policy>"; */
            /* strVar += "                    <CreateDateTime xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">2022-08-23T16:20:23.51+05:30<\/CreateDateTime>";
            strVar += "                    <LastEditDateTime xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">2022-08-26T11:42:41.037+05:30<\/LastEditDateTime>"; */
            /* strVar += "                    <OrganizationName xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">Hitachi Systems India Pvt Ltd.<\/OrganizationName>"; */
            /* strVar += "                    <Organization xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">9120172<\/Organization>"; */
            /*  strVar += "                    <Submitter xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">"+tickSubmitter+"<\/Submitter>"; */
            /* strVar += "                    <SubmitterEmail xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">"+tickSubmitterEmail+"<\/SubmitterEmail>"; */
            /* strVar += "                    <SubmitterType xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">PARTICIPANT<\/SubmitterType>"; */
            /* strVar += "                    <IsUnread xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">false<\/IsUnread>"; */
            /* strVar += "                    <InventoryAssetID xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">0<\/InventoryAssetID>"; */
            /* strVar += "                    <IsParticipant xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">false<\/IsParticipant>"; */
            /* strVar += "                    <Owner xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">pardeep<\/Owner>"; */
             strVar += "                    <AssigneeType xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">PARTICIPANT<\/AssigneeType>"; 
			 strVar +="<Assignee xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">"+assigneeName+"<\/Assignee>";
          strVar += "<AssigneeEmail xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">"+assigneeEmail+"<\/AssigneeEmail>";
			 
            /* strVar += "                    <ExpectedCompletionDate xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">2022-08-24T00:00:00+05:30<\/ExpectedCompletionDate>"; */
            /* strVar += "                    <ActualResolutionDate xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">2022-08-24T18:27:57.623+05:30<\/ActualResolutionDate>"; */
            /* strVar += "                    <IsArchived xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">false<\/IsArchived>";
            strVar += "                    <IsError xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">false<\/IsError>";
            strVar += "                    <Notify xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">false<\/Notify>"; */
           
				if(tick_resolutionNotes){
                strVar += "                    <ResolutionNote xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">" +tick_resolutionNotes.replace(/[&\/\\#^+()$~%.'":*?<>{}!@=]/g, '') + "<\/ResolutionNote>";
				}
            
             strVar += "                    <SourceType xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">ServiceDesk<\/SourceType>"; 
            strVar += "                    <CustomFields xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">";
			if(ticket_custom_engineerName){
             strVar += "                        <Field fieldName=\"EngineerName\">"+ticket_custom_engineerName+"<\/Field>"; 
			}else{
				 strVar +="<Field fieldName=\"EngineerName\" \/>";
			}
            if (ticket_custom_subStatus) {
                strVar += "                        <Field fieldName=\"SubStatus\">" + ticket_custom_subStatus + "<\/Field>";
            }
			else{
				 strVar +="<Field fieldName=\"SubStatus\" \/>";
			}
            if (ticket_custom_holdReason) {
				
                strVar += "                        <Field fieldName=\"HoldReason\">" + ticket_custom_holdReason + "<\/Field>";
			
				
            }
			
			if(ticket_customDefineResponseTime){
             strVar += "                        <Field fieldName=\"DefineResponseTime\">"+ticket_customDefineResponseTime+"<\/Field>"; 
			}
			else{
				strVar +="<Field fieldName=\"DefineResponseTime\" \/>";
			}
			if(ticket_customDefineResolutionTime){
             strVar += "                        <Field fieldName=\"DefineResolutionTime\">"+ticket_customDefineResolutionTime+"<\/Field>"; 
			}
			else{
				strVar +="<Field fieldName=\"DefineResolutionTime\" \/>";
			}
			if(ticket_customResponseSLA){
             strVar += "                        <Field fieldName=\"ResponseSLA\">"+ticket_customResponseSLA+"<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"ResponseSLA\" \/>";
			}
			if(ticket_customResolutionSLA){
            strVar += "                        <Field fieldName=\"ResolutionSLA\">"+ticket_customResolutionSLA+"<\/Field>"; 
			}
			else{
				strVar +="<Field fieldName=\"ResolutionSLA\" \/>";
			}
			if(ticket_custom_holdDateTime){
            strVar += "                        <Field fieldName=\"HoldDateTime\">" + ticket_custom_holdDateTime + "<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"HoldDateTime\" \/>";
			}
			if(ticket_customTotalResponseTakenTime){
             strVar += "                        <Field fieldName=\"TotalResponseTakenTime\">"+ticket_customTotalResponseTakenTime+"<\/Field>"; 
			}
			else{
				strVar +="<Field fieldName=\"TotalResponseTakenTime\" \/>";
			}
            if (ticket_custom_resolutionTakenTime) {
                strVar += "                        <Field fieldName=\"TotalResolutionTakenTime\">" + ticket_custom_resolutionTakenTime + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"TotalResolutionTakenTime\" \/>";
			}
            if (ticket_custom_systemSerial) {
                strVar += "                        <Field fieldName=\"SystemSerial\">" + ticket_custom_systemSerial + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"SystemSerial\" \/>";
			}
            if (ticket_custom_organisationAddress) {
                strVar += "                        <Field fieldName=\"OrganizationAddress\">" + ticket_custom_organisationAddress.replace(/[&\/\\#^+()$~%.'":*?<>{}!@=]/g, '') + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"OrganizationAddress\" \/>";
			}
            if (ticket_custom_contractType) {
                strVar += "                        <Field fieldName=\"ContractType\">" + ticket_custom_contractType + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"ContractType\" \/>";
			}
            if (ticket_custom_customerContract) {
                strVar += "                        <Field fieldName=\"CustomerContact\">" + ticket_custom_customerContract + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"CustomerContact\" \/>";
			}
            if (ticket_custom_customerEmail) {
                strVar += "                        <Field fieldName=\"CustomerEmail\">" + ticket_custom_customerEmail + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"CustomerEmail\" \/>";
			}
			if(ticket_customVendorOEMTicketNumber){
             strVar += "                        <Field fieldName=\"VendorOEMTicketNumber\">"+ ticket_customVendorOEMTicketNumber+"<\/Field>"; 
			}
			else{
				strVar +="<Field fieldName=\"VendorOEMTicketNumber\" \/>";
			}
            if (ticket_custom_totalHoldTime) {
                strVar += "                        <Field fieldName=\"TotalHoldTime\">" + ticket_custom_totalHoldTime + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"TotalHoldTime\" \/>";
			}
			if(ticket_customOEMVendor){
             strVar += "                        <Field fieldName=\"OEMVendor\">"+ticket_customOEMVendor+"<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"OEMVendor\" \/>";
			}
			if(ticket_customAssetCount){
            strVar += "                        <Field fieldName=\"AssetCount\">"+ticket_customAssetCount + "<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"AssetCount\" \/>";
			}
			if(ticket_customPartRequirement){
            strVar += "                        <Field fieldName=\"PartRequirement\">"+ticket_customPartRequirement + "<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"PartRequirement\" \/>";
			}
			if(ticket_customPartDescription){
            strVar += "                        <Field fieldName=\"PartDescription\">"+ticket_customPartDescription + "<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"PartDescription\" \/>";
			}
			if(ticket_customState){
            strVar += "                        <Field fieldName=\"State\">"+ticket_customState+"<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"State\" \/>";
			}
			if(ticket_customUserName){
            strVar += "                        <Field fieldName=\"UserName\">"+ ticket_customUserName+"<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"UserName\" \/>";
			}
			if(ticket_customResolverGroup){
            strVar += "                        <Field fieldName=\"ResolverGroup\">" + ticket_customResolverGroup + "<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"ResolverGroup\" \/>";
			}
			if(ticket_customFCRprovidede){
            strVar += "                        <Field fieldName=\"FCRprovided\">" + ticket_customFCRprovidede+"<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"FCRprovided\" \/>";
			}
			if(ticket_customFCREngineer){
            strVar += "                        <Field fieldName=\"FCREngineer\">" + ticket_customFCREngineer+"<\/Field>"; 
			}
			else{
				strVar +="<Field fieldName=\"FCREngineer\" \/>";
			}
            if (ticket_custom_resolutionDateTime) {
                strVar += "                        <Field fieldName=\"ResolutionDateTime\">" + ticket_custom_resolutionDateTime + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"ResolutionDateTime\" \/>";
			}
            if (ticket_custom_requestType) {
                strVar += "                        <Field fieldName=\"RequestType\">" + ticket_custom_requestType + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"RequestType\" \/>";
			}
            if (ticket_custom_supportType) {
                strVar += "                        <Field fieldName=\"SupportType\">" + ticket_custom_supportType + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"SupportType\" \/>";
			}
            if (ticket_custom_holdTimeEnd) {
                strVar += "                        <Field fieldName=\"HoldTimeEnd\">" + ticket_custom_holdTimeEnd + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"HoldTimeEnd\" \/>";
			}
            if (ticket_custom_responseAt) {
                strVar += "                        <Field fieldName=\"ResponseAt\">" + ticket_custom_responseAt + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"ResponseAt\" \/>";
			}
			if(ticket_customTACnumber){
             strVar += "                        <Field fieldName=\"TACnumber\">"+ticket_customTACnumber+"<\/Field>"; 
			}
			else{
				strVar +="<Field fieldName=\"TACnumber\" \/>";
			}
			if(ticket_customTaccreation_date){
             strVar += "                        <Field fieldName=\"TACCreationDate\">"+ticket_customTaccreation_date+"<\/Field>";
			}else{
				 strVar += "                        <Field fieldName=\"TACCreationDate\" \/>";
			}
			if(ticket_customTac_closure_date){
             strVar += "                       <Field fieldName=\"TACClosureDate\">"+ticket_customTac_closure_date+"<\/Field>"; 
			}
			else{
				strVar += "                        <Field fieldName=\"TACClosureDate\" \/>"; 
			}
			 if(ticket_customOEM){
             strVar += "                        <Field fieldName=\"OEM\">"+ticket_customOEM+"<\/Field>"; 
			 }
			 else{
				 strVar +="<Field fieldName=\"OEM\" \/>";
			 }
            if (ticket_custom_underObservationDate) {
                strVar += "                        <Field fieldName=\"UnderObservationDate\">" + ticket_custom_underObservationDate + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"UnderObservationDate\" \/>";
			}
			if(ticket_customEmpCode){
             strVar += "                        <Field fieldName=\"EmpCode\">"+ticket_customEmpCode+"<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"EmpCode\" \/>";
			}
			if(ticket_customCSField){
            strVar += "                        <Field fieldName=\"CSField\">"+ticket_customCSField+"<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"CSField\" \/>";
			}
			if(ticket_customEngassignmenttm){
             strVar += "                        <Field fieldName=\"EngAssignmentTm\">"+ticket_customEngassignmenttm+"<\/Field>"; 
			}
			else{
				strVar += "                        <Field fieldName=\"EngAssignmentTm\" \/>";
			}
			 if(ticket_customContract_Location){
            strVar += "                        <Field fieldName=\"Contract_Location\">"+ticket_customContract_Location+"<\/Field>";
			 }
			 else{
				 strVar +="<Field fieldName=\"Contract_Location\" \/>";
			 }
			 if(ticket_customAccount_Manager){
            strVar += "                        <Field fieldName=\"Account_Manager\" >"+ticket_customAccount_Manager+"<\/Field>";
			 }
			 else{
				 strVar +="<Field fieldName=\"Account_Manager\" \/>";
			 }
			 if(ticket_customPreviousStatus){
            strVar += "                        <Field fieldName=\"PreviousStatus\">"+ticket_customPreviousStatus+"<\/Field>";
			 }
			 else{
				 strVar +="<Field fieldName=\"PreviousStatus\" \/>";
			 }
			 if(ticket_customExceptionReason){
            strVar += "                        <Field fieldName=\"ExceptionReason\">"+ticket_customExceptionReason+"<\/Field>";
			 }
			 else{
				 strVar +="<Field fieldName=\"ExceptionReason\" \/>";
			 }
			 if(ticket_customItemPrice){
            strVar += "                        <Field fieldName=\"ItemPrice\">"+ticket_customItemPrice+"<\/Field>";
			 }
			 else{
				 strVar +="<Field fieldName=\"ItemPrice\" \/>";
			 }
			 if(ticket_customExceptionRequesterName){
            strVar += "                        <Field fieldName=\"ExceptionRequesterName\" >"+ticket_customExceptionRequesterName+"<\/Field>";
			 }
			 else{
				 strVar +="<Field fieldName=\"ExceptionRequesterName\" \/>";
			 }
			 if(ticket_customExceptionReasonforApproval){
            strVar += "                        <Field fieldName=\"ExceptionReasonforApproval\">"+ticket_customExceptionReasonforApproval+"<\/Field>";
			 }
			 else{
				 strVar +="<Field fieldName=\"ExceptionReasonforApproval\" \/>";
			 }
			 if(ticket_customExceptionExceptionApprovalRequired){
            strVar += "                        <Field fieldName=\"ExceptionApprovalRequired\" >"+ticket_customExceptionExceptionApprovalRequired+"<\/Field>";
			 }
			 else{
				 strVar +="<Field fieldName=\"ExceptionApprovalRequired\" \/>";
			 }
			 if(ticket_customExceptionApprovedby){
            strVar += "                        <Field fieldName=\"ExceptionApprovedby\">"+ticket_customExceptionApprovedby+"<\/Field>";
			 }
			 else{
				 strVar +="<Field fieldName=\"ExceptionApprovedby\" \/>";
			 }
			 if(ticket_customResolvedBy){
            strVar += "                        <Field fieldName=\"ResolvedBy\">"+ticket_customResolvedBy+"<\/Field>";
			 }
			 else{
				 strVar +="<Field fieldName=\"ResolvedBy\" \/>";
			 }
			 if(ticket_customGSDAgent){
            strVar += "                        <Field fieldName=\"GSDAgent\">"+ticket_customGSDAgent+"<\/Field>"; 
			 }
			 else{
				 strVar +="<Field fieldName=\"GSDAgent\" \/>";
			 }
            if (ticket_custom_soNo) {
                strVar += "                        <Field fieldName=\"SONo\">" + ticket_custom_soNo + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"SONo\" \/>";
			}
            if (ticket_custom_invoiceNo) {
                strVar += "                        <Field fieldName=\"InvoiceNo\">" + ticket_custom_invoiceNo + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"InvoiceNo\" \/>";
			}
			
			if(ticket_customSolIdBranchCode){
             strVar += "                        <Field fieldName=\"SolIdBranchCode\">" + ticket_customSolIdBranchCode + "<\/Field>"; 
			}
			else{
				strVar +="<Field fieldName=\"SolIdBranchCode\" \/>";
			}
            if (ticket_custom_closureStatus) {
                strVar += "                        <Field fieldName=\"ClosureStatus\">" + ticket_custom_closureStatus + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"ClosureStatus\" \/>";
			}
            if (ticket_custom_pendingRemarks) {
                strVar += "                        <Field fieldName=\"PendingRemarks\">" + ticket_custom_pendingRemarks + "<\/Field>";
            }
			else{
				strVar +="<Field fieldName=\"PendingRemarks\" \/>";
			}
			if(ticket_customAWS_AccountId){
              strVar += "                        <Field fieldName=\"AWS_AccountId\">" + ticket_customAWS_AccountId + "<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"AWS_AccountId\" \/>";
			}
			if(ticket_customAWS_CaseId){
             strVar += "                        <Field fieldName=\"AWS_CaseId\">"+ticket_customAWS_CaseId+"<\/Field>";
			}
			else{
				strVar +="<Field fieldName=\"AWS_CaseId\" \/>";
			}
			if(ticket_customAWS_CommTime){
             strVar += "                        <Field fieldName=\"AWS_CommTime\">"+ticket_customAWS_CommTime+"<\/Field>"; 
			}
			else{
				strVar +="<Field fieldName=\"AWS_CommTime\" \/>";
			}
            strVar += "                    <\/CustomFields>";
            strVar += "                <\/UpdateSDIncident>";
            strVar += "                <SessionID>" + new_session_id + "<\/SessionID>";
            strVar += "            <\/req>";
            strVar += "        <\/UpdateIncident>";
            strVar += "    <\/soap:Body>";
            strVar += "<\/soap:Envelope>";



            var response = https.post({
                url: conct_url,
                headers: {
                    "Content-Type": 'text/xml',
                    "SOAPAction": 'vsaServiceDeskWS/UpdateIncident',
                    "Accept": 'text/xml'
                },
                body: strVar
            });

            log.debug("after new session generation updation response", response);

                    


                




            } catch (e) {
                log.error("error in ticket updation", e);
            }

        }

        

        return {
            onRequest: onRequest
        };
    });
