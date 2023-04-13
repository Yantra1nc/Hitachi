/**
*@NApiVersion 2.0
*@NScriptType UserEventScript
*/

/*************************************************************
 * File Header
 * Script Type: User Event Script
 * Script Name: HSMC_UE_pcv_task_record_on_incidence
 * File Name: UE_pcv_task_record_on_incidence.js
 * Created On:
 * Modified On:
 * Created By: Tejaswini (Yantra Inc.)
 * Modified By: Ganesh Sapkale (Yantra Inc.)
 * Description:
 *********************************************************** */


define(['N/url','N/record','N/search', 'N/runtime', 'N/email', 'N/format', 'N/file', 'N/task', 'N/https','N/xml','N/currentRecord','N/ui/serverWidget'],
function(url,record,search, runtime, email, format, file, task, https,xml,currentRecord,serverWidget){
function afterSubmit(context) {
	try{
	if (context.type == context.UserEventType.CREATE)
	{
		var customRecord = context.newRecord;
		
		var rec_ID = customRecord.id;
		log.debug("rec_ID",rec_ID);
		
		 var ser_obj = record.load({
			 type: 'customrecord_hsmc_service_desk_record',
			id: rec_ID,
			isDynamic: true
		})
		log.debug("ser_obj",ser_obj);
		
		//Getting Fields from Service Desk Incidence Records
		var s_resolution = ser_obj.getValue({fieldId:'custrecord_hsmc_sd_resolution'});
		//var i_orgCompId = ser_obj.getValue({fieldId:'custrecord_hsmc_sd_organization'});
		var s_assignee = ser_obj.getValue({fieldId:'custrecord_hsmc_sd_assignee'});
		var i_ticketNo = ser_obj.getValue({fieldId:'name'})
		log.debug("i_ticketNo",i_ticketNo); 
		
		//var tick_no = ser_obj.getText({fieldId:'custrecord_hsmc_ticket_number'})
		//log.debug("tick_no",tick_no);
		var obj_sv_details = record.create({
		type:'customrecord_hsmc_support'
		});//added
		
		
		
		var obj_task = record.create({
		type:'task'
		});
		
		/***** Set Assigned on Task -
		* Used the custom record for mapping of the region wise emaployees
		*
		******/
		var i_empId = '100009';
		if(s_assignee)
		{
			
			var customrecord_hsmc_employee_regionSearchObj = search.create({
			   type: "customrecord_hsmc_employee_region_record",
			   filters:
			   [
				  ["name","contains",s_assignee]
			   ],
			   columns:
			   [
				  search.createColumn({name: "custrecord_hsmc_emp", label: "Employee Name"})
			   ]
			});
			var searchResultCount = customrecord_hsmc_employee_regionSearchObj.runPaged().count;
			log.debug("customrecord_hsmc_employee_regionSearchObj result count",searchResultCount);
			customrecord_hsmc_employee_regionSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
			   
			   i_empId = result.getValue("custrecord_hsmc_emp");
			   return true;
			});
		}
		
		
		log.debug("i_empId",i_empId)
	
		if(s_assignee)
		{
			obj_task.setValue({fieldId:'assigned', value:100009});
		}
		else
		{
			obj_task.setValue({fieldId:'assigned', value:i_empId});
		}
	
		//obj_task.setValue({fieldId:'company', value:i_orgCompId});
		
		obj_task.setText({fieldId:'title',text:i_ticketNo});
	
		var i_task_id = obj_task.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });
		log.debug('i_task_id', i_task_id)
		
		
		if(i_task_id)
		{
			// Create Service Desk Sublist on Task record
			/* var o_serDeskSublistObj = record.create({type:'customrecord_hsmc_service_desk'})
			o_serDeskSublistObj.setValue('custrecord_hsmc_sd_resolutiondescription',s_resolution);
			o_serDeskSublistObj.setValue('custrecord_hsmc_sd_ticket_number',i_ticketNo);
			o_serDeskSublistObj.setValue('custrecord_hsmc_sd_parent',i_task_id);
			var i_serviceDeskId = o_serDeskSublistObj.save();
			log.debug("i_serviceDeskId",i_serviceDeskId) */
			obj_sv_details.setText({fieldId:'custrecord_hsmc_ticket_number',text:i_ticketNo});//added
		//obj_sv_details.setValue({fieldId:'custrecord_hsmc_organization',value:i_orgCompId});//added
		obj_sv_details.setValue({fieldId:'custrecord_hsmc_parent_task',value:i_task_id});//added
		obj_sv_details.setValue({fieldId:'custrecord_hsmc_service_desk_incident_id',value:rec_ID});//added
	
		var i_saved_sv = obj_sv_details.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });//added
		log.debug('i_saved_sv', i_saved_sv)
			
		}

		var task_submit = record.submitFields({
			type: 'customrecord_hsmc_service_desk_record',
			id: rec_ID,
			values: {
				custrecord_hsmc_sb_task_record:i_task_id,
				custrecord_hsmc_pcv_details :i_saved_sv //added
			},
			options: {
				enableSourcing: false,
				ignoreMandatoryFields : true
			}
		});
		log.debug("task_submit",task_submit);  
		
		
	}
	}catch(e){
		log.error("error",e);
	}
}

return{
	afterSubmit:afterSubmit
};

})
