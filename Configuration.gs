const SHEET_CONFIGURATION = 'Configuration';

// const SCRUBS_HEADER = ['Reviewer', 'Assigned Reason', 'Owner', 'Subject', 'Site', 'Status', 'Priority', 'Escalated', 'Age', 'Specialization', 'Case Number', 'Eng Bugs', 'Flags', 'HC', 'LC', 'Rcr', 'Completed', 'Driver', 'Action Taken1', 'Action Taken2', 'Time Taken(min)', 'Notes', 'Scrub Date', 'Version'];
const SCRUBS_SCHEMA = ['row_id', 'reviewer', 'assigned_reason', 'ldap', 'case_subject', 'site', 'case_status_shortened', 'priority', 'escalated', 'case_age', 'specialization', 'case_number', 'eng_bugs_links', 'flags_links', 'hard_consult_count', 'live_consult_count', 'rcr', 'completed', 'driver', 'action_taken1', 'action_taken2', 'time_taken', 'notes', 'scrub_date', 'version', 'shard'];

REPORTER_SHEET = 'Others';

ENABLE_SYNC_HOURS_BY_SHARD = true;
REPORT_HOUR = 20;

SCRUB_DATA_ID = '<data id>';
SCRUB_INFRA_ID = '<infra id>';
SCRUB_PLATFORM_ID = '<platform id>';
SCRUB_NETWORKING_ID = '<networking id>';

REPORT_SHEET = 'Report';
RANGE_SCRUB_REPORT = 'A2:X';

CONFIG_HEAD = ['Config', 'Value']

CONIFG_REPORT_HOUR_NAME = 'Running Hour';

CONFIG_ENV_DATA_NAME = 'Data Env Id'
CONFIG_ENV_INFRA_NAME = 'Infra Env Id'
CONFIG_ENV_PLATFORM_NAME = 'Platform Env Id'
CONFIG_ENV_NETWORKING_NAME = 'Networking Env Id'

CONFIG_REPORT_SHEET_NAME = 'Report Sheet';

CONFIGURATION_SHEET = 'Configuration';
RANGE_CONFIGURATION = 'B2:C';

DATA_SHEET = 'Data';
INFRA_SHEET = 'Infra';
NETWORKING_SHEET = 'Networking';
PLATFORM_SHEET = 'Platform';
RANGE_REPORTER = 'A2:X';
LOOKER_SHEET = 'Looker';
RANGE_LOOKER = 'A2:Z';
RANGE_SCHEMA = 'A1:Z1';

function loadSystemConfig_() {
  setSystemConfiguration_(Utils.getValues(CONFIGURATION_SHEET, Utils.makeRangeWithoutLastRow(CONFIGURATION_SHEET, RANGE_CONFIGURATION)));
}

function setSystemConfiguration_(configs) {
  Logger.log(configs.length);
  configs.forEach(
    config => {
      if (Utils.compareStrIgnoreCases(config[0], CONFIG_ENV_DATA_NAME)) {
        SCRUB_DATA_ID = config[1];
      } else if (Utils.compareStrIgnoreCases(config[0], CONFIG_ENV_INFRA_NAME)) {
        SCRUB_INFRA_ID = config[1];
      }  else if (Utils.compareStrIgnoreCases(config[0], CONFIG_ENV_PLATFORM_NAME)) {
        SCRUB_PLATFORM_ID = config[1];
      }  else if (Utils.compareStrIgnoreCases(config[0], CONFIG_ENV_NETWORKING_NAME)) {
        SCRUB_NETWORKING_ID = config[1];
      }  else if (Utils.compareStrIgnoreCases(config[0], CONIFG_REPORT_HOUR_NAME)) {
        REPORT_HOUR = config[1];
      } else {
        Logger.log('unknow configuration ' + config[0] + " " + config[1]);
      }
    }
  );
}

loadSystemConfig_()




