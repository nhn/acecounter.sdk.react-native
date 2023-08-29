import ACENetworkResult from '../http/ACENetworkResult'
import {HttpURLConnection} from '../constant/Network'
import POLICY from '../constant/Policy'
import ACEPolicyParameters from './ACEPolicyParameters'
import {isEmpty} from '../util/TextUtils'
import ControlTowerSingleton from '../controltower/ControlTowerSingleton'
import ACEConstantInteger from '../constant/ACEConstantInteger'
import ACELog from '../logger/ACELog'

export default class ACEPolicyParameterUtil {
  private static _TAG = 'paramUtilForPolicy'
  private static instance: ACEPolicyParameterUtil
  private static readonly REPEAT_PULLING_INTERVAL_SECOND_DEFAULT = 6 * 60 * 60
  private static REPEAT_PULLING_INTERVAL_SECOND: number

  public static getInstance(): ACEPolicyParameterUtil {
    return this.instance || (this.instance = new this())
  }

  private constructor() {
    ACEPolicyParameterUtil.REPEAT_PULLING_INTERVAL_SECOND =
      ACEPolicyParameterUtil.REPEAT_PULLING_INTERVAL_SECOND_DEFAULT
  }

  public savePolicy(result: ACENetworkResult): void {
    if (result.getCode() !== HttpURLConnection.HTTP_OK) {
      ACELog.d(ACEPolicyParameterUtil._TAG, `http response code not ok: ${result.getCode()}`)
      return
    }

    ACELog.d(ACEPolicyParameterUtil._TAG, 'Receive policy.')
    // ACELog.d(ACEPolicyParameterUtil._TAG, `ACEPolicyParameterUtil::savePolicy::_response: ${JSON.stringify(result)}`)

    const _policyParameters = ACEPolicyParameters.getInstance()
    const responseHeaders = result.getHeaders()

    const _sdk_enable = responseHeaders[POLICY.RESPONSE_SDK_ENABLE.toLowerCase()]
    if (_sdk_enable) {
      // ACELog.d(ACEPolicyParameterUtil._TAG, `1. in if key: ${POLICY.RESPONSE_SDK_ENABLE}, value: ${_sdk_enable}`)
      _policyParameters.setCpAllow(_sdk_enable)
      if (!ControlTowerSingleton.getInstance().isEnableByPolicy()) {
        ACELog.d(ACEPolicyParameterUtil._TAG, 'disabled by policy.')
        ControlTowerSingleton.getInstance().setSDKDisable()
      }
    }

    const _cid = responseHeaders[POLICY.RESPONSE_CID.toLowerCase()]
    if (_cid) {
      // ACELog.d(ACEPolicyParameterUtil._TAG, `2. in if key: ${POLICY.RESPONSE_CID}, value: ${_cid}`)
      _policyParameters.setCpCid(_cid)
    }

    const _debug = responseHeaders[POLICY.RESPONSE_DEBUG.toLowerCase()]
    if (_debug) {
      // ACELog.d(ACEPolicyParameterUtil._TAG, `3. in if key: ${POLICY.RESPONSE_DEBUG}, value: ${_debug}`)
      _policyParameters.setCpDebug(_debug)
    }

    const _domain = responseHeaders[POLICY.RESPONSE_DOMAIN.toLowerCase()]
    if (_domain) {
      // ACELog.d(ACEPolicyParameterUtil._TAG, `4. in if key: ${POLICY.RESPONSE_DOMAIN}, value: ${_domain}`)
      _policyParameters.setCpDomain(_domain)
    }

    const _private = responseHeaders[POLICY.RESPONSE_PRIVATE.toLowerCase()]
    if (_private) {
      // ACELog.d(ACEPolicyParameterUtil._TAG, `5. in if key: ${POLICY.RESPONSE_PRIVATE}, value: ${_private}`)
      _policyParameters.setCpPrivate(_private)
    }

    const _source_ip = responseHeaders[POLICY.RESPONSE_SOURCE_IP.toLowerCase()]
    if (_source_ip) {
      // ACELog.d(ACEPolicyParameterUtil._TAG, `6. in if key: ${POLICY.RESPONSE_SOURCE_IP}, value: ${_source_ip}`)
      _policyParameters.setCpSourceIP(_source_ip)
    }

    const _force_stop = responseHeaders[POLICY.RESPONSE_FORCE_STOP.toLowerCase()]
    if (_force_stop) {
      // ACELog.d(ACEPolicyParameterUtil._TAG, `7. in if key: ${POLICY.RESPONSE_FORCE_STOP}, value: ${_force_stop}`)
      const _value = responseHeaders[POLICY.RESPONSE_SOURCE_IP.toLowerCase()]
      if (!isEmpty(_value) && _value === POLICY.FLAG_SDK_FORCE_STOP) {
        ACELog.d(ACEPolicyParameterUtil._TAG, 'force stop enabled.')
        ControlTowerSingleton.getInstance().enableForceStop()
      }
    }

    const _force_delete_failedfile = responseHeaders[POLICY.RESPONSE_FORCE_DELETE_FAILEDFILE.toLowerCase()]
    if (_force_delete_failedfile) {
      // ACELog.d(
      //   ACEPolicyParameterUtil._TAG,
      //   `8. in if key: ${POLICY.RESPONSE_FORCE_DELETE_FAILEDFILE}, value: ${_force_delete_failedfile}`,
      // )
      if (!isEmpty(_force_delete_failedfile) && _force_delete_failedfile === POLICY.FLAG_FORCE_DELETE_FAILEDFILE) {
        ACELog.d(ACEPolicyParameterUtil._TAG, `${POLICY.RESPONSE_FORCE_DELETE_FAILEDFILE} enabled.`)
      }
    }

    const _debug_log_url = responseHeaders[POLICY.RESPONSE_DEBUG_LOG_URL.toLowerCase()]
    if (_debug_log_url) {
      // ACELog.d(ACEPolicyParameterUtil._TAG, `9. in if key: ${POLICY.RESPONSE_DEBUG_LOG_URL}, value: ${_debug_log_url}`)
      _policyParameters.setCpCrashDomain(_debug_log_url)
    }

    const _policy_interval = responseHeaders[POLICY.RESPONSE_POLICY_INTERVAL.toLowerCase()]
    if (_policy_interval) {
      // ACELog.d(
      //   ACEPolicyParameterUtil._TAG,
      //   `10. in if key: ${POLICY.RESPONSE_POLICY_INTERVAL}, value: ${_policy_interval}`,
      // )
      var interval = ACEPolicyParameterUtil.REPEAT_PULLING_INTERVAL_SECOND
      const _value = _policy_interval
      if (_value && !isEmpty(_value)) {
        interval = parseInt(_value, 10)
        if (interval < ACEConstantInteger.TWO_MINUTES) {
          interval = ACEConstantInteger.TWO_MINUTES
        }
        ACEPolicyParameterUtil.REPEAT_PULLING_INTERVAL_SECOND = interval
      }
    }

    const _toast_appkey = responseHeaders[POLICY.RESPONSE_TOAST_APPKEY.toLowerCase()]
    if (_toast_appkey) {
      // ACELog.d(ACEPolicyParameterUtil._TAG, `11. in if key: ${POLICY.RESPONSE_TOAST_APPKEY}, value: ${_toast_appkey}`)
      _policyParameters.setToastAppKey(_toast_appkey)
    }

    ACELog.d(ACEPolicyParameterUtil._TAG, 'done save policy.', _policyParameters)
  }
}
