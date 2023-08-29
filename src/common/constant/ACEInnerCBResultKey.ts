export type ACEInnerCBResult = {
  code: number
  result: string
}

export enum ACEInnerCBResultKey {
  // positive
  Success = 200,

  // negative
  AlreadyInitialized = 1000,
  ExecutorNotInitAtPolicy = 1001,
  ExecutorWasShutdownedAtPolicy = 1002,
  ExecutorWasTerminatedAtPolicy = 1003,
  OccurredExceptionAtPolicy = 1004,
  FailAfterRequest = 1005,
  FailGetVT = 5404,
  DoNotImplement_to_IACEParameterUtil = 1006,
  DoNotFindMethod = 1007,
  DoNotGetSDKVersion = 1008,
  NeedToCheckService = 1009,
  NeedToCheckAceConfiguration = 1010,
  NotSupportPromise = 1024,
  NotExistKey = 4404,
}
