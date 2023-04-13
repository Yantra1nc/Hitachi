/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */

/*************************************************************
 * File Header
 * Script Type
 * Created On: 
 * Modified On: 
 * Created By: 
 *Description:
 *********************************************************** */
// GetInputData : 10000 Units
// Map : 1000 Units
// Reduce : 5000 Units
// Summary : 10000 Units
define(['N/record', 'N/search', 'N/runtime', 'N/email', 'N/format', 'N/file', 'N/task', './LIB_PC_VISIOR_CONNECTION', 'N/https','N/url'],

    function(record, search, runtime, email, format, file, task, lib, https,url) {


        function getInputData(context) {
            var i_rec_id;
            try {

                var id_array = [];
                // search for get record id
                var customrecord_hsmc_supportSearchObj = search.load({
					id:"customsearch_service_status"
                    
                });
                
                return customrecord_hsmc_supportSearchObj;




                


            } catch (excsw) {
                log.error("ERROR EXCEPTION", 'excsw -->' + excsw);
            }

        }

        function map(context) {
            try {
				var service_desk_id = context.key;
                var urlToCall = url.resolveScript({
                            scriptId: 'customscript_su_pcvisor_getticket_detail',
                            deploymentId: 'customdeploy_su_pcvisor_getticket_detail',
                            returnExternalUrl: true
                        });
                        urlToCall += '&recId=' + service_desk_id; //i_service_desk_details_id
                       

                        log.debug("urlToCall", urlToCall)

                         var response = https.request({
                            method: https.Method.GET,
                            url: urlToCall
                        })
                        //log.debug("response",response); 
				
               
			
                    
                        
                }
				catch (e) {
                log.debug('error in map', e)
            }

        }

        function reduce(context) {
            try {




            } catch (e) {
                log.error('error in reduce function', e)
            }

        }

        function summarize(summary) {

            var output = url.resolveScript({
                scriptId: 'customscript_su_pcvisor_getticket_detail',
                deploymentId: 'customdeploy_su_pcvisor_getticket_detail',
                returnExternalUrl: true
            });

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
