/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

/*************************************************************
 * File Header
 * Script Type: User Script
 * Script Name: set Customer 
 * File Name:  UE_HSMC_SetCustomerTimeTrack.js
 * Created On: 21/11/2022
 * Modified On:
 * Created By: Amisha Tyagi(Yantra Inc.)
 *********************************************************** */

 define(['N/record','N/search'],function(record,search){

    function beforeLoad(context){
   
    try{
   
    var s_type = context.type;
    log.debug('beforeLoad','s_type =='+s_type)
   
    if (context.type == context.UserEventType.EDIT ||context.type == context.UserEventType.CREATE)
    {
   
   
    var newRecord = context.newRecord;
    var form = context.form;
   
    var rec_id =  newRecord.id;
    log.debug('Record ID',rec_id);
   
    var rec_type = newRecord.type;
    log.debug('Record Type',rec_type);
    
	
	var customerArray =new Array();
		var internalIdArray =new Array();
		
       var getEmployeeValue =context.newRecord.getValue({fieldId:'employee'});
				log.debug('beforeLoad','getEmployeeValue=='+getEmployeeValue);
				
       
        //form.addField({ "id":"custpage_subsidiary_addr_value", "label": "SubsidiaryAddress", "type": "textarea" });
        var selectCustomer =form.addField({ id:"custpage_customer_name", label: "Hitachi Customer", type: "SELECT",});
		
		form.insertField(selectCustomer, 'customer');
		
		if(getEmployeeValue)//
			{				

				

				
						
							
							//project customer search
							var projecttaskSearchObj = search.create({
				   type: "projecttask",
				   filters:
				   [
					  ["projecttaskassignment.resource","anyof",getEmployeeValue]
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
					  ["assigned","anyof",getEmployeeValue]
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
				selectCustomer.addSelectOption({
						value:'',
						text:''
					});
				
				for(i=0;i<internalIdArray.length;i++){
					selectCustomer.addSelectOption({
						value: internalIdArray[i],
						text: customerArray[i]
					});
				}			
			}
        
       
   
   
   
   
   
    
   
    }
    }
    catch(ex){
    log.debug('Error',ex);
    }
   
    }
   
   
    return{
   
    beforeLoad:beforeLoad,
	//afterSubmit:afterSubmit
    };
   
   
    })
