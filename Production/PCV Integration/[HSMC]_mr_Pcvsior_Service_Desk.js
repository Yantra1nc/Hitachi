/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */

/*************************************************************
 * File Header
 * Script Type: Map Reduce Script
 * Created On: 05/08/2022
 * Modified On: 
 * Created By: Amisha Tyagi. (Yantra Inc.)
 *Description:Fetching all the ticket list using Service desk API
 *********************************************************** */
// GetInputData : 10000 Units
// Map : 1000 Units
// Reduce : 5000 Units
// Summary : 10000 Units
define(['N/record', 'N/search', 'N/runtime', 'N/email', 'N/format', 'N/file', 'N/task', './LIB_PC_VISIOR_CONNECTION', 'N/https'],

    function(record, search, runtime, email, format, file, task, lib, https) {
        var arr_serviceId = new Array();
        var arr_organisation = new Array();

        function getInputData(context) {
            try {

                var scriptObj = runtime.getCurrentScript();
                var errorData = 0;
                var getCurrDate = new Date();
                var createdDate = new Date(getCurrDate.getTime() + 3600000 * (+5.50))
                log.audit('(3600000*(+5.30))****', new Date(getCurrDate.getTime() + 3600000 * (+5.50)));
                var getCreatedDateHr = createdDate.getHours() - 2;
                var reqCreatedDate = new Date(createdDate.setHours(getCreatedDateHr))
                var reqCreatedDatesetMin = reqCreatedDate.setMinutes(0)
                var reqCreatedDatesetSec = reqCreatedDate.setSeconds(0)
                var reqCreatedDatesetMill = reqCreatedDate.setMilliseconds(0)
                log.audit('(3600000*(+5.30))****', reqCreatedDatesetMill)

                var integration_cre_record = record.load({
                    type: 'customrecord_integration_credentials',
                    id: 2,
                    isDynamic: true
                });

                var getToken = integration_cre_record.getValue({
                    fieldId: 'custrecord_hsmc_token'
                });
                log.audit("oldgetToken", getToken);
                var auth_url = integration_cre_record.getValue({
                    fieldId: 'custrecord_pcv_get_ticket_url'
                });
                //log.debug('auth_url',auth_url);

                var arr = [];
                var result;
                var result_arr = [];
                //create complete url

                var conct_url = auth_url;

                //token_values='MC54L1FkL3hBbE1sQ3BMZGJnakplanpMQ0dLUStjYU1VN202b1hGM1dGQzBqYm03aEdiQVpEZzVUaXdqcko1TVdRR1ZqTDhjSlVscGFRK0crTDFNbTZMdz09'
                //Hit url in order to get Total Record
                try {
                    //log.audit('enter into the old token generation scenario')
                    var arr_result = arrayTicketResult(getToken, conct_url, reqCreatedDate)
                    //log.audit('arr_result',arr_result)

                } catch (e) {
                    log.error("ERROR EXCEPTION", 'excsw -->' + e);
                    errorData = e;
                    log.debug('errorData', errorData);
                    if (errorData) {
                        log.debug('enter into the new token generation scenario')
                        var pc_visior_token_det = lib._pcvisior_getAccessToken(); //Get Token from lib
                        var getToken = pc_visior_token_det[4];
                        var arr_result = arrayTicketResult(getToken, conct_url, reqCreatedDate)
                        //log.audit('arr_result with new token',arr_result)

                    }
                }

                var o_file = file.create({ //Create File
                    name: 'GET TICKET JSON.json',
                    fileType: file.Type.JSON,
                    contents: JSON.stringify(arr_result),
                    folder: 109

                });
                var i_file_id = o_file.save();
                log.audit('i_file_id', i_file_id)

                return arr_result; //return array with all ticket result 
            } catch (excsw) {
                log.error("ERROR EXCEPTION", 'excsw -->' + excsw);
            }

        }

        function map(context) {
            try {

                var key = context.key
                var value = context.value;
                var objParsedValue = JSON.parse(value);
                context.write(key, objParsedValue); //Convert json to key value pair and send to map function

            } catch (e) {
                log.debug('error in map', e)
            }
        }

        function reduce(context) {
            try {

                context.write({
                    key: context.key,
                    value: context.values.length //get length of all key /value pair
                });
                var length = context.values.length;
                var a;
                var count = 0;

                for (a = 0; a < context.values.length; a++) {
                    var result = context.values[a];
                    var result_parsed_json = JSON.parse(result);
                    var ticket_ref = result_parsed_json.TicketRef;
                    //log.debug('ticket_ref',ticket_ref)
                    var service_desk_id = result_parsed_json.ServiceDeskId;
                    var service_desk_ticket_id = result_parsed_json.ServiceDeskTicketId;
                    var priority = result_parsed_json.Priority;
                    //log.audit('priority',priority);
                    var sevirity = result_parsed_json.Severity;
                    //log.audit('sevirity',sevirity);
                    var category = result_parsed_json.Category;
                    //log.audit('category',category);
                    var organization = result_parsed_json.Organization;
                    //log.audit('organization',organization);
                    var resolution = result_parsed_json.Resolution;
                    var submitter = result_parsed_json.Submitter;
                    //log.audit('submitter',submitter);
                    var summary = result_parsed_json.Summary;
                    //log.audit('summary',summary);
                    var submitter_email = result_parsed_json.SubmitterEmail;
                    var assignee = result_parsed_json.Assignee;
                    //log.audit('assignee',assignee);
                    var createdDatePCV = result_parsed_json.CreatedDate;
                    //log.audit('createdDate',createdDatePCV);
                    /* var org_set=setOrganisationField(organization)//add search in order to get organisation from customer 
                    log.debug('org_set',org_set) ;*/

                    //Call function in order to check existed records
                    var duplicate_count = checkForDuplicates(ticket_ref);
                    //log.debug('duplicate_count', duplicate_count)

                    if (duplicate_count.indexOf(service_desk_ticket_id) == -1) {
                        //----------------------Create custom record to store tciket details--------------//
                        var service_desk_custom_record = record.create({
                            type: 'customrecord_hsmc_service_desk_record',
                            isDynamic: true
                        });
                        //log.debug('service_desk_custom_record', service_desk_custom_record);
                        service_desk_custom_record.setValue({
                            fieldId: 'name',
                            value: ticket_ref
                        });
                        service_desk_custom_record.setValue({
                            fieldId: 'custrecord_hsmc_sd_service_desk_id',
                            value: service_desk_id
                        });
                        service_desk_custom_record.setValue({
                            fieldId: 'externalid',
                            value: service_desk_ticket_id
                        });
                        service_desk_custom_record.setValue({
                            fieldId: 'custrecord_hsmc_sd_service_desk_ticketid',
                            value: service_desk_ticket_id
                        });

                        service_desk_custom_record.setValue({
                            fieldId: 'custrecord_hsmc_sd_priority',
                            value: priority
                        });
                        service_desk_custom_record.setValue({
                            fieldId: 'custrecord_hsmc_sd_severity',
                            value: sevirity
                        });
                        service_desk_custom_record.setValue({
                            fieldId: 'custrecord_hsmc_sd_category',
                            value: category
                        });

                        service_desk_custom_record.setValue({
                            fieldId: 'custrecord_hsmc_sd_submitter',
                            value: submitter
                        });
                        service_desk_custom_record.setValue({
                            fieldId: 'custrecord_hsmc_sd_assignee',
                            value: assignee
                        });
                        service_desk_custom_record.setValue({
                            fieldId: 'custrecord_hsmc_sd_summary',
                            value: summary
                        });
                        service_desk_custom_record.setValue({
                            fieldId: 'custrecord_hsmc_sd_submitter_email',
                            value: submitter_email
                        });

                        service_desk_custom_record.setValue({
                            fieldId: 'custrecord_hsmc_pcv_created_date',
                            value: createdDatePCV
                        });
                        var rec_save_id = service_desk_custom_record.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });
                        log.audit('rec_save_id', rec_save_id)
                        //log.audit('rec_save_id', organization)						//save created record

                    } else {
                        log.debug('*********already custom record has been created', ticket_ref);
                    }

                }

            } catch (e) {
                log.error('error in reduce function', e)
            }

        }

        function summarize(summary) {

        }

        function concat(arr1, arr2) {
            for (j = 0; j < arr2.length; j++) {
                arr1.push(arr2[j])
            }
        }
        //Need to add date filter
        function checkForDuplicates(ticket_ref) {

            var id;
            var customrecord_hsmc_service_desk_recordSearchObj = search.create({
                type: "customrecord_hsmc_service_desk_record",
                filters: [
                    ["name", "is", ticket_ref]
                ],
                columns: [
                    search.createColumn({
                        name: "custrecord_hsmc_sd_service_desk_ticketid",
                        label: "Service Desk Ticket ID"
                    })
                ]
            });
            var searchResultCount = customrecord_hsmc_service_desk_recordSearchObj.runPaged().count;
            //log.debug("customrecord_hsmc_service_desk_recordSearchObj result count", searchResultCount);
            customrecord_hsmc_service_desk_recordSearchObj.run().each(function(result) {
                // .run().each has a limit of 4,000 results
                id = result.getValue({
                    name: "custrecord_hsmc_sd_service_desk_ticketid",
                    label: "Service Desk Ticket ID"
                })
                arr_serviceId.push(id);
                //log.debug("array data count", arr_serviceId);
                return true;
            });
            //log.debug("out loop array count", arr_serviceId);

            return arr_serviceId;
        }

        /*   function setOrganisationField(organization){
        	  var id;
        				  var customerSearchObj = search.create({
        				   type: "customer",
        				   filters:
        				   [
        					  ["stage","anyof","CUSTOMER"], 
        					  "AND", 
        					  ["companyname","contains",organization]
        				   ],
        				   columns:
        				   [
        					  search.createColumn({name: "internalid", label: "Internal ID"}),
        					  search.createColumn({name: "companyname", label: "Company Name"})
        				   ]
        				});
        				var searchResultCount = customerSearchObj.runPaged().count;
        				log.debug("customerSearchObj result count",searchResultCount);
        				customerSearchObj.run().each(function(result){
        					id = result.getValue({
                            name: "internalid",
                            label: "Internal ID"
                        })
        				   // .run().each has a limit of 4,000 results
        				   arr_organisation.push(id)
        				   return true;
        				});

        				
                      return id;
        			
          } */
        function arrayTicketResult(getToken, conct_url, reqCreatedDate) {
            var i = 0;
            var count = 0;
            var arr = [];
            log.audit('link', conct_url + "$filter=CreatedDate ge DATETIME" + "'" + reqCreatedDate.toISOString() + "'")
            var response = https.get({
                url: conct_url + "?$filter=CreatedDate ge DATETIME" + "'" + reqCreatedDate.toISOString() + "'",
                headers: {
                    "Authorization": 'Bearer ' + getToken
                }
            });
            var parse_resp = JSON.parse(response.body)
            //log.debug('parse_resp', parse_resp); 
            var ticket_result_JSON = parse_resp.TotalRecords;
            log.debug('ticket_result_JSON', ticket_result_JSON); //total result from body

            //While condtion so that it iterate every next 100+ records
            while (i < ticket_result_JSON) {
                // log.debug('i value',i)
                var response = https.get({
                    url: conct_url + "?$filter=CreatedDate ge DATETIME" + "'" + reqCreatedDate.toISOString() + "'" + "&$skip=" + i,
                    headers: {
                        "Authorization": 'Bearer ' + getToken
                    }
                });
                var response_body = JSON.parse(response.body)
                result = response_body.Result;
                var rsult_length = result.length;
                //Function Call to push data in array
                concat(arr, result)
                i += 100;
                count++

            }
            return arr;
        }

        function _logValidation(value) {
            if (value != null && value != 'undefined' && value != undefined && value != '' && value != 'NaN' && value != ' ' && value != "0000-00-00") {
                return true;
            } else {
                return false;
            }
        }

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };

    });
