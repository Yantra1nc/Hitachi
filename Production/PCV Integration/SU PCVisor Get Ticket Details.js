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
 * Created On:20/08/2022
 * Modified On:
 * Created By: Tejaswini (Yantra Inc.)
 * Modified By:Amisha Tyagi
 * Description:suitelet script for  get ticket details.
 *********************************************************** */
define(['N/ui/serverWidget', 'N/log', 'N/currentRecord', 'N/format', 'N/record', 'N/search', './LIB_PC_VISIOR_CONNECTION', 'N/https', 'N/xml', 'N/redirect'],
    function(serverWidget, log, currentRecord, format, record, search, lib, https, xml, redirect) {
		var arr=[];
        function onRequest(context) {
try{
            var rec_id = context.request.parameters.recId;
            log.debug("rec_id", rec_id);
          var taskrecId = context.request.parameters.taskrecId;
            log.debug("rec_id", taskrecId);

        var new_session_id=0;

             var service_desk_rec = record.load({
                type: 'customrecord_hsmc_support',
                id: rec_id,
                isDynamic: true
            });
          //  log.debug('service_desk_rec', service_desk_rec);

            var ticket_no = service_desk_rec.getText({
                fieldId: 'custrecord_hsmc_ticket_number'
            });
         //   log.debug("ticket_no", ticket_no);
				var integration_cre_record = record.load({
                    type: 'customrecord_integration_credentials'
                    , id: 2
                    , isDynamic: true
                });
                var session_id = integration_cre_record.getValue({
                    fieldId: 'custrecord22'
                });
                 // log.audit("oldsession_id", session_id);

                new_session_id=session_id;
				
				var pcv_token_url = integration_cre_record.getValue({
                    fieldId: 'custrecord_pcv_get_url'
                });
             var conct_url = pcv_token_url; //create complete url
           // log.debug("conct_url", conct_url);



            try {
                var strNode = "";
                strNode += "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
                strNode += "<soap:Envelope xmlns:xsi=\"http:\/\/www.w3.org\/2001\/XMLSchema-instance\" xmlns:xsd=\"http:\/\/www.w3.org\/2001\/XMLSchema\" xmlns:soap=\"http:\/\/schemas.xmlsoap.org\/soap\/envelope\/\">";
                strNode += "<soap:Body>";
                strNode += "<GetIncident xmlns=\"vsaServiceDeskWS\">";
                strNode += "<req>";
                strNode += "<IncidentRequest>";
                strNode += "<IncidentNumber xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">" + ticket_no + "<\/IncidentNumber>";
                strNode += "<IncludeNotes xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">true<\/IncludeNotes>";
                strNode += "<IncludeDefinition xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">true<\/IncludeDefinition>";
                strNode += "<\/IncidentRequest>";
                strNode += "<SessionID>"+new_session_id+"<\/SessionID>";
                strNode += "<\/req>";
                strNode += "<\/GetIncident>";
                strNode += "<\/soap:Body>";
                strNode += "<\/soap:Envelope>";

                //log.debug("strNode", strNode);
            } catch (ex) {
                log.debug("ex in xml", ex);
            }
//log.audit('enter into old session id','enter into old session id')

             var response = https.post({
                url:conct_url,
                headers: {
                    "Content-Type": 'text/xml',
                    "SOAPAction": 'vsaServiceDeskWS/GetIncident',
                    "Accept": 'text/xml'
                },
                body: strNode
            });

           // log.debug("response", response); 
			
			 var xmlDocument = xml.Parser.fromString({
                text: response.body
            });
            var bodyNode = xml.XPath.select({
                node: xmlDocument,
                xpath: '//soap:Body'
            }); 
            

            for (var i = 0; i < bodyNode.length; i++) {
var session_error = bodyNode[i].getElementsByTagName({
                    tagName: 'ErrorMessage',

                });
				//log.audit("session_error",session_error);
				
				var sessionErrorContent=session_error[0].textContent;
			} 
			var sessionError=sessionErrorContent.substring(0,11)
			//log.debug('session_error',sessionError)
            if(sessionError==='Error #5000'||sessionError=='Object refe'){
				
			

                var session_id = lib._pcvisior_getSessionID()
               // log.audit("newsession_id*****", session_id);
				
				 new_session_id=session_id;
				 
				
				// log.audit('////////enter into after error new_session_id','new_session_id ')
				 try {
					 
                var strNode = "";
                strNode += "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
                strNode += "<soap:Envelope xmlns:xsi=\"http:\/\/www.w3.org\/2001\/XMLSchema-instance\" xmlns:xsd=\"http:\/\/www.w3.org\/2001\/XMLSchema\" xmlns:soap=\"http:\/\/schemas.xmlsoap.org\/soap\/envelope\/\">";
                strNode += "<soap:Body>";
                strNode += "<GetIncident xmlns=\"vsaServiceDeskWS\">";
                strNode += "<req>";
                strNode += "<IncidentRequest>";
                strNode += "<IncidentNumber xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">" + ticket_no + "<\/IncidentNumber>";
                strNode += "<IncludeNotes xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">true<\/IncludeNotes>";
                strNode += "<IncludeDefinition xmlns=\"http:\/\/www.kaseya.com\/vsa\/2007\/12\/ServiceDeskDefinition.xsd\">true<\/IncludeDefinition>";
                strNode += "<\/IncidentRequest>";
                strNode += "<SessionID>"+new_session_id+"<\/SessionID>";
                strNode += "<\/req>";
                strNode += "<\/GetIncident>";
                strNode += "<\/soap:Body>";
                strNode += "<\/soap:Envelope>";

                //log.debug("strNode", strNode);
            } catch (ex) {
                log.debug("ex in xml", ex);
            }


             var response = https.post({
                url:conct_url,
                headers: {
                    "Content-Type": 'text/xml',
                    "SOAPAction": 'vsaServiceDeskWS/GetIncident',
                    "Accept": 'text/xml'
                },
                body: strNode
            });

           // log.debug("response", response); 
			
			 var xmlDocument = xml.Parser.fromString({
                text: response.body
            });
            var bodyNode = xml.XPath.select({
                node: xmlDocument,
                xpath: '//soap:Body'
            }); 
			}
  log.debug('bodyNode',bodyNode)
			
				 for (var i = 0; i < bodyNode.length; i++) {
var t_CustomFields_incidence = bodyNode[i].getElementsByTagName({
                    tagName: 'IncidentResponse',

                });
//log.debug("t_CustomFields_incidence1",t_CustomFields_incidence);
var t_status = bodyNode[i].getElementsByTagName({
                    tagName: 'Status',

                });

                 var get_status =  t_status[i].textContent ;
log.debug("get_status",get_status);

var t_Priority = bodyNode[i].getElementsByTagName({
                    tagName: 'Priority',

                });

                 var get_priority =  t_Priority[i].textContent ;
//log.debug("get_priority",get_priority);
if(get_priority){
if(get_priority=='CriticalHighLowMediumPlanning'){
	setPrority=get_priority;
}else{
var split_prio=get_priority.split('|')
//log.debug('split_prio data',split_prio)
var setPrority=split_prio[2];
//log.debug('setPrority data',setPrority)
}
}
var t_Severity = bodyNode[i].getElementsByTagName({
                    tagName: 'Severity',

                });

                 var get_Severity =  t_Severity[i].textContent ;
//log.debug("get_Severity",get_Severity);

/* var split_sev=get_Severity.split('|')
log.debug('split_severity data',split_sev)
var set_set=split_sev[2];
log.debug('set_set data',set_set) */

var t_Summary = bodyNode[i].getElementsByTagName({
                    tagName: 'Summary',

                });
//log.debug("t_Summary",t_Summary);

                 var get_Summary =  t_Summary[i].textContent ;
//log.debug("get_Summary",get_Summary);

var t_submitter = bodyNode[i].getElementsByTagName({
                    tagName: 'Submitter',

                });
//log.debug("t_submitter",t_submitter);

if(_validateData(t_submitter)){
                 var get_submitter =  t_submitter[i].textContent ;
//log.debug("get_submitter",get_submitter);

}
var t_submitterEmail = bodyNode[i].getElementsByTagName({
                    tagName: 'SubmitterEmail',

                });

//log.debug("t_submitterEmail",t_submitterEmail);
if(_validateData(t_submitterEmail)){
                 var get_submitterEmail =  t_submitterEmail[i].textContent ;
//log.debug("get_submitterEmail",get_submitterEmail);
}

var t_resolutionNote = bodyNode[i].getElementsByTagName({
                    tagName: 'ResolutionNote',

                });

//log.debug("t_submitterEmail",t_submitterEmail);
if(_validateData(t_resolutionNote)){
                 var get_resolutionNote =  t_resolutionNote[i].textContent ;
log.debug("get_resolutionNote",get_resolutionNote);
}
var t_description = bodyNode[i].getElementsByTagName({
                    tagName: 'Description',

                });

//log.debug("t_submitterEmail",t_submitterEmail);
if(_validateData(t_description)){
                 var get_t_description =  t_description[i].textContent ;
//log.debug("get_submitterEmail",get_submitterEmail);
}

var t_Resolution = bodyNode[i].getElementsByTagName({
                    tagName: 'Resolution',

                });
				if(_validateData(t_Resolution)){
                 var get_Resolution =  t_Resolution[i].textContent ;
log.debug("get_Resolution",get_Resolution);
var split_Resolution =get_Resolution.split('|')
log.debug('split_Resolution data',split_Resolution)
var set_Resolution=split_Resolution[2];
log.debug('set_Resolution data',set_Resolution)

if(set_Resolution){
	
	if(set_Resolution=='HardwareReplaced'){
						set_Resolution='Hardware Replaced';
					}
					if(set_Resolution=='Newsoftwareinstalled'){
						set_Resolution='New software installed';
					}
					if(set_Resolution=='NoResponse'){
						set_Resolution='No Response from User';
					}
					if(set_Resolution=='NotResolved'){
						set_Resolution='Not Resolved';
					}
					if(set_Resolution=='OSreinstalled'){
						set_Resolution='OS reinstalled';
					}
					if(set_Resolution=='TrainingGiven'){
						set_Resolution='Training Given';
					}
					if(set_Resolution=='AdviceGiven'){
						set_Resolution='Solved';
					}
}

				}


//get category

var t_Category = bodyNode[i].getElementsByTagName({
                    tagName: 'Category',

                });
//log.debug("t_Category",t_Category);
if(_validateData(t_Category)){
                 var get_Category =  t_Category[i].textContent ;
//log.debug("get_Category",get_Category);

var split_category=get_Category.split('|')
//log.debug('split_severity data',split_category)
var set_Category=split_category[2];
//log.debug('set_set data',set_Category)

}
var t_Assignee = bodyNode[i].getElementsByTagName({
                    tagName: 'Assignee',

                });
//log.debug("t_Assignee",t_Assignee);
if(_validateData(t_Assignee)){
                 var get_Assignee =  t_Assignee[i].textContent ;
//log.debug("get_Assignee",get_Assignee);
}


var t_AssigneeEmail = bodyNode[i].getElementsByTagName({
                    tagName: 'AssigneeEmail',

                });
//log.debug("t_AssigneeEmail",t_AssigneeEmail);
if(_validateData(t_AssigneeEmail)){

                 var get_AssigneeEmail=  t_AssigneeEmail[i].textContent ;
//log.debug("get_AssigneeEmail",get_AssigneeEmail);
}

var t_organisationName = bodyNode[i].getElementsByTagName({
                    tagName: 'OrganizationName',

                });
//log.debug("t_organisationName",t_organisationName);
if(_validateData(t_organisationName)){
                 var get_Organisation =  t_organisationName[i].textContent ;
//log.debug("get_Organisation",get_Organisation);
}

var t_organisationCode = bodyNode[i].getElementsByTagName({
                    tagName: 'Organization',

                });
//log.debug("t_organisationCode",t_organisationCode);
if(_validateData(t_organisationCode)){
                 var get_OrganisationCode =  t_organisationCode[i].textContent ;
//log.debug("get_OrganisationCode",get_OrganisationCode);
}


var a_attribute_incidence = t_CustomFields_incidence[i].getAttribute({
                        name: 'id'
                    });
//log.debug("a_attribute_incidence " , a_attribute_incidence)


                var t_CustomFields = bodyNode[i].getElementsByTagName({
                    tagName: 'Field',

                });
                for (var j = 0; j < t_CustomFields.length; j++) {
                    var a_attribute = t_CustomFields[j].getAttribute({
                        name: 'fieldName'
                    });


                    //log.debug("a_attribute " + j, a_attribute)
                   /********************* get ticket details value of custome fields************************/

                    if (a_attribute == 'EngineerName') {

                        t_CustomFields[j].textContent;

                        var cust_eng = t_CustomFields[j].textContent;
                        //log.debug("EngineerName", cust_eng);

                    }
					

                    if (a_attribute == 'SubStatus') {

                        t_CustomFields[j].textContent;

                        var cust_substatus = t_CustomFields[j].textContent;
                        //log.debug("SubStatus", cust_substatus)
                    }

                    if (a_attribute == 'HoldReason') {

                        t_CustomFields[j].textContent;

                        var cust_holdreason = t_CustomFields[j].textContent;
                        //log.debug("HoldReason", cust_holdreason)
                    }

                    if (a_attribute == 'DefineResponseTime') {

                        t_CustomFields[j].textContent;

                        var cust_define_res_time = t_CustomFields[j].textContent;
                        //log.debug("DefineResponseTime", cust_define_res_time)
                    }

                    if (a_attribute == 'DefineResolutionTime') {

                        t_CustomFields[j].textContent;

                        var cust_define_resolution_time = t_CustomFields[j].textContent;
                        //log.debug("DefineResolutionTime", cust_define_resolution_time)
                    }
                    if (a_attribute == 'ResponseSLA') {

                        t_CustomFields[j].textContent;

                        var cust_ResponseSLA = t_CustomFields[j].textContent;
                        //log.debug("ResponseSLA", cust_ResponseSLA)
                    }
                    if (a_attribute == 'ResolutionSLA') {

                        t_CustomFields[j].textContent;

                        var cust_ResolutionSLA = t_CustomFields[j].textContent;
                        //log.debug("ResolutionSLA", cust_ResolutionSLA)
                    }

                    if (a_attribute == 'HoldDateTime') {

                        t_CustomFields[j].textContent;

                        var cust_HoldDateTime = t_CustomFields[j].textContent;
                        //log.debug("HoldDateTime", cust_HoldDateTime)
                    }
                    if (a_attribute == 'TotalResolutionTakenTime') {

                        t_CustomFields[j].textContent;

                        var cust_TotalResolutionTakenTime = t_CustomFields[j].textContent;
                        //log.debug("TotalResolutionTakenTime", cust_TotalResolutionTakenTime)
                    }
                    if (a_attribute == 'TotalResponseTakenTime') {

                        t_CustomFields[j].textContent;

                        var cust_TotalResponseTakenTime = t_CustomFields[j].textContent;
                        //log.debug("TotalResponseTakenTime", cust_TotalResponseTakenTime)
                    }
                    if (a_attribute == 'SystemSerial') {

                        t_CustomFields[j].textContent;

                        var cust_SystemSerial = t_CustomFields[j].textContent;
                        //log.debug("SystemSerial", cust_SystemSerial)
                    }
                    if (a_attribute == 'OrganizationAddress') {

                        t_CustomFields[j].textContent;

                        var cust_OrganizationAddress = t_CustomFields[j].textContent;
                        //log.debug("OrganizationAddress", cust_OrganizationAddress)
                    }
                    if (a_attribute == 'ContractType') {

                        t_CustomFields[j].textContent;

                        var cust_ContractType = t_CustomFields[j].textContent;
                        //log.debug("ContractType", cust_ContractType)
                    }
                     if (a_attribute == 'CustomerContact') {

                        t_CustomFields[j].textContent;

                        var cust_CustomerContact = t_CustomFields[j].textContent;
                        //log.debug("CustomerContact", cust_CustomerContact)
                    } 
                    if (a_attribute == 'CustomerEmail') {

                        t_CustomFields[j].textContent;

                        var cust_CustomerEmail = t_CustomFields[j].textContent;
                        //log.debug("CustomerEmail", cust_CustomerEmail)
                    }
                    if (a_attribute == 'VendorOEMTicketNumber') {

                        t_CustomFields[j].textContent;

                        var cust_VendorOEMTicketNumber = t_CustomFields[j].textContent;
                        //log.debug("VendorOEMTicketNumber", cust_VendorOEMTicketNumber)
                    }
                    if (a_attribute == 'TotalHoldTime') {

                        t_CustomFields[j].textContent;

                        var cust_TotalHoldTime = t_CustomFields[j].textContent;
                        //log.debug("TotalHoldTime", cust_TotalHoldTime)
                    }
                    if (a_attribute == 'OEMVendor') {

                        t_CustomFields[j].textContent;

                        var cust_OEMVendor = t_CustomFields[j].textContent;
                        //log.debug("OEMVendor", cust_OEMVendor)
                    }
                    if (a_attribute == 'AssetCount') {

                        t_CustomFields[j].textContent;

                        var cust_AssetCount = t_CustomFields[j].textContent;
                        //log.debug("AssetCount", cust_AssetCount)
                    }
                    if (a_attribute == 'PartRequirement') {

                        t_CustomFields[j].textContent;

                        var cust_PartRequirement = t_CustomFields[j].textContent;
                        //log.debug("PartRequirement", cust_PartRequirement)
                    }
                    if (a_attribute == 'PartDescription') {

                        t_CustomFields[j].textContent;

                        var cust_PartDescription = t_CustomFields[j].textContent;
                        //log.debug("PartDescription", cust_PartDescription)
                    }
                    if (a_attribute == 'State') {

                        t_CustomFields[j].textContent;

                        var cust_State = t_CustomFields[j].textContent;
                        //log.debug("State", cust_State)
                    }
                    if (a_attribute == 'UserName') {

                        t_CustomFields[j].textContent;

                        var cust_UserName = t_CustomFields[j].textContent;
                        //log.debug("UserName", cust_UserName)
                    }
                    if (a_attribute == 'ResolverGroup') {

                        t_CustomFields[j].textContent;

                        var cust_ResolverGroup = t_CustomFields[j].textContent;
                        //log.debug("ResolverGroup", cust_ResolverGroup)
                    }
                    if (a_attribute == 'FCRprovided') {

                        t_CustomFields[j].textContent;

                        var cust_FCRprovided = t_CustomFields[j].textContent;
                        //log.debug("FCRprovided", cust_FCRprovided)
                    }
                    if (a_attribute == 'FCREngineer') {

                        t_CustomFields[j].textContent;

                        var cust_FCREngineer = t_CustomFields[j].textContent;
                        //log.debug("FCREngineer", cust_FCREngineer)
                    }
                    if (a_attribute == 'ResolutionDateTime') {

                        t_CustomFields[j].textContent;

                        var cust_ResolutionDateTime = t_CustomFields[j].textContent;
                        //log.debug("ResolutionDateTime", cust_ResolutionDateTime)
                    }
                    if (a_attribute == 'RequestType') {

                        t_CustomFields[j].textContent;

                        var cust_RequestType = t_CustomFields[j].textContent;
                        //log.debug("RequestType", cust_RequestType)
                    }
                    if (a_attribute == 'SupportType') {

                        t_CustomFields[j].textContent;

                        var cust_SupportType = t_CustomFields[j].textContent;
                        //log.debug("SupportType", cust_SupportType)
                    }
                    if (a_attribute == 'HoldTimeEnd') {

                        t_CustomFields[j].textContent;

                        var cust_HoldTimeEnd = t_CustomFields[j].textContent;
                        //log.debug("HoldTimeEnd", cust_HoldTimeEnd)
                    }
                    if (a_attribute == 'ResponseAt') {

                        t_CustomFields[j].textContent;

                        var cust_ResponseAt = t_CustomFields[j].textContent;
                        //log.debug("ResponseAt", cust_ResponseAt)
                    }
                    if (a_attribute == 'TACnumber') {

                        t_CustomFields[j].textContent;

                        var cust_TACnumber = t_CustomFields[j].textContent;
                        //log.debug("TACnumber", cust_TACnumber)
                    }
                    if (a_attribute == 'TACCreationDate') {

                        t_CustomFields[j].textContent;

                        var cust_TACCreationDate = t_CustomFields[j].textContent;
                        //log.debug("TACCreationDate", cust_TACCreationDate)
                    }
                    if (a_attribute == 'TACClosureDate') {

                        t_CustomFields[j].textContent;

                        var cust_TACClosureDate = t_CustomFields[j].textContent;
                        //log.debug("TACClosureDate", cust_TACClosureDate)
                    }
                    if (a_attribute == 'OEM') {

                        t_CustomFields[j].textContent;

                        var cust_OEM = t_CustomFields[j].textContent;
                        //log.debug("OEM", cust_OEM)
                    }
                    if (a_attribute == 'UnderObservationDate') {

                        t_CustomFields[j].textContent;

                        var cust_UnderObservationDate = t_CustomFields[j].textContent;
                        //log.debug("UnderObservationDate", cust_UnderObservationDate)
                    }
                    if (a_attribute == 'EmpCode') {

                        t_CustomFields[j].textContent;

                        var cust_EmpCode = t_CustomFields[j].textContent;
                        //log.audit("EmpCode", cust_EmpCode)
                    }
					
                    if (a_attribute == 'CSField') {

                        t_CustomFields[j].textContent;

                        var cust_CSField = t_CustomFields[j].textContent;
                        //log.debug("CSField", cust_CSField)
                    }
                    if (a_attribute == 'EngAssignmentTm') {

                        t_CustomFields[j].textContent;

                        var cust_EngAssignmentTm = t_CustomFields[j].textContent;
                        //log.debug("EngAssignmentTm", cust_EngAssignmentTm)
                    }
                    if (a_attribute == 'Contract_Location') {

                        t_CustomFields[j].textContent;

                        var cust_Contract_Location = t_CustomFields[j].textContent;
                        //log.debug("Contract_Location", cust_Contract_Location)
                    }
                    if (a_attribute == 'Account_Manager') {

                        t_CustomFields[j].textContent;

                        var cust_Account_Manager = t_CustomFields[j].textContent;
                        //log.debug("Account_Manager", cust_Account_Manager)
                    }
                    if (a_attribute == 'PreviousStatus') {

                        t_CustomFields[j].textContent;

                        var cust_PreviousStatus = t_CustomFields[j].textContent;
                        //log.debug("cust_PreviousStatus", cust_PreviousStatus);
                        //log.audit("cust_PreviousStatus",cust_PreviousStatus);

                    }
                    if (a_attribute == 'ExceptionReason') {

                        t_CustomFields[j].textContent;

                        var cust_ExceptionReason = t_CustomFields[j].textContent;
                        //log.debug("ExceptionReason", cust_ExceptionReason)
                    }
                    if (a_attribute == 'ItemPrice') {

                        t_CustomFields[j].textContent;

                        var cust_ItemPrice = t_CustomFields[j].textContent;
                        //log.debug("ItemPrice", cust_ItemPrice)
                    }
                    if (a_attribute == 'ExceptionRequesterName') {

                        t_CustomFields[j].textContent;

                        var cust_ExceptionRequesterName = t_CustomFields[j].textContent;
                        //log.debug("ExceptionRequesterName", cust_ExceptionRequesterName)
                    }
                    if (a_attribute == 'ExceptionReasonforApproval') {

                        t_CustomFields[j].textContent;

                        var cust_ExceptionReasonforApproval = t_CustomFields[j].textContent;
                        //log.debug("ExceptionReasonforApproval", cust_ExceptionReasonforApproval)
                    }
                    if (a_attribute == 'ExceptionApprovalRequired') {

                        t_CustomFields[j].textContent;

                        var cust_ExceptionApprovalRequired = t_CustomFields[j].textContent;
                        //log.debug("ExceptionApprovalRequired", cust_ExceptionApprovalRequired)
                    }
                    if (a_attribute == 'ExceptionApprovedby') {

                        t_CustomFields[j].textContent;

                        var cust_ExceptionApprovedby = t_CustomFields[j].textContent;
                        //log.debug("ExceptionApprovedby", cust_ExceptionApprovedby)
                    }
                    if (a_attribute == 'ResolvedBy') {

                        t_CustomFields[j].textContent;

                        var cust_ResolvedBy = t_CustomFields[j].textContent;
                        //log.debug("ResolvedBy", cust_ResolvedBy)
                    }
                    if (a_attribute == 'GSDAgent') {

                        t_CustomFields[j].textContent;

                        var cust_GSDAgent = t_CustomFields[j].textContent;
                        //log.debug("GSDAgent", cust_GSDAgent)
                    }
                    if (a_attribute == 'SONo') {

                        t_CustomFields[j].textContent;

                        var cust_SONo = t_CustomFields[j].textContent;
                        //log.debug("SONo", cust_SONo)
                    }
                    if (a_attribute == 'InvoiceNo') {

                        t_CustomFields[j].textContent;

                        var cust_InvoiceNo = t_CustomFields[j].textContent;
                        //log.debug("InvoiceNo", cust_InvoiceNo)
                    }
                    if (a_attribute == 'SolIdBranchCode') {

                        t_CustomFields[j].textContent;

                        var cust_SolIdBranchCode = t_CustomFields[j].textContent;
                        //log.debug("SolIdBranchCode", cust_SolIdBranchCode)
                    }
                    if (a_attribute == 'ClosureStatus') {

                        t_CustomFields[j].textContent;

                        var cust_ClosureStatus = t_CustomFields[j].textContent;
                        //log.debug("ClosureStatus", cust_ClosureStatus)
                    }
                    if (a_attribute == 'PendingRemarks') {

                        t_CustomFields[j].textContent;

                        var cust_PendingRemarks = t_CustomFields[j].textContent;
                        //log.debug("PendingRemarks", cust_PendingRemarks)
                    }
                    if (a_attribute == 'AWS_AccountId') {

                        t_CustomFields[j].textContent;

                        var cust_AWS_AccountId = t_CustomFields[j].textContent;
                        //log.debug("AWS_AccountId", cust_AWS_AccountId)
                    }
                    if (a_attribute == 'AWS_CaseId') {

                        t_CustomFields[j].textContent;

                        var cust_AWS_CaseId = t_CustomFields[j].textContent;
                        //log.debug("AWS_CaseId", cust_AWS_CaseId)
                    }
                    if (a_attribute == 'AWS_CommTime') {

                        t_CustomFields[j].textContent;

                        var cust_AWS_CommTime = t_CustomFields[j].textContent;
                        //log.debug("AWS_CommTime", cust_AWS_CommTime)
                    }
					
                    
                    /********************** set field values ********************/
					
					
						 
					  service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_sdd_engineer',
                        value: cust_eng
                    });
					 

                      service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_user_name',
                        value: cust_UserName
                    });
					service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_resolution_field_new',
                        text: set_Resolution
                    });
                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_organization_address',
                        value: cust_OrganizationAddress
                    });
                    service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_contract_type',
                        text: cust_ContractType
                    });
                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_system_serial',
                        value: cust_SystemSerial
                   });
			/*  if(cust_CustomerEmail!=='NA'){
service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_customer_email',
                        value: cust_CustomerEmail
                    });
}    */
service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_asset_count',
                        value: cust_AssetCount
                    });
					service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_oem_new',
                        text: cust_OEM
                    });
					service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_hold_reason_field',
                        value: cust_holdreason
                    });
service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_exception_reason',
                        text: cust_ExceptionReason
                    });
      /*service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_customer_contact',
                        text: cust_CustomerContact
                    });     */

                    service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_request_type',
                        text: cust_RequestType
                    });

                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_emp_code',
                        value: cust_EmpCode
                    });

                    service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_sub_status_field',
                        text: cust_substatus
                    });
					
					service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_resolver_group',
                        text: cust_ResolverGroup
                    });

                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_vendor_oem_ticket_number',
                        value: cust_VendorOEMTicketNumber
                    });

                     service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_total_hold_time',
                        value: cust_TotalHoldTime
                    }); 

                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_oemvendor',
                        value: cust_OEMVendor
                    });

                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_partdescription',
                        value: cust_PartDescription
                    });

                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_fcr_engineer',
                        value: cust_FCREngineer
                    });

                    
                    
					service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_fcr_provided',
                        text: cust_FCRprovided
                    });
					
					service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_support_type',
                        text: cust_SupportType
                    });
					
					service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_part_requirement',
                        text: cust_PartRequirement
                    });
					
					

                     

                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_tac_number',
                        value: cust_TACnumber
                    });

                   
                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_cs_field',
                        value: cust_CSField
                    });

                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_engassignmenttm',
                        value: cust_EngAssignmentTm
                    });

                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_contract_location',
                        value: cust_Contract_Location
                    });
					service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_closure_status',
                        text: cust_ClosureStatus
                    });
					
					

                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_account_manager',
                        value: cust_Account_Manager
                    });

                   
                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_item_price',
                        value: cust_ItemPrice
                    });

                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_exceptionrequestername',
                        value: cust_ExceptionRequesterName
                    });

                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_exceptionreasonapproval',
                        value: cust_ExceptionReasonforApproval
                    });
                  
                  service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_totalresolutiontakentime',
								value: cust_TotalResolutionTakenTime
							});

                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_exceptionapproved_by',
                        value: cust_ExceptionApprovedby
                    });

                    service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_resolved_by',
                        value: cust_ResolvedBy
                    });

                   

							service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_so_no',
								value: cust_SONo
							});

							service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_invoice_no',
								value: cust_InvoiceNo
							});

							service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_solid_branch_code',
								value: cust_SolIdBranchCode
							});

							service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_pending_remarks',
								value: cust_PendingRemarks
							});

							service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_aws_account_id',
								value: cust_AWS_AccountId
							});

							service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_aws_case_id',
								value: cust_AWS_CaseId
							});

							
							
		service_desk_rec.setText({
								fieldId: 'custrecord_hsmc_gsd_agent',
								text: cust_GSDAgent
							});

		

		service_desk_rec.setText({
								fieldId: 'custrecord_hsmc_state_field_new',
								text: cust_State
							});
							service_desk_rec.setText({
								fieldId: 'custrecord_hsmc_exceptionapprovalrequire',
								text: cust_ExceptionApprovalRequired
							});
		


		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_previous_status',
								value: cust_PreviousStatus
							});

		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_response_sla',
								value: cust_ResponseSLA
							});

							service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_resolution_sla',
								value: cust_ResolutionSLA
							});


		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_totalresponse_taken_time',
								value: cust_TotalResponseTakenTime
							});
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_define_response_time',
								value: cust_define_res_time
							}); 

							 service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_define_resolution_time',
								value: cust_define_resolution_time
							}); 


		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_incident_id',
								value: a_attribute_incidence
							});
		
		

		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_updated_via',
								value: 'PCV Details'
							});


						}

					}
					
				
					if(cust_HoldDateTime){
						var dateToBeSet=setDateTime(cust_HoldDateTime)
					service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_hold_date_time',
                        text: dateToBeSet
                    }); 
					}
					if(cust_HoldTimeEnd){
						var dateToBeSet=setDateTime(cust_HoldTimeEnd)
					service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_holdtime_end',
                        text: dateToBeSet
                    }); 
					}
					 if(cust_TACCreationDate){
						//var dateToBeSet=setTimeZoneDate(cust_TACCreationDate)
					service_desk_rec.setText({
								fieldId: 'custrecord_hsmc_taccreation_date',
								text: cust_TACCreationDate
							}); 
					} 
					 if(cust_UnderObservationDate){
						//var dateToBeSet=setTimeZoneDate(cust_UnderObservationDate)
						 service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_under_observation_date',
                        text: cust_UnderObservationDate
                    }); 
					} 
					if(cust_ResponseAt){
						var dateToBeSet=setDateTime(cust_ResponseAt)
						 service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_response_at',
                        text: dateToBeSet
                    }); 
					}
					if(cust_ResponseAt){
						var dateToBeSet=setFrontDate(cust_ResponseAt)
						 service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_response_at_date',
                        text: dateToBeSet
                    }); 
					}
					if(cust_AWS_CommTime){
						var dateToBeSet=setDateTime(cust_AWS_CommTime)
					service_desk_rec.setText({
								fieldId: 'custrecord_hsmc_aws_comm_time',
								text: dateToBeSet
							}); 
							
					}
					 if(cust_TACClosureDate){
						//var dateToBeSet=setTimeZoneDate(cust_TACClosureDate)
							service_desk_rec.setText({
								fieldId: 'custrecord_hsmc_tac_closure_date',
								text: cust_TACClosureDate
							}); 
					} 
							
					 
					if(cust_ResolutionDateTime){
						var dateToBeSetdate=setDateTime(cust_ResolutionDateTime)
					 service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_resolution_date_time',
                        text: dateToBeSetdate
                    });
					}
					if(cust_ResolutionDateTime){
						var dateToBeSetdate=setFrontDate(cust_ResolutionDateTime)
					 service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_resolution_at_date',
                        text: dateToBeSetdate
                    });
					}
					if(get_resolutionNote){
						//var dateToBeSetdate=setFrontDate(cust_ResolutionDateTime)
					 service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_resolution_notes_sd',
                        value: get_resolutionNote
                    });
					}
						if(get_t_description){
						//var dateToBeSetdate=setFrontDate(cust_ResolutionDateTime)
					 service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_resolution_description',
                        value: get_t_description
                    });
					}

					 if(set_Category){
					var categoryValue=setCategory(set_Category);
					//log.audit('set_Category name',set_Category)
					var categoryValue_tobeset=setNameCategory(categoryValue);
					//log.audit('categoryValue_tobeset name*****',categoryValue_tobeset)
					
					 if(categoryValue_tobeset){
						 
					  service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_category_field_new',
                        value: categoryValue_tobeset
                    });
					 }
					
		} 
		if(get_Assignee){
			service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_assignee',
                        value: get_Assignee
                    });
		}
		if(get_AssigneeEmail){
			service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_assignee_email',
                        value: get_AssigneeEmail
                    });
		}
		if(get_Summary){
						 
					  service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_summary',
                        value: get_Summary
                    });
					
					
					 }
					  
					 if(get_submitter){
						 
					  service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_submitter_name',
                        value: get_submitter
                    });
					 }

if(get_OrganisationCode){
	             var  getOrgName=setOrganisationField(get_OrganisationCode)
					//log.debug('getOrgName',getOrgName)	 
					  service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_organization',
                        value: getOrgName
                    });
					 }
					 
					 if(get_Organisation){
	             
					  service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_sdd_organization',
                        text: get_Organisation
                    });
					 }
					 if(get_submitterEmail){
						 
					  service_desk_rec.setValue({
                        fieldId: 'custrecord_hsmc_submitter_email',
                        value: get_submitterEmail
                    });
					 }
					if(setPrority){
					if(setPrority=='CriticalHighLowMediumPlanning'){
					service_desk_rec.setText({
								fieldId: 'custrecord_hsmc_priority_field_new',
								text:'Low'
							});
					}
					else{
						service_desk_rec.setText({
								fieldId: 'custrecord_hsmc_priority_field_new',
								text:setPrority
						});
					}
					}

 if(get_Severity){
			if(get_Severity=='Incident||High'){
				//log.debug('get_Severity','enter into severity')
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_severity_field_new',
								value:1
							})
			}
			if(get_Severity=='Incident||Medium'){
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_severity_field_new',
								value:2
							})
			}
			if(get_Severity=='Incident||Severity3'){
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_severity_field_new',
								value:3
							})
			}
			if(get_Severity=='Incident||Low'){
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_severity_field_new',
								value:4
							});  
			}
 
 }
					if(get_status){
			if(get_status=='Incident||1.New'){
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_status_field',
								value:6
							})
			}
			if(get_status=='Incident||WaitingforUserFeedback'){
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_status_field',
								value:1
							})
			}
			if(get_status=='Incident||Usernotresponding'){
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_status_field',
								value:2
							})
			}
			if(get_status=='Incident||Awaitinguserconfirmation'){
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_status_field',
								value:3
							})
			}
			if(get_status=='Incident||Scheduled'){
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_status_field',
								value:4
							})
			}
			if(get_status=='Incident||Solved'){
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_status_field',
								value:5
							})
			}
			if(get_status=='Incident||4.InProgress'){
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_status_field',
								value:7
							})
			}
			if(get_status=='Incident||C.Closed'){
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_status_field',
								value:8
							})
			}
			if(get_status=='Incident||UnderObservation'){
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_status_field',
								value:9
							})
			}
			if(get_status=='Incident||PendingwithOEM'){
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_status_field',
								value:10
							})
			}
		}
		if(cust_EmpCode){
					var empCodeName=setEngineerName(cust_EmpCode);
				//	log.audit('engineer name',empCodeName)
					
					 if(empCodeName){
						 
					  service_desk_rec.setText({
                        fieldId: 'custrecord_hsmc_engineer_name_field',
                        text: empCodeName
                    });
					 }
					
		} 
					
					var i_saved_vp = service_desk_rec.save({
						enableSourcing: true,
						ignoreMandatoryFields: true
					});
					log.debug('i_saved_vp after record create', i_saved_vp)
					
					if(taskrecId){
//log.audit('enter on task record')
    var o_pcvCrObj = record.submitFields({
                            type:record.Type.TASK,
                            id: taskrecId,
                            values: {
                                custeventhsmc_flag_check:false
                            },
                            options: {
                                enableSourcing: true,
                                ignoreMandatoryFields: true
                            }
                        }); 
						
					//context.response.write('<script>self.close();</script>');
					//context.response.write('<script>Kindly go back and try it again</script>')
					  redirect.toRecord({
						type: 'task',
						id: taskrecId,
		isEditMode:true

					}); 

		}
			
		 

		}catch(e){
		log.error("error in catch field",e);
		var error_message=e.message
		service_desk_rec.setValue({
								fieldId: 'custrecord_hsmc_integration_response',
								value: error_message
							});

		var i_saved_vp = service_desk_rec.save({
						enableSourcing: true,
						ignoreMandatoryFields: true
					});
					log.debug('i_saved_vp', i_saved_vp)
					var taskrecIds=taskrecId;
					log.error('taskrecIds',taskrecIds)

		if(taskrecIds){
		//context.response.write('Kindly go back and try it again')
		log.error('enter inot task record data')
		  
		redirect.toRecord({
						type: 'task',
						id: taskrecIds,
		isEditMode:true
					});
		}
		
		
		
                }
        }
//added by amisha on 11-10-2022
/**Function to set engineer as per emp code**/
function setEngineerName(empCode){
	var engineer_name=0;
	var employeeSearchObj = search.create({
						   type: "employee",
						   filters:
						   [
							  ["externalid","anyOf",empCode]
						   ],
						   columns:
						   [
							  search.createColumn({
								 name: "entityid",
								 sort: search.Sort.ASC,
								 label: "Name"
							  })
						   ]
						});
						var searchResultCount = employeeSearchObj.runPaged().count;
						//log.debug("employeeSearchObj result count",searchResultCount);
						employeeSearchObj.run().each(function(result){
						   // .run().each has a limit of 4,000 results
						   engineer_name=result.getValue({ name: "entityid",
						   
								 sort: search.Sort.ASC,
								 label: "Name"})
							//	 log.debug("engineer_name  employeeSearchObj result count",engineer_name);
						   //return true;
						});
return engineer_name
	
}
function setOrganisationField(organizationCode){
	  var orgName;
	  var id;
				  var customerSearchObj = search.create({
   type: "customer",
   filters:
   [
      ["externalid","anyof",organizationCode]
   ],
   columns:
   [
      search.createColumn({name: "altname", label: "Name"}),
      search.createColumn({name: "externalid", label: "External ID"}),
      search.createColumn({name: "internalid", label: "Internal ID"})
   ]
});
var searchResultCount = customerSearchObj.runPaged().count;
//log.debug("customerSearchObj result count",searchResultCount);
customerSearchObj.run().each(function(result){
   // .run().each has a limit of 4,000 results
   orgName = result.getValue({
                    name: "altname", 
					label: "Name"
                })
				//log.debug('orgName id*******',orgName)
				 id = result.getValue({
                   name: "internalid",
				   label: "Internal ID"
                })
				//log.debug('id id*******',id)
   return true;
});

					
				 

              return id;
			
  }
/**function to get category name**/
function setCategory(categoryId){
    var categoryArray=new Array();
	var customrecord_hsmc_category_pcvisorSearchObj = search.create({
		
   type: "customrecord_hsmc_category_pcvisor",
   filters:
   [
      ["custrecord_hsmc_categoryid","is",categoryId]
   ],
   columns:
   [
      search.createColumn({
         name: "name",
         sort: search.Sort.ASC,
         label: "Name"
      })
   ]
});
var searchResultCount = customrecord_hsmc_category_pcvisorSearchObj.runPaged().count;
//log.debug("customrecord_hsmc_category_pcvisorSearchObj result count",searchResultCount);
customrecord_hsmc_category_pcvisorSearchObj.run().each(function(result){
   // .run().each has a limit of 4,000 results
    var categoryName=result.getValue({ name: "name",
								 sort: search.Sort.ASC,
								 label: "Name"})
								// log.debug("categoryName",categoryName);
								 
								 categoryArray.push(categoryName)
								 //log.debug('category name array data',categoryArray)
   return true;
});
return categoryArray[0]

} 
/**Function to stamp internal id of category as per the name**/
function setNameCategory(categoryNameSet){
	var categoryArray=new Array();
	var customrecord_hsmc_category_pcvisorSearchObj = search.create({
   type: "customrecord_hsmc_category_pcvisor",
   filters:
   [
      ["name","is",categoryNameSet]
   ],
   columns:
   [
      search.createColumn({
         name: "name",
         sort: search.Sort.ASC,
         label: "Name"
      }),
      search.createColumn({name: "scriptid", label: "Script ID"}),
      search.createColumn({name: "custrecord_hsmc_categoryid", label: "Category ID"}),
      search.createColumn({name: "internalid", label: "Internal ID"})
   ]
});
var searchResultCount = customrecord_hsmc_category_pcvisorSearchObj.runPaged().count;
//log.debug("customrecord_hsmc_category_pcvisorSearchObj result count",searchResultCount);
customrecord_hsmc_category_pcvisorSearchObj.run().each(function(result){
   var categoryName=result.getValue({name: "internalid", label: "Internal ID"})
								 
								 categoryArray.push(categoryName)
								 //log.debug('category name array data',categoryArray)
   return true;
});
return categoryArray[0]

}

 function setDateTime(dateToSet){
	 var dateSet=dateToSet
	
	 var getDateS=new Date(dateSet)
	 //log.debug('IST OFFSET',getDateS.getTimezoneOffset())
	 var offsetDate=new Date(getDateS.getTime() + ((-420) + (getDateS.getTimezoneOffset()))*60000);
	 //log.debug('IST OFFSET-------------',offsetDate)
     var getDateTime=getDateS.getTime();
	 var setCompleteDate=format.format({value:new Date(getDateTime), type: format.Type.DATETIMETZ})
	// log.audit('formatDate',setCompleteDate)
	 //log.audit('formatDate****',new Date(getDateTime).toLocaleString())
	 
	 
	 return setCompleteDate
} 

   function setTimeZoneDate(timeZoneDate){
   var date_to_set=timeZoneDate
	  //log.audit('date_to_set',date_to_set)
	  //log.audit('date_to_set',)'
	   /* ar setCompleteDate=format.format({value:date_to_set, type: format.Type.DATETIMETZ})
	  log.audit('setCompleteDate',setCompleteDate)
	  var parseDate=new Date(date_to_set)
	  log.audit('parseDate',parseDate) */
	   var splitDate=date_to_set.split('-')
	  //log.audit('splitDate',splitDate)
	  var splitDateAg=splitDate[2].split('T')
	  //log.audit('splitDateAg',splitDateAg)
	  var getMonth=splitDate[1].replace(/\b(0(?!\b))+/g, "")
	  //log.audit('getDate*******>>>>>',getMonth)
	  var getDate=splitDateAg[0].replace(/\b(0(?!\b))+/g, "")
	  //log.audit('getDate*******>>>>>',getDate)
	  if(getDate){
	  if(getDate>12){
		  var amPm='pm'
	  }
	  else{
		  var amPm='am'
	  }
	  }
	  var splitdata=splitDateAg[1].split(':');
	 // log.audit('splitdata*******>>>>>',splitdata[0])
	  if(splitdata){
	  if(splitdata[0]!='00'){
	  var completeDate=getDate+'/'+getMonth+'/'+splitDate[0]+' '+splitDateAg[1]+' '+amPm
	  //log.audit('completeDate*******>>>>>completeDate[0]',completeDate) 
	  }
	  else{
		  var completeDate=getDate+'/'+getMonth+'/'+splitDate[0]+' '+'01'+':'+'00'+':'+'00'+' '+amPm
	  //log.audit('completeDate*******>>>>>completeDates[0]',completeDate) 
	  }
	  }
	  
	  return completeDate
	  
	

} 
function setFrontDate(dateToSet){
	 var dateSet=dateToSet
	
	 var getDateS=new Date(dateSet)
	 log.debug('IST OFFSET',getDateS.getTimezoneOffset())
	 var offsetDate=new Date(getDateS.getTime() + ((-420) + (getDateS.getTimezoneOffset()))*60000);
	 log.debug('IST OFFSET-------------',offsetDate)
     var getDateTime=getDateS.getTime();
	 var setCompleteDate=new Date(getDateTime).toLocaleString()
	 log.audit('formatDate',setCompleteDate)
	 log.audit('formatDate****',new Date(getDateTime).toLocaleString())
	 
	 
	 return setCompleteDate
	
}

function _validateData(val) {
if (val != null && val != 'undefined' && val != 'NaN' && val != '') {
return true;
}
return false;
} 

        return {
            onRequest: onRequest
        };
    });
