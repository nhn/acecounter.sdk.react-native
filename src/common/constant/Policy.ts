enum POLICY {
  REQUEST_URL = 'https://policy.acecounter.com/policy',

  REQUEST_APPLICATION_ID = 'CP-Application-Id',
  REQUEST_CID = 'CP-Request-Cid',
  REQUEST_PLATFORM = 'CP-Request-Platform',
  REQUEST_SERVICE_ID = 'CP-Request-Id',
  REQUEST_TIME = 'CP-Request-Time',
  REQUEST_VERSION = 'CP-Request-Version',

  RESPONSE_APP_KEY_FOR_LNC = 'AppKeyForLNC',
  RESPONSE_APP_KEY_FOR_LNC_RECEIVED = 'received',
  RESPONSE_APP_KEY_FOR_LNC_DO_NOT_RECEIVED = "don't received",
  RESPONSE_APP_KEY_FOR_LNC_DO_NOT_EXIST = "don't existed",

  RESPONSE_APPLIST_ENABLE = 'Cp-App',
  RESPONSE_CID = 'Cp-Cid',
  RESPONSE_DEBUG = 'Cp-Debug',
  RESPONSE_DEBUG_LOG_URL = 'Cp-Crash-Domain',
  RESPONSE_DOMAIN = 'Cp-Domain',
  RESPONSE_FORCE_DELETE_FAILEDFILE = 'Cp-Force-Delete-FailedLogs',
  RESPONSE_FORCE_STOP = 'Cp-Force-Stop',
  RESPONSE_POLICY_INTERVAL = 'Cp-Repeat-Interval',
  RESPONSE_PRIVATE = 'Cp-Private',
  RESPONSE_SDK_ENABLE = 'Cp-Allow',
  RESPONSE_SOURCE_IP = 'Cp-Source-Ip',
  RESPONSE_TOAST_APPKEY = 'Cp-LNC-Id',

  FLAG_ACELOG_GATHERING = '1', // cpDebug
  FLAG_FORCE_DELETE_FAILEDFILE = '1',
  FLAG_SDK_ENABLE = '*',
  FLAG_SDK_FORCE_STOP = '1',
}

export default POLICY
