import ACECONSTANT from '../constant/ACEConstant'
import {LogLevel} from '../constant/LogConstants'

export default class ACELog {
  private static _logLevel = LogLevel.INFO

  public static setProductionMode(): void {
    this.setLogLevel(LogLevel.INFO)
  }

  public static setAllLogLevel(): void {
    this.setLogLevel(LogLevel.VERBOSE)
  }

  public static setDevMode(): void {
    this.setLogLevel(LogLevel.DEBUG)
  }

  private static setLogLevel(logLevel: LogLevel): void {
    this._logLevel = logLevel
  }

  public static isLoggable(priority: LogLevel): boolean {
    return priority >= this._logLevel
  }

  public static isDevMode(): boolean {
    return LogLevel.INFO > this._logLevel
  }

  private static logLevelToIdentity(priority: LogLevel): string {
    switch (priority) {
      case LogLevel.ASSERT:
        return 'A'
      case LogLevel.ERROR:
        return 'E'
      case LogLevel.WARN:
        return 'W'
      case LogLevel.INFO:
        return 'I'
      case LogLevel.DEBUG:
        return 'D'
      case LogLevel.VERBOSE:
        return 'V'
    }
  }

  private static println(priority: LogLevel, tag: string, msg: string, info?: object, moreDebugMessage?: string): void {
    if (!this.isLoggable(priority)) {
      return
    }

    var _location: string
    if (priority >= this._logLevel) {
      _location = ' [' + tag + ']'
    } else {
      _location = '::'
    }

    if (ACELog.isLoggable(priority)) {
      if (info) {
        console.log(
          `${ACECONSTANT.OFFICIAL_LOG_TAG} [SDK] [${new Date().toJSON()}] [${ACELog.logLevelToIdentity(
            priority,
          )}]${_location}: ${msg}, debug: >>${moreDebugMessage ?? ACECONSTANT.EMPTY}<<, info: ${JSON.stringify(
            info,
            null,
            2,
          )}`,
        )
      } else {
        console.log(
          `${ACECONSTANT.OFFICIAL_LOG_TAG} [SDK] [${new Date().toJSON()}] [${ACELog.logLevelToIdentity(
            priority,
          )}]${_location}: ${msg}, debug: >>${moreDebugMessage ?? ACECONSTANT.EMPTY}<<`,
        )
      }
    } else {
      if (info) {
        console.log(
          `${ACECONSTANT.OFFICIAL_LOG_TAG} [SDK] [${new Date().toJSON()}] [${ACELog.logLevelToIdentity(
            priority,
          )}]${_location}: ${msg}, info: ${JSON.stringify(info, null, 2)}`,
        )
      } else {
        console.log(
          `${ACECONSTANT.OFFICIAL_LOG_TAG} [SDK] [${new Date().toJSON()}] [${ACELog.logLevelToIdentity(
            priority,
          )}]${_location}: ${msg}`,
        )
      }
    }
  }

  public static e(tag: string, msg: string): void
  public static e(tag: string, msg: string, debug: object, moreDebugMessage?: string): void
  public static e(tag: string, msg: string, debug?: object, moreDebugMessage?: string): void {
    ACELog.println(LogLevel.ERROR, tag, msg, debug, moreDebugMessage)
  }

  public static w(tag: string, msg: string): void
  public static w(tag: string, msg: string, debug: object, moreDebugMessage?: string): void
  public static w(tag: string, msg: string, debug?: object, moreDebugMessage?: string): void {
    ACELog.println(LogLevel.WARN, tag, msg, debug, moreDebugMessage)
  }

  public static d(tag: string, msg: string): void
  public static d(tag: string, msg: string, debug: object, moreDebugMessage?: string): void
  public static d(tag: string, msg: string, debug?: object, moreDebugMessage?: string): void {
    ACELog.println(LogLevel.DEBUG, tag, msg, debug, moreDebugMessage)
  }

  public static i(tag: string, msg: string): void
  public static i(tag: string, msg: string, info: object, moreDebugMessage?: string): void
  public static i(tag: string, msg: string, info?: object, moreDebugMessage?: string): void {
    ACELog.println(LogLevel.INFO, tag, msg, info, moreDebugMessage)
  }

  public static v(tag: string, msg: string): void
  public static v(tag: string, msg: string, info: object, moreDebugMessage?: string): void
  public static v(tag: string, msg: string, info?: object, moreDebugMessage?: string): void {
    ACELog.println(LogLevel.VERBOSE, tag, msg, info, moreDebugMessage)
  }
}
