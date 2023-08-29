export type ACEPlatform = 'ACONE'

export type IAceConfiguration = {
  init: (
    key: string,
    type?: ACEPlatform,
    debug?: boolean,
    enablePrivacyPolicy?: boolean,
    disableToCollectAdvertisingIdentifier?: boolean,
  ) => AceConfiguration
  PLATFORM: {
    DEFAULT: ACEPlatform
  }
  toJSONString(): string
}

export type AceConfiguration = {
  key: string
  platform?: ACEPlatform
  debug?: boolean
  enablePrivacyPolicy?: boolean
  disableToCollectAdvertisingIdentifier?: boolean
}

export const AceConfiguration: IAceConfiguration = {
  PLATFORM: {
    DEFAULT: 'ACONE',
  },
  init(
    key: string,
    platform = AceConfiguration.PLATFORM.DEFAULT,
    debug = true,
    enablePrivacyPolicy = false,
    disableToCollectAdvertisingIdentifier = false,
  ): AceConfiguration {
    return {platform, key, debug, enablePrivacyPolicy, disableToCollectAdvertisingIdentifier}
  },
  toJSONString(): string {
    return JSON.stringify(this)
  },
}
