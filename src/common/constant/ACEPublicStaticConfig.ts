import {AceConfiguration} from '../../acone/aceconfiguration'

export enum ACEConstantCallback {
  DefaultMessage = 'done',
  Failed = 'fail',
  Success = 'success',
}

export type DetailOfSDK = {
  statuses?: {
    configuration?: AceConfiguration
    controlTower?: ControlTowerOfSDK
  }
  internal?: {
    adeld?: string
    adid?: string
    vt?: objectForVT
    versions?: VersionWithPatch
  }
  result: string
  message?: string
}

export type VersionWithPatch = {
  version: string
  patch: string
}

export type objectForST = {
  getts: string

  insenginets: string

  referts: string

  startts: string
}

export type objectForVT = {
  vts: string
  visitCount: string

  buyTimeTS: string

  buyCount: string

  pcStamp: string
}

export type ControlTowerOfSDK = {
  isCompletePolicy: boolean
  isForceStop: boolean
  isInstallReferrerWaitDone?: boolean
  isSDKEnabled: boolean
}

export type NetworkResultToResponseToCaller = {
  config?: object
}

export type NetworkErrorToResponseToCaller = {
  message?: string
  name?: string
  config?: object
}

export type ACEResponseToCaller = {
  taskHash: string
  code: number
  result: string
  message: string
  apiName?: string
  reseponse?: object
  controlTower?: ControlTowerOfSDK
}

export enum ACEResultCode {
  Default = 0,

  // positive
  Success = 200,

  // negative
  AlreadyInitialized = 1000,
  ExecutorNotInitAtPolicy = 1001,
  ExecutorWasShutdownedAtPolicy = 1002,
  ExecutorWasTerminatedAtPolicy = 1003,
  OccurredExceptionAtPolicy = 1004,
  FailAfterRequest = 1005,
  DoNotImplement_to_IACEParameterUtil = 1006,
  DoNotFindMethod = 1007,
  DoNotGetSDKVersion = 1008,
  NeedToCheckService = 1009,
  NeedToCheckAceConfiguration = 1010,
  DoNotImplement_to_IACECommonAPI = 1011,
  DisableSDKOrDoNotImplementAPI = 1012,
  GetQueueManagerFactoryIsNull = 1013,
  DoNotFindKeyword = 1014,
  ParamsIsNull = 1015,
  ProductParamIsNull = 1016,
  FailLogObjectIsNull = 1017,
  NotContainParamsKey = 1018,
  NotConnectToTheInternet = 1019,
  URLParamIsNull = 1020,
  ResponseParamIsNull = 1021,
  FailResponseHeaderToMapType = 1022,
  NeitherDeeplinkAndPush = 1023,
  NotSupportPromise = 1024,
  CanNotRequestToPolicy = 1025,
  FailLoadVT = 1026,
  DoNotInitialized = 1027,
  NotReceivePolicy = 1028,
  UnknownConnectStateToTheInternet = 1029,
  DisabledByPolicy = 1030,
  NotFoundPolicyInformation = 1031,
  NotExistWaitTask = 1032,
  TooBusyWillSendAfterDone = 1033,
  InvalidACParamValues = 1034,
}

export enum ACEGender {
  Unknown = '',
  Man = 'man',
  Woman = 'woman',
}

export enum ACEMaritalStatus {
  Unknown = '',
  Married = 'married',
  Single = 'single',
}
