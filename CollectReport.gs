function fetchAndExportReports() {
  let reportRaw = fetchReportsByShard_(SCRUB_DATA_ID, RANGE_SCRUB_REPORT);
  Logger.log('data raws = ' + reportRaw.length);
  if (reportRaw.length > 2) {
    exportReports_(DATA_SHEET, reportRaw);
    collectRecordsForLooker_(DATA_SHEET, reportRaw);
  }
  Utils.remoteClear(SCRUB_DATA_ID, REPORT_SHEET, RANGE_SCRUB_REPORT);

  reportRaw = fetchReportsByShard_(SCRUB_INFRA_ID, RANGE_SCRUB_REPORT);
  Logger.log('infra raws = ' + reportRaw.length);
  if (reportRaw.length > 2) {
    exportReports_(INFRA_SHEET, reportRaw);
    collectRecordsForLooker_(INFRA_SHEET, reportRaw);
  }
  Utils.remoteClear(SCRUB_INFRA_ID, REPORT_SHEET, RANGE_SCRUB_REPORT);

  reportRaw = fetchReportsByShard_(SCRUB_NETWORKING_ID, RANGE_SCRUB_REPORT);
  Logger.log('networking raws = ' + reportRaw.length);
  if (reportRaw.length > 2) {
    exportReports_(NETWORKING_SHEET, reportRaw);
    collectRecordsForLooker_(NETWORKING_SHEET, reportRaw);
  }
  Utils.remoteClear(SCRUB_NETWORKING_ID, REPORT_SHEET, RANGE_SCRUB_REPORT);

  reportRaw = fetchReportsByShard_(SCRUB_PLATFORM_ID, RANGE_SCRUB_REPORT);
  Logger.log('platform raws = ' + reportRaw.length);
  if (reportRaw.length > 2) {
    exportReports_(PLATFORM_SHEET, reportRaw);
    collectRecordsForLooker_(PLATFORM_SHEET, reportRaw);
  }
  Utils.remoteClear(SCRUB_PLATFORM_ID, REPORT_SHEET, RANGE_SCRUB_REPORT);
}

function collectRecordsForLooker_(shard, raws) {
  let rowId = Utils.getLastRow(LOOKER_SHEET, RANGE_REPORTER);
  if (raws.length > 2) {
    raws.forEach(
      row => {
        row.push(shard);
        Utils.appendRowToSheet(LOOKER_SHEET, [rowId++].concat(row));
      }
    );
  }

}

function generateRowId() {
  let raws = Utils.getValues(LOOKER_SHEET, 'A2:Y');
  let i = 1;
  let newRaws = [];
  raws.forEach(
    raw => {
        raw = [i++].concat(raw);
        newRaws.push(raw);
    }
  );
  // Utils.exportRawDataToSheet(LOOKER_SHEET, 'A2:Z' + (newRaws.length + 1), newRaws);
}

function generateLink() {
  let raws = Utils.getValues(LOOKER_SHEET, 'A2:Z');
  let i = 1;
  raws.forEach(
    raw => {
      raw.push('http://go/sf/' + raw[10]);
    }
  );
  // Utils.exportRawDataToSheet(LOOKER_SHEET, 'A2:AA' + (raws.length + 1), raws);

}

function fetchReportsByShard_(ss_id, reportRange) {
  return Utils.getRemoteValueWithNonLastRowRange(ss_id, REPORT_SHEET, reportRange).filter(
    raw => {
      return !Utils.isNull(raw[0]);
    }
  );
}

function exportReports_(shard, raws) {
  Utils.appendRawsToSheet(shard, raws);
}

function exportToBigQuery_() {
  
}

//49210514
function setNoCheckCompletedCases_() {
  let cases = Utils.convertRawsToJsons(Utils.getValues(LOOKER_SHEET, Utils.makeRangeWithoutLastRow(LOOKER_SHEET, RANGE_LOOKER)), SCRUBS_SCHEMA);
  cases.forEach(
    caseObj => {
      noCheckCompletedBox_(caseObj);
    }
  );
  Utils.exportRawDataToSheet(LOOKER_SHEET, (RANGE_LOOKER + (cases.length + 1)), Utils.convertJsonsToRaws(cases, SCRUBS_SCHEMA));
}

function noCheckCompletedBox_(element) {
  let flag = false;
  if(!Utils.isNull(element.action_taken1) && !Utils.isNull(element.driver)) {
    element.completed = true;
    flag = true;
  }
  return flag;
}

function removeSLetters_() {
  let cases = Utils.convertRawsToJsons(Utils.getValues(LOOKER_SHEET, Utils.makeRangeWithoutLastRow(LOOKER_SHEET, RANGE_LOOKER)), SCRUBS_SCHEMA);
  cases.forEach(
    caseObj => {
      removeSLetterForCase_(caseObj);
    }
  );
  Utils.exportRawDataToSheet(LOOKER_SHEET, (RANGE_LOOKER + (cases.length + 1)), Utils.convertJsonsToRaws(cases, SCRUBS_SCHEMA));
}

function removeSLetterForCase_(element) {
  if(!Utils.isNull(element.driver)) {
    element.driver = element.driver.replaceAll('A. ', '');
    element.driver = element.driver.replaceAll('B. ', '');
    element.driver = element.driver.replaceAll('C. ', '');
    element.driver = element.driver.replaceAll('D. ', '');
    element.driver = element.driver.replaceAll('E. ', '');
  }
}

function cleanInvalidData_() {
  let raws = Utils.getValuesWithNonLastRow(LOOKER_SHEET, RANGE_LOOKER).filter(
    raw => {
      return !Utils.isNull(raw[1]);
    }
  );
  Utils.clear(LOOKER_SHEET, RANGE_LOOKER);
  Utils.exportRawDataToSheet(LOOKER_SHEET, (RANGE_LOOKER + (raws.length + 1)), raws);
}

function correctDaylightTime_() {
  let date1 = new Date();
  date1.setMonth(2);
  date1.setDate(10);
  let raws = Utils.getValuesWithNonLastRow(LOOKER_SHEET, 'X2:X');
  raws.forEach(
    raw => {
      // let date = new Date(raw);
        // date.setDate(date.getDate() + 1);
      if (raw[0].getTime() > date1.getTime()) {

        raw[0].setHours(raw[0].getHours() + 6);
        raw[0].setDate(raw[0].getDate() + 1);
      }
    }
  );
  Logger.log(raws[0] + ' ' + raws[raws.length - 1] + " " + Utilities.formatDate(raws[raws.length - 1][0], 'EST','yyyy-MM-dd'));
  Utils.exportRawDataToSheet(LOOKER_SHEET, ('X2:X' + (raws.length + 1)), raws);
}

function correctDaylightTime_(sheet) {
  let date1 = new Date();
  date1.setMonth(2);
  date1.setDate(10);
  let raws = Utils.getValuesWithNonLastRow(sheet, 'W2:W');
  raws.forEach(
    raw => {
      // let date = new Date(raw);
        // date.setDate(date.getDate() + 1);
      if (raw[0].getTime() > date1.getTime()) {

        raw[0].setHours(raw[0].getHours() + 6);
        raw[0].setDate(raw[0].getDate() + 1);
      }
    }
  );
  Logger.log(raws[0] + ' ' + raws[raws.length - 1] + " " + Utilities.formatDate(raws[raws.length - 1][0], 'EST','yyyy-MM-dd'));
  Utils.exportRawDataToSheet(sheet, ('W2:W' + (raws.length + 1)), raws);
}

function testReport() {
  // fetchAndExportReports();
  // removeSLetters_();
  // cleanInvalidData_();
  // correctDaylightTime_();
  correctDaylightTime_(INFRA_SHEET);
  correctDaylightTime_(DATA_SHEET);
  correctDaylightTime_(NETWORKING_SHEET);
  correctDaylightTime_(PLATFORM_SHEET);
}

function generateSchema() {
  Utils.exportRawDataToSheet(LOOKER_SHEET, RANGE_SCHEMA, [SCRUBS_SCHEMA]);
}

// https://stackoverflow.com/questions/74711010/push-data-from-googlesheets-to-to-bigquery-with-appscript-how-do-i-set-up-servi
