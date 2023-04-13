/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

/*************************************************************
 * File Header
 * Script Type: User event Script
 * Script Name:
 * File Name:
 * Created On:
 * Modified On:
 * Created By: Amisha (Yantra Inc.)
 * Modified By:
 * Description:To set Product Item Details on Effort Estimator Record.
 *********************************************************** */

define(['N/record','N/search', 'N/runtime', 'N/email', 'N/format', 'N/file', 'N/task','N/https','N/xml','N/currentRecord'],

    function (record,search, runtime, email, format, file, task,https,xml,currentRecord) {
		//var insideTheFunctionarr=[]; 

    function afterSubmit(context) {
		

        try {
           

			 if(context.type == context.UserEventType.EDIT){
				
					 
					 log.debug('Context type',context.type)
					 log.debug('enter into the script','enter into the script')
					 
					 var recordId = context.newRecord.id;
					log.debug('afterSubmit', 'recordId==' + recordId);
					var recordType = context.newRecord.type;
					log.debug('afterSubmit', 'recordType==' + recordType);
					//get old record data
					var old_rec = context.oldRecord;
          var taskRecord = record.load({
					 type: 'task',
					id: recordId,
					isDynamic: true
				})
				var getTicketNumber = taskRecord.getText({
                        fieldId: 'title'
                    });
                    log.debug("getTicketNumber", getTicketNumber);
                    var oldTicketStatus = old_rec.getText({
                        fieldId: 'custevent_hsmc_task_ticket_status'
                    });
                    log.debug("oldTicketStatus", oldTicketStatus);
					
					newTicketStatus = context.newRecord.getText({
                        fieldId: 'custevent_hsmc_task_ticket_status'
                    });
                    log.debug("newTicketStatus", newTicketStatus);
					if(newTicketStatus=='Hold'){
						var holdReason=taskRecord.getValue({
                        fieldId: 'custevent_hsmc_hold_time_reason'
                    })
					}
					
					if(newTicketStatus!=oldTicketStatus && oldTicketStatus){
						
						var getOldStatusTime=getTicketStatusTime(taskRecord,oldTicketStatus)
						log.debug("getOldStatusTime",getOldStatusTime);
						
						var oldDateFormat=convertDateTime(getOldStatusTime)
						log.debug("oldDateFormat",oldDateFormat);
						
						var getnewStatusTime=getTicketStatusTime(taskRecord,newTicketStatus)
						log.debug("getnewStatusTime", getnewStatusTime);
						var NewDateFormat=convertDateTime(getnewStatusTime)
						log.debug("NewDateFormat",NewDateFormat);
						var getHoursDiff=total_time_cal(getOldStatusTime,getnewStatusTime)
						log.debug("getHoursDiff",getHoursDiff);
						//var getHoursDiff=diff_hours(getOldStatusTime,getnewStatusTime)
						/* log.debug("getHoursDiff",getHoursDiff);
						var getMinutesDiff=diff_minutes(getOldStatusTime,getnewStatusTime)
						log.debug("getMinutesDiff",getMinutesDiff);
						 var totalTime=getHoursDiff+':'+getMinutesDiff */
						var ticketstatustrackingRecord = record.create({
                            type: 'customrecord_hsmc_ticket_status_tracking',
                            isDynamic: true
                        });
				ticketstatustrackingRecord.setText({fieldId:'custrecord_hsmc_old_status_value', text:oldTicketStatus});
				 ticketstatustrackingRecord.setText({fieldId:'custrecord_hsmc_new_status_value', text:newTicketStatus});
				 ticketstatustrackingRecord.setText({fieldId:'custrecord_hsmc_old_time', text:oldDateFormat});
				 ticketstatustrackingRecord.setText({fieldId:'custrecord_hsmc_new_time', text:NewDateFormat}); ticketstatustrackingRecord.setValue({fieldId:'custrecord_hsmc_total_time', value:getHoursDiff});
				 if(getTicketNumber){
					 var getTaskId=checkTaskRecord(getTicketNumber)
					 log.audit('getTaskId',getTaskId)
				 }
				 ticketstatustrackingRecord.setValue({fieldId:'custrecord_hsmc_link_task_record', value:getTaskId});
					}
					if(holdReason){
						ticketstatustrackingRecord.setValue({fieldId:'custrecord_hsmc_hold_remark', value:holdReason});
					}
					 var rec_save_id = ticketstatustrackingRecord.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });
                        log.audit('rec_save_id', rec_save_id);
				

 
				
			 }
				





        } catch (ex) {

            log.error('Error Rasied |AfterSubmit Function', ex);
        }
    }


function getTicketStatusTime(taskRecord,ticketStatus){
	var newTicketStatus=[];
	var getTicketStatus=ticketStatus;
	if(getTicketStatus=='Open'){
		 newTicketStatus.push(taskRecord.getValue({
                        fieldId: 'custevent_hsmc_open'
                    })
					)
                   // log.debug("newTicketStatus", newTicketStatus);
							
						}
						if(getTicketStatus=='WIP'){
							newTicketStatus.push(taskRecord.getValue({
                        fieldId: 'custevent_hsmc_wip'
                    })
						)
                    //log.debug("newTicketStatus", newTicketStatus);
						}
						if(getTicketStatus=='Pending with OEM'){
							newTicketStatus.push(taskRecord.getValue({
                        fieldId: 'custevent_hsmc_pending_with_oem'
                    })
						
						)
                   // log.debug("newTicketStatus", newTicketStatus);
							
						}
						if(getTicketStatus=='Under Observation'){
							newTicketStatus.push(taskRecord.getValue({
                        fieldId: 'custevent_hsmc_under_observation'
                    })
					)
                    //log.debug("newTicketStatus", newTicketStatus);
							
						}
						if(getTicketStatus=='Closed'){
							newTicketStatus.push(taskRecord.getValue({
                        fieldId: 'custevent_hsmc_closed'
                    })
					)
                    //log.debug("newTicketStatus", newTicketStatus);
							
						}
						if(getTicketStatus=='Resolved'){
							newTicketStatus.push(taskRecord.getValue({
                        fieldId: 'custevent_hsmc_resolved'
                    })
					)
                    //log.debug("newTicketStatus", newTicketStatus);
							
						}
						if(getTicketStatus=='Scheduled'){
							newTicketStatus.push(taskRecord.getValue({
                        fieldId: 'custevent_hsmc_scheduled'
                    })
					)
                   // log.debug("newTicketStatus", newTicketStatus);
							
						}
						if(getTicketStatus=='Awaiting user confirmation'){
							newTicketStatus.push(taskRecord.getValue({
                        fieldId: 'custevent_hsmc_awaiting_user_confirmati'
                    })
					)
                    //log.debug("newTicketStatus", newTicketStatus);
							
						}
						if(getTicketStatus=='User not responding'){
							newTicketStatus.push(taskRecord.getValue({
                        fieldId: 'custevent_hsmc_user_not_responding'
                    })
					)
                   // log.debug("newTicketStatus", newTicketStatus);
							
						}
						if(getTicketStatus=='Hold'){
							newTicketStatus.push(taskRecord.getValue({
                        fieldId: 'custevent_hsmc_hold'
                    })
					)
                   
							
						}
						log.debug("newTicketStatus***********", newTicketStatus)
						return newTicketStatus;
}

function checkTaskRecord(ticketNumber){
	 try{
	 var return_value=0;
				 var taskSearchObj = search.create({
   type: "task",
   filters:
   [
      ["title","is",ticketNumber]
   ],
   columns:
   [
      search.createColumn({name: "internalid", label: "Internal ID"})
   ]
});
var searchResultCount = taskSearchObj.runPaged().count;
log.debug("taskSearchObj result count",searchResultCount);
taskSearchObj.run().each(function(result){
   // .run().each has a limit of 4,000 results



			   return_value = result.getValue({
                        name: "internalid",
                        label: "Internal ID"
                    });
                    log.debug('return_value', return_value);
			   return true;
			});

	 return return_value
 
 }catch(e){
	 log.error('error in get opportunity record id',e)
 }
}

function convertDateTime(date_to_be_convert){
	
	var utcStartDateInString = date_to_be_convert.toString();
       
            var dateFormat = format.format({
                value: new Date(utcStartDateInString),
                type: format.Type.DATETIME,
                //timezone: format.Timezone.ASIA_CALCUTTA 
            })
			log.debug('dateFormat',dateFormat)
			/* var createdDate=new Date(utcStartDateInString.getTime() + 3600000*(+5.50))
			log.debug('createdDate************',createdDate) */
			return dateFormat
}


/* function diff_hours(dt2, dt1) 
 {

  var diff =(new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));
  
 }
 function diff_minutes(dt2, dt1) 
 {

  var diff =(new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
 } */
 function total_time_cal(date2_status_end_time,date1_status_start_time){
	 
	 var diffday_first=((new Date(date2_status_end_time)).getTime()-(new Date(date1_status_start_time)).getTime())
	 log.audit('diffday_first******',diffday_first)
					/* var diff_day_no=((date2_status_end_time-date1_status_start_time)/ 86400000)
					log.audit('diff_day_no',diff_day_no) */
					
					var diff_day_hrs=Math.round((diffday_first/1000/60/60));
					log.audit('diff_day_hrs',diff_day_hrs)
					
					var diffMins_minits =Math.round(((diffday_first % 86400000) % 3600000) / 60000); // minutes
					log.audit('diffMins_minits',diffMins_minits)
					log.audit('diffMins_minits************',(Math.abs(diffMins_minits).toString()).length)
					if((Math.abs(diffMins_minits).toString()).length==1){
						var diffMins='0'+Math.abs(diffMins_minits);
					}
					else{
						var diffMins=Math.abs(diffMins_minits);
					}
					 var calculte_time=Math.abs(diff_day_hrs)+'.'+diffMins
					log.audit('calculte_time',calculte_time)
					return calculte_time
					
 }
return{

afterSubmit: afterSubmit
}
})
