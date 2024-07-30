const REPORT_SCHEMA = [
  {name: 'reviewer', type: 'STRING'}, 
  {name: 'assigned_reason', type: 'STRING'}, 
  {name: 'ldap', type: 'STRING'}, 
  {name: 'case_subject', type: 'STRING'}, 
  {name: 'site', type: 'STRING'}, 
  {name: 'case_status_shortened', type: 'STRING'}, 
  {name: 'priority', type: 'BOOLEAN'}, 
  {name: 'escalated', type: 'BOOLEAN'}, 
  {name: 'case_age', type: 'case_age'}, 
  {name: 'specialization', type: 'STRING'}, 
  {name: 'eng_bugs_links', type: 'STRING'}, 
  {name: 'flags_links', type: 'STRING'}, 
  {name: 'hard_consult_count', type: 'STRING'}, 
  {name: 'live_consult_count', type: 'STRING'}, 
  {name: 'rcr', type: 'STRING'}, 
  {name: 'completed', type: 'STRING'}, 
  {name: 'driver', type: 'STRING'}, 
  {name: 'action_taken1', type: 'STRING'}, 
  {name: 'action_taken2', type: 'STRING'}, 
  {name: 'time_taken', type: 'STRING'}, 
  {name: 'notes', type: 'STRING'}, 
  {name: 'scrub_date', type: 'STRING'}, 
  {name: 'version', type: 'STRING'} 
];
//['reviewer', 'assigned_reason', 'ldap', 'case_subject', 'site', 'case_status_shortened', 'priority', 'escalated', 'case_age', 'specialization', 'case_number', 'eng_bugs_links', 'flags_links', 'hard_consult_count', 'live_consult_count', 'rcr', 'completed', 'driver', 'action_taken1', 'action_taken2', 'time_taken', 'notes', 'scrub_date', 'version']	


function loadDataToBigQuery_(projectId, datasetId, tableId, schema, raws) {

  let table = {
    tableReference: {
      projectId: projectId,
      datasetId: datasetId,
      tableId: tableId
    },
    schema: {
      fields: [
        {name: 'week', type: 'STRING'},
        {name: 'cat', type: 'INTEGER'},
        {name: 'dog', type: 'INTEGER'},
        {name: 'bird', type: 'INTEGER'}
      ]
    }
  };
  try {
    table = BigQuery.Tables.insert(table, projectId, datasetId);
    console.log('Table created: %s', table.id);
  } catch (err) {
    console.log('unable to create table');
  }
  // Load CSV data from Drive and convert to the correct format for upload.
  const file = DriveApp.getFileById(csvFileId);
  const data = file.getBlob().setContentType('application/octet-stream');

  // Create the data upload job.
  const job = {
    configuration: {
      load: {
        destinationTable: {
          projectId: projectId,
          datasetId: datasetId,
          tableId: tableId
        },
        skipLeadingRows: 1
      }
    }
  };
  try {
    const jobResult = BigQuery.Jobs.insert(job, projectId, data);
    console.log(`Load job started. Status: ${jobResult.status.state}`);
  } catch (err) {
    console.log('unable to insert job');
  }
}

function convertRawsToCVS_(raws) {
  // var rowsCSV = raws.join("\n");
  return Utilities.newBlob(raws.join("\n"), "text/csv").setContentType('application/octet-stream');
  // return blob.setContentType('application/octet-stream');
}

/**
 * var rowsCSV = rows.join("\n");
  var blob = Utilities.newBlob(rowsCSV, "text/csv");
  var data = blob.setContentType('application/octet-stream');
  // Create the data upload job. 
  var job = {
    configuration: {
      load: {
        destinationTable: {
          projectId: projectId,
          datasetId: datasetId,
          tableId: tableId
        },
        skipLeadingRows: 1,
        writeDisposition: 'WRITE_APPEND'
      }
    }
  };
 */

