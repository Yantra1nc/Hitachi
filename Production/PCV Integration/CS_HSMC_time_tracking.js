/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
/**  File Name: CS_HSMC_timeTracking.js
 * File ID: 
 * Date Created: 28 Febuary 2022
 * Author: Amisha Tyagi
 * Company: Yantra Tech Innovation Lab Pvt. Ltd.
 * email: pralhad@yantrainc.com
 * Description: This script is used to do validation on the Request Allocation Record.
 */
/**
 * Script Modification Log:
 * 
       -- Date --            -- Modified By --              --Requested By--                           -- Description --

 *
 */
define(['N/currentRecord','N/record','N/search','N/format','N/log'],

		function(currentRecord,record,search,format,log) {

	var currentRecord = currentRecord.get();

	function pageInit(scriptContext) {
		
		//alert('In pageinit function');
		var currentRecord = scriptContext.currentRecord;
		var theField = currentRecord.getField({
                        fieldId: 'hours'
                    });
                    theField.isDisabled = true;
		
		log.debug('enter into page init');
		
		var theHours = currentRecord.getValue({
                        fieldId: 'hours'
                    });
                 if(!theHours){
					 currentRecord.setText('hours','0:00') 
				 }
		
		
	}
function fieldChanged(scriptContext) {
	     //alert('In fieldChanged');
		var currentRecord = scriptContext.currentRecord;
		var fieldName = scriptContext.fieldId;
		var sublistName = scriptContext.sublistId
		var customerArray =new Array();
		var internalIdArray =new Array();
		try{
			if(fieldName == 'employee')//
			{				

				//var getResourceValue = currentRecord.getText({fieldId:'allocationresource'});
				//alert('getResourceValue=='+getResourceValue);

				var getEmpValue = currentRecord.getValue({fieldId:'employee'});
							log.debug('getEmpValue=='+getEmpValue);
							if(getEmpValue){
							var field  = scriptContext.currentRecord.getField({fieldId:'custpage_customer_name'});
							log.debug('getEmpValuesss=='+field);
							field.removeSelectOption({
										value: null,
									}); 
							
							//project customer search
							var projecttaskSearchObj = search.create({
				   type: "projecttask",
				   filters:
				   [
					  ["projecttaskassignment.resource","anyof",getEmpValue]
				   ],
				   columns:
									   [
						  search.createColumn({
							 name: "resource",
							 join: "projectTaskAssignment",
							 summary: "GROUP",
							 label: "Resource"
						  }),
						  search.createColumn({
							 name: "company",
							 summary: "GROUP",
							 label: "Project"
						  }),
						  search.createColumn({
							 name: "internalid",
							 join: "job",
							 summary: "GROUP",
							 label: "Internal ID"
						  })
					   ]
				});
				var searchResultCount = projecttaskSearchObj.runPaged().count;
				log.debug("projecttaskSearchObj result count",searchResultCount);
				projecttaskSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   
				   id = result.getText({
                    name: "company",
							 summary: "GROUP",
							 label: "Project"
                })
				 internal_id = result.getValue({
                             name: "internalid",
							 join: "job",
							 summary: "GROUP",
							 label: "Internal ID"
                })
				//log.debug('id',id)
                customerArray.push(id);
				internalIdArray.push(internal_id);
				   return true;
				});
				// Task customer search
				var taskSearchObj = search.create({
				   type: "task",
				   filters:
				   [
					  ["company","noneof","@NONE@"], 
					  "AND", 
					  ["assigned","anyof",getEmpValue]
				   ],
				   columns:
								   [
					  search.createColumn({
						 name: "company",
						 summary: "GROUP",
						 label: "Company"
					  }),
					  search.createColumn({
						 name: "assigned",
						 summary: "GROUP",
						 label: "Assigned To"
					  }),
					  search.createColumn({
						 name: "internalid",
						 join: "company",
						 summary: "GROUP",
						 label: "Internal ID"
					  })
				   ]
				});
				var searchResultCount = taskSearchObj.runPaged().count;
				log.debug("taskSearchObj result count",searchResultCount);
				taskSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   
				   id = result.getText({
                    name: "company",
						 summary: "GROUP",
						 label: "Company"
                })
				internal_id = result.getValue({
                             name: "internalid",
						 join: "company",
						 summary: "GROUP",
						 label: "Internal ID"
                })
				//log.debug('id',id)
                customerArray.push(id);
				internalIdArray.push(internal_id);
				   return true;
				});
			log.debug('internalIdArray array',internalIdArray)

				//log.debug(' length',customerArray.length)
				field.insertSelectOption({
						value:'',
						text:''
					});
				for(i=0;i<internalIdArray.length;i++){
					field.insertSelectOption({
						value: internalIdArray[i],
						text: customerArray[i]
					});
				}
							}				
			}
			if(fieldName == 'custpage_customer_name'){
				var getCustValue = currentRecord.getValue({fieldId:'custpage_customer_name'});
				
							log.debug('getCustValue=='+getCustValue);
							
				currentRecord.setValue({
					fieldId:'customer',
					value:getCustValue
				})
			}
			if(fieldName == 'custcol123457'){
				var getProjValue = currentRecord.getValue({fieldId:'custcol123457'});
				log.debug('getProjValue',getProjValue)
				
					
						
					currentRecord.setValue({
					fieldId:'casetaskevent',
					value:getProjValue
				})
				
				}
				if(fieldName == 'custcol_hsmc_case_task'){
					
						var getCrmtask = currentRecord.getValue({fieldId:'custcol_hsmc_case_task'});
				log.debug('getCrmtask',getCrmtask)
					
					currentRecord.setValue({
					fieldId:'casetaskevent',
					value:getCrmtask
				})
				
					
				}
				
				
			
			
			
		}catch(e){
			
			log.error('error in field Change||field change',e)
		}
		
		
}

function OnSaveRecord(scriptContext) {
        try {

            var currentRecord = scriptContext.currentRecord;
            var record_Id = currentRecord.id;
            log.audit('record_Id',record_Id);
            var record_type = currentRecord.type;
            log.audit('record_type',record_type);
			
			var startTime=currentRecord.getValue('custcol_hsmc_start_time_track')
			log.audit('startTime',startTime);
			var endTime=currentRecord.getValue('custcol_hsmc_end_time_track')
			log.audit('endTime',endTime);
			
			if(startTime && endTime){
			var newDateStart=getTimeFormat(startTime)
			log.debug('newDateStart',newDateStart)
			
			var newEndStart=getTimeFormat(endTime)
			log.debug('newEndStart',newEndStart)
			
			var totalTimeStamp=diff(newDateStart,newEndStart)
				log.debug('totalTimeStamp',totalTimeStamp)
				log.debug('totalTimeStamp',typeof(totalTimeStamp))
				if(totalTimeStamp){
					var totalHoldTime=currentRecord.getValue('custcol_hsmc_total_hold')
			          log.audit('totalHoldTime',totalHoldTime);
					
					var setDurationTime=diff(totalHoldTime,totalTimeStamp)
			        log.debug('setDurationTime',setDurationTime)
					currentRecord.setText('hours',setDurationTime) 
					
				}
			
			
			

           
            }
			return true;
			
		}
         catch (e) {
            log.debug("error in catch block", e);
        }
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
	
	function getTimeFormat(timeFormat){
		var newStartDate=new Date(timeFormat)
			var getTimeFormat=newStartDate.getTime()
			var getHoursFormat=newStartDate.getHours()
			var getMinFormat=newStartDate.getMinutes()
			log.debug('get time',getTimeFormat)
			log.debug('get hr',getHoursFormat)
			log.debug('get min',getMinFormat)
			 var totalTimeFormat=getHoursFormat+':'+getMinFormat
			 return totalTimeFormat
		
	}
	function diffHoldTime(startTime,endTime){
		startTime = startTime.split(":");
		log.debug('startTime',startTime)
    endTime = endTime.split(":");
		log.debug('endTime',endTime)
		var setHour=startTime[0]-endTime[0];
		log.debug('setHour',setHour)
		if(startTime[1]=='00'){
			var setMin=60-endTime[1];
		log.debug('setMin',Math.abs(setMin))
		}
		else{
		var setMin=startTime[1]-endTime[1];
		log.debug('setMin',Math.abs(setMin))
		}
		var setDurationTime=Math.abs(setHour)+':'+Math.abs(setMin)
		log.debug('setDurationTime',setDurationTime)
		return setDurationTime
		
		
		
	}
	return {
	   pageInit: pageInit,
	fieldChanged: fieldChanged,
		saveRecord: OnSaveRecord
	};

});
