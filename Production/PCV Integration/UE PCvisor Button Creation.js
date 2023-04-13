/**
    *@NApiVersion 2.0
    *@NScriptType UserEventScript
    */

/*************************************************************
 * File Header
 * Script Type: User Event Script
 * Script Name: Add Button Using User Event Script
 * File Name: 
 * Created On:
 * Modified On:
 * Created By: Tejaswini (Yantra Inc.)
 * Modified By:
 * Description:
 *********************************************************** */


    define(['N/url','N/record','N/search', 'N/runtime', 'N/email', 'N/format', 'N/file', 'N/task', 'N/https','N/xml','N/currentRecord','N/ui/serverWidget'],


    function(url,record,search, runtime, email, format, file, task, https,xml,currentRecord,serverWidget){

     
     function beforeLoad(context){

     
      try{

        var currentRecord = context.type;

        log.debug('Add Button Type',currentRecord);


        if(currentRecord == 'view' || currentRecord == 'edit'){

            var recObj = context.newRecord;

            //log.debug('Add Button Object', recObj);
			
			var myScript = runtime.getCurrentScript();


            var status = recObj.getValue({

                fieldId:'status'
            });

            log.debug('Add Button Status',status);

			

            var currentRecordType = recObj.type;

            log.debug('Add Button Type','currentRecordType :' +currentRecordType);
			
				 var token_URL = myScript.getParameter({
					name: 'custscript_token_url_1'
				});
				log.debug("token_URL",token_URL);
				
				var user_name = myScript.getParameter({
					name: 'custscript_user_name_1'
				});
				log.debug("user_name",user_name); 


              var recId = recObj.id;

            log.debug('Add Button Record Id','recId:' +recId);
			
			
			var suitelet_url;
			
			var s_url = suitelet_url + '&recId='+ recId+ '&token_URL='+ token_URL+ '&user_name='+ user_name;
			log.debug("s_url",s_url);


           var createPdfUrl = url.resolveScript({
			  scriptId: 'customscript_su_pcvisor_getticket_detail',
		  deploymentId: 'customdeploy_su_pcvisor_getticket_detail',
		  returnExternalUrl: false
		  });
                    createPdfUrl += '&recId=' + recId;
                    createPdfUrl += '&currentRecordType=' + currentRecordType;
					createPdfUrl += '&token_URL=' + token_URL;
					createPdfUrl += '&user_name=' + user_name;
 
            var form = context.form;

            form.addButton({id : 'custpage_item_receipt_pdf',label:'update',
			functionName: "window.open('" + createPdfUrl + "'); window.close();"
			});
           
               
        }


      }
      catch(e){

        log.debug('Error',e);
      }

    }
	function afterSubmit(context) {
		try{
          
			var customRecord = context.newRecord;
			
			var rec_ID = customRecord.id;
			log.debug("rec_ID",rec_ID);
			
			var recObj = context.newRecord;

            log.debug('Add Button Object', recObj);
			
			var myScript = runtime.getCurrentScript();

			var currentRecordType = recObj.type;
			
			
			
			
			
			
			
			var o_serviceDeskObj = record.load({
				 type: 'customrecord_hsmc_support',
                id: rec_ID,
                isDynamic: true
			})
			
			//custrecord_hsmc_created_date_sdi
			
			var inciddentID = o_serviceDeskObj.getValue("custrecord_hsmc_service_desk_incident_id")
			var i_parent_taskid = o_serviceDeskObj.getValue("custrecord_hsmc_parent_task")
			var d_created = o_serviceDeskObj.getValue("custrecord_hsmc_created_field")
			
			if(inciddentID)
			{
				var o_serviceDeskIncidencObj = record.load({
					type: 'customrecord_hsmc_service_desk_record',
					id: inciddentID,
					isDynamic: true
				});
				
				
				var eng_name=o_serviceDeskObj.getValue("custrecord_hsmc_engineer_name_field");
				log.audit('eng_name',eng_name)
				
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_created_date_sdi",d_created);
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sd_organisationaddress",o_serviceDeskObj.getValue("custrecord_hsmc_organization_address"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sd_submitter",o_serviceDeskObj.getValue("custrecord_hsmc_submitter_name"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_status_sdi",o_serviceDeskObj.getValue("custrecord_hsmc_status_field"));
				 o_serviceDeskIncidencObj.setText("custrecord_hsmc_sd_priority",o_serviceDeskObj.getText("custrecord_hsmc_priority_field_new")); 
				 o_serviceDeskIncidencObj.setText("custrecord_hsmc_sd_severity",o_serviceDeskObj.getText("custrecord_hsmc_severity_field_new")); 
				 o_serviceDeskIncidencObj.setText("custrecord_hsmc_sd_category",o_serviceDeskObj.getText("custrecord_hsmc_category_field_new")); 
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sd_submitter_email",o_serviceDeskObj.getValue("custrecord_hsmc_submitter_email"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sd_summary",o_serviceDeskObj.getValue("custrecord_hsmc_summary"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sd_requesttype",o_serviceDeskObj.getValue("custrecord_hsmc_request_type"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sd_supporttype",o_serviceDeskObj.getValue("custrecord_hsmc_support_type"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sd_responseat",o_serviceDeskObj.getValue("custrecord_hsmc_response_at"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sd_contracttype",o_serviceDeskObj.getValue("custrecord_hsmc_contract_type"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sd_sono",o_serviceDeskObj.getValue("custrecord_hsmc_so_no"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sd_resolutiondatetime",o_serviceDeskObj.getValue("custrecord_hsmc_resolution_date_time"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sd_systemserial_no",o_serviceDeskObj.getValue("custrecord_hsmc_system_serial"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_org_address_sdi",o_serviceDeskObj.getValue("custrecord_hsmc_organization_address"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_under_obs_date_sdi",o_serviceDeskObj.getValue("custrecord_hsmc_under_observation_date"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_define_response_time_sdi",o_serviceDeskObj.getValue("custrecord_hsmc_define_response_time"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sdi_resposne_sla",o_serviceDeskObj.getValue("custrecord_hsmc_response_sla"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_resolution_sla_sdi",o_serviceDeskObj.getValue("custrecord_hsmc_resolution_sla"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sdi_total_response_time",o_serviceDeskObj.getValue("custrecord_hsmc_totalresponse_taken_time"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sub_status",o_serviceDeskObj.getValue("custrecord_hsmc_sub_status_field"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_last_updated_date_sdi",o_serviceDeskObj.getValue("custrecord_hsmc_last_updated_date_sdd"));
				
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sd_engineer_name",o_serviceDeskObj.getValue("custrecord_hsmc_engineer_name_field"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_resolution_notes",o_serviceDeskObj.getValue("custrecord_hsmc_resolution_notes_sd"));
				o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sdi_define_resolution_ti",o_serviceDeskObj.getValue("custrecord_hsmc_define_resolution_time"));
  
              o_serviceDeskIncidencObj.setValue("custrecord_hsmc_sd_organization",o_serviceDeskObj.getValue("custrecord_hsmc_organization"));
				
				var i_serviceDeskIncidencId =  o_serviceDeskIncidencObj.save({
								enableSourcing: false,
								ignoreMandatoryFields: true
							})
							log.debug("i_serviceDeskIncidencId",i_serviceDeskIncidencId)
			}
			
			if(i_parent_taskid)
			{
				var o_taskObj = record.load({type: 'task',id: i_parent_taskid,isDynamic: true});
				
				o_taskObj.setValue("custevent_hsmc_task_ticket_status",o_serviceDeskObj.getValue("custrecord_hsmc_status_field"));
				o_taskObj.setValue("assigned",o_serviceDeskObj.getValue("custrecord_hsmc_engineer_name_field"));
				//added by amisha on 15-112022
				o_taskObj.setValue("company",o_serviceDeskObj.getValue("custrecord_hsmc_organization"));
				
				
				o_taskObj.save({enableSourcing: false,ignoreMandatoryFields: true})
			}

		  
       
		}catch(e){
			log.error("error",e);
		}
	}

     return{

        //beforeLoad: beforeLoad ,
		afterSubmit:afterSubmit
     };

    })
