/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */

/*************************************************************
 * File Header
 * Script Type: User Event Script
 * Script Name:HSMC_UE_Pcvisor_task_assignee
 * File Name: E_pcvisor_task_record_assignee.js
 * Created On:
 * Modified On:
 * Created By: Tejaswini (Yantra Inc.)
 * Modified By: Ganesh Sapkale(Yantra)
 * Description:
 *********************************************************** */
define(['N/url', 'N/record', 'N/search', 'N/runtime', 'N/email', 'N/format', 'N/file', 'N/task', 'N/https', 'N/xml', 'N/currentRecord', 'N/ui/serverWidget', 'N/redirect'],

    function (url, record, search, runtime, email, format, file, task, https, xml, currentRecord, serverWidget, redirect) {
    function afterSubmit(context) {
        try {
            if (context.type == context.UserEventType.EDIT) {

                var scriptObj = runtime.getCurrentScript();
				//var holdTime='';

                var token_URL = scriptObj.getParameter({
                    name: 'custscript_token_url_1'
                });
                log.debug("token_URL", token_URL);

                var user_name = scriptObj.getParameter({
                    name: 'custscript_user_name_1'
                });

                var new_rec = context.newRecord;

                var i_currentTaskId = new_rec.id;
                log.debug("i_currentTaskId", i_currentTaskId);

                var old_rec = context.oldRecord;

                var old_assignee = old_rec.getValue({
                    fieldId: 'assigned'
                });
                log.debug("old_assignee", old_assignee);

                var old_ticket_status = old_rec.getValue({
                    fieldId: 'custevent_hsmc_task_ticket_status'
                });
                var new_ticket_status = new_rec.getValue({
                    fieldId: 'custevent_hsmc_task_ticket_status'
                });

                var i_service_desk_details_id = new_rec.getValue({
                    fieldId: 'custevent_hsm_service_desk_detail'
                });
                var new_assignee = new_rec.getValue({
                    fieldId: 'assigned'
                });
                log.debug("new_assignee", new_assignee);

                var title = new_rec.getText({
                    fieldId: 'title'
                });
                log.debug("title", title);

                var assign_to = new_rec.getText({
                    fieldId: 'assigned'
                });
                log.debug("assign_to", assign_to);
				var timeStatus = new_rec.getText({
                    fieldId: 'custevent_hsmc_track_time_status'
                });
                log.debug("timeStatus", timeStatus);
				var oldTimeStatus = old_rec.getText({
                    fieldId: 'custevent_hsmc_track_time_status'
                });
                log.debug("oldTimeStatus", oldTimeStatus);
				
				
				if(timeStatus=='Hold End Time'){
					
					var HoldStartTime = new_rec.getValue({
                    fieldId: 'custevent_hsmc_hold_time_start'
                });
                log.debug("HoldStartTime", HoldStartTime);
					
					var HoldEndTime = new_rec.getValue({
                    fieldId: 'custevent_hsmc_hold_time_end'
                });
                log.debug("HoldEndTime", HoldEndTime);
					
					 var holdTime = new_rec.getValue({
                    fieldId: 'custevent_hsmc_total_hold_time'
                });
				log.debug('holdTime',holdTime)
				

				
					var date1_hold_time_start = update(new Date(HoldStartTime),new Date(HoldEndTime));
					
                    log.audit('date1_hold_time_start', date1_hold_time_start)
					
					if(holdTime){
                   var hold_diff_Time=sumOFHoursWorked(holdTime,date1_hold_time_start)
				   log.debug('hold_diff_Time',hold_diff_Time)
					}
					else{
						var hold_diff_Time=date1_hold_time_start;
					}
					
					var task_submit = record.submitFields({
                        type: 'task',
                        id: i_currentTaskId,
                        values: {
                            
							custevent_hsmc_hold_time:date1_hold_time_start,
							custevent_hsmc_total_hold_time:hold_diff_Time,
							custevent_hsmc_track_time_status:''
							

                        },
                        options: {
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        }
                    });
					
					
					
				}
				if(timeStatus=='End Time'){
					
					var start_Time = new_rec.getValue({
                    fieldId: 'custevent_hsmc_status_start_time'
                });
                log.debug("start_Time", start_Time);
					
					var end_Time = new_rec.getValue({
                    fieldId: 'custevent_hsmc_status_end_time'
                });
                log.debug("end_Time", end_Time);
					
					 var holdTime = new_rec.getValue({
                    fieldId: 'custevent_hsmc_total_hold_time'
                });
				log.debug('holdTime',holdTime)
				

				
					var hours_Diff = update(new Date(start_Time),new Date(end_Time));
                    log.audit('hours_Diff', hours_Diff)
					
					if(holdTime){
                   var total_difference_in_hours = diff(holdTime,hours_Diff)
					log.debug('total_difference_in_hours',total_difference_in_hours)
					log.debug('enter into holdtime')
					}
					else{
						var total_difference_in_hours=hours_Diff;
						log.debug('enter into  only holdtime')
					}
					
					var task_submit = record.submitFields({
                        type: 'task',
                        id: i_currentTaskId,
                        values: {
                            
							custevent1:total_difference_in_hours,
							//custevent_hsmc_total_hold_time:hold_diff_Time,
							custevent_hsmc_track_time_status:''
							

                        },
                        options: {
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        }
                    });
					
					
					
				}

                var task_submit = record.submitFields({
                    type: 'task',
                    id: i_currentTaskId,
                    values: {
                        custeventhsmc_flag_check: true

                    },
                    options: {
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                });
               

                var i_serviceDeskRec_id = 0;
                log.debug("i_currentTaskId", i_currentTaskId)
                var customrecord_hsmc_service_deskSearchObj = search.create({
                    type: "customrecord_hsmc_support",
                    filters: [
                        ["custrecord_hsmc_parent_task", "is", i_currentTaskId]
                    ],
                    columns: [
                        search.createColumn({
                            name: "internalid"
                        }),
                    ]
                });

                var searchResultCount = customrecord_hsmc_service_deskSearchObj.runPaged().count;
                log.debug("customrecord_hsmc_service_deskSearchObj result count", searchResultCount);
                customrecord_hsmc_service_deskSearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results

                    i_serviceDeskRec_id = result.getValue("internalid");
                    return true;
                });
                log.debug("i_serviceDeskRec_id", i_serviceDeskRec_id)

                if (i_serviceDeskRec_id) {

                    var o_pcvCrObj = record.submitFields({
                        type: 'customrecord_hsmc_support',
                        id: i_serviceDeskRec_id,
                        values: {
                            custrecord_hsmc_status_field: new_ticket_status,
                            custrecord_hsmc_updated_via: 'Netsuite'

                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                    /****Updation api calling (215-229)**/
                     var urlToCall = url.resolveScript({
                    scriptId: 'customscript_hsmc_su_pcv_update',
                    deploymentId: 'customdeploy_hsmc_su_pcv_update',
                    returnExternalUrl: true
                    });
                    urlToCall += '&recId=' + i_serviceDeskRec_id; //i_service_desk_details_id
                    urlToCall += '&token_URL=' + token_URL;
                    urlToCall += '&user_name=' + user_name;

                    log.debug("urlToCall", urlToCall)
                   var response = https.request({
                    method: https.Method.GET,
                    url: urlToCall
                    })
                    log.debug("response",response);  

                    

                }

                

            } else {

                

                log.audit("Mode", context.type)
            }

        } catch (e) {
            log.error("after record error", e);
        }
    }

    function beforeLoad(context) {

        try {

            var currentRecord = context.type;

            log.debug('befor load Add Button Type', currentRecord);

            if (currentRecord == 'edit') {

                var recObj = context.newRecord;

                var i_currentTaskId = recObj.id;
                log.audit('task record id', i_currentTaskId)

                var taskRecordLoad = record.load({
                    type: 'task',
                    id: i_currentTaskId,
                    isDynamic: true
                });
                log.debug('taskRecordLoad', taskRecordLoad);

                var flag_value = taskRecordLoad.getValue({
                    fieldId: 'custeventhsmc_flag_check'
                });
                log.audit('before load  check flag value', flag_value)

                var i_serviceDeskRec_id = 0;

                var currentRecordType = recObj.type;

                log.debug('Add Button Type', 'currentRecordType :' + currentRecordType);

                var customrecord_hsmc_service_deskSearchObj = search.create({
                    type: "customrecord_hsmc_support",
                    filters: [
                        ["custrecord_hsmc_parent_task", "is", i_currentTaskId]
                    ],
                    columns: [
                        search.createColumn({
                            name: "internalid"
                        }),
                    ]
                });

                var searchResultCount = customrecord_hsmc_service_deskSearchObj.runPaged().count;
                log.debug("customrecord_hsmc_service_deskSearchObj result count", searchResultCount);
                customrecord_hsmc_service_deskSearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results

                    i_serviceDeskRec_id = result.getValue("internalid");
                    return true;
                });
                log.debug("i_serviceDeskRec_id", i_serviceDeskRec_id)
                /**Get detail API Clling (377-391)***/
                 if(flag_value==true){


                redirect.toSuitelet({
                scriptId: 'customscript_su_pcvisor_getticket_detail',
                deploymentId: 'customdeploy_su_pcvisor_getticket_detail',
                returnExternalUrl: true,
                parameters: {
                'recId':i_serviceDeskRec_id,
                'taskrecId':i_currentTaskId

                }
                });


                }
                
            }

        } catch (e) {

            log.error('Error in before load function||error', e);
        }

    }

function update(d1,d2) {
    /* var theevent = new Date(datetime);
    now = new Date(); */
    var sec_num = (d2 - d1) / 1000;
    var days    = Math.floor(sec_num / (3600 * 24));
    var hours1   = (d2.getTime() - d1.getTime());
  
      // calculate the number of days between hours dates javascript
      var hoursDiff = hours1 / (1000 * 3600);
	  var splitHr=hoursDiff.toString().split('.')
	  var hr_split=splitHr[0]
var hours   = Math.floor((sec_num - (days * (3600 * 24)))/3600);	  
    var minutes = Math.floor((sec_num - (days * (3600 * 24)) - (hours * 3600)) / 60);
    var seconds = Math.floor(sec_num - (days * (3600 * 24)) - (hours * 3600) - (minutes * 60));

    if (hr_split   < 10) {hr_split   = "0"+hr_split;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    return  hr_split+':'+minutes;
}
function diff(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0)
       hours = hours + 24;

    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}
function sumOFHoursWorked(t1,t2){
    var time1 = t1;
	log.debug('time1',time1)
	
    var time2 = t2;
	log.debug('time2',time2)


    var hour=0;
    var minute=0;
    var second=0;

    var splitTime1= time1.split(':');
	log.debug('splitTime1',splitTime1)
    var splitTime2= time2.split(':');
	log.debug('splitTime2',splitTime2)
	
	if(splitTime1[0]){
		var hrAdd=parseInt(splitTime1[0].replace(/^0+/,"")*60)
		log.debug('hrAdd',hrAdd)
		if(hrAdd){
			var hrAdd=hrAdd;
		}
		else{
			var hrAdd=0;
		}

	}
	if(splitTime1[1]){
		var minAdd=parseInt(splitTime1[1].replace(/^0+/,""))
		log.debug('minAdd',minAdd)
		if(minAdd){
			var minAdd=minAdd;
		}
		else{
			var minAdd=0;
		}
	}
	var addMinHr=hrAdd+minAdd
	log.debug('addMinHr',addMinHr)
	if(splitTime2[0]){
		var hrsplitTime2Add=parseInt(splitTime2[0].replace(/^0+/,"")*60)
		log.debug('hrsplitTime2Add',hrsplitTime2Add)
		if(hrsplitTime2Add){
			var hrsplitTime2Add=hrsplitTime2Add;
		}
		else{
			var hrsplitTime2Add=0;
		}
	}
	if(splitTime2[1]){
		var minsplitTime2AddAdd=parseInt(splitTime2[1].replace(/^0+/,""))
		log.debug('minsplitTime2AddAdd',minsplitTime2AddAdd)
		if(minsplitTime2AddAdd){
			var minsplitTime2AddAdd=minsplitTime2AddAdd;
		}
		else{
			var minsplitTime2AddAdd=0;
		}
	}
	var addMinHrtime2=hrsplitTime2Add+minsplitTime2AddAdd
	log.debug('addMinHrtime2',addMinHrtime2)
	
var minutes_calculation=Number(hrAdd)+Number(minAdd)+Number(hrsplitTime2Add)+Number(minsplitTime2AddAdd)

log.debug('minutes_calculation',minutes_calculation)
    
var num = minutes_calculation;
var hours = (num / 60);
var rhours = Math.floor(hours);
if (rhours   < 10) {rhours   = "0"+rhours;}
   
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
 if (rminutes < 10) {rminutes = "0"+rminutes;}
return  rhours+':'+rminutes ;

}
    return {

        afterSubmit: afterSubmit,
        beforeLoad: beforeLoad
    };

})
