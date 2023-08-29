import APIForPL from './APIForPL'
import {ITaskParams} from '../../common/task/ITaskParams'
import {AxiosResponse} from 'axios'
import {ACEResponseToCaller} from '../../common/constant/ACEPublicStaticConfig'
import ACELog from '../../common/logger/ACELog'
import ACProduct from '../acproduct'
import ACECONSTANT from '../../common/constant/ACEConstant'
import ACEParameterUtilForOne from './ACEParameterUtilForOne'
import IACBuyMode from '../constant/IACBuyMode'
import {acproductToURLForOne} from '../../common/util/ACProductUtil'
import {stringToNumber} from '../../common/util/TextUtils'
import ACEofAPIForOne from '../constant/ACEofAPIForOne'

export default class APIForBuy extends APIForPL {
  private static _TAG = 'APIForBuy'

  private memberKey: string
  private orderNumber: string
  private paymentMethod: string
  private products: ACProduct[]
  public constructor(params: ITaskParams) {
    ACELog.d(APIForBuy._TAG, 'in constructor')
    super(params)
    this.memberKey = params.payload.memberKey ?? ACECONSTANT.EMPTY
    this.orderNumber = params.payload.orderNumber ?? ACECONSTANT.EMPTY
    this.paymentMethod = params.payload.paymentMethod ?? ACECONSTANT.EMPTY
    this.products = Array.from(params.payload.products ?? [])
  }

  public doWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doWork((error?: object, innerResult?: ACEResponseToCaller) => {
      ACELog.d(APIForBuy._TAG, 'in doWork::in cb')
      if (error && callback) {
        callback(error, innerResult)
      } else if (callback) {
        const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
        _parameterUtilForOne.setMemberKey(this.memberKey)
        _parameterUtilForOne.setOrderNumber(this.orderNumber)
        _parameterUtilForOne.setPaymentMethod(this.paymentMethod)
        _parameterUtilForOne.setProduct(acproductToURLForOne(this.products, this.getLogSource()))

        switch (this._logSource) {
          case ACEofAPIForOne.BuyDone: {
            _parameterUtilForOne.setBuyMode(IACBuyMode.Order)
            break
          }
          case ACEofAPIForOne.BuyCancel: {
            _parameterUtilForOne.setBuyMode(IACBuyMode.Cancel)
            break
          }
        }

        //#region BuyTimeTS
        const _st = _parameterUtilForOne.getST()
        _parameterUtilForOne.setBuyTimeTSAtObject(this.assignWillUpdateVt(), _st.getGetTS(), _st.getRandom6ForGetTS())
        //#endregion
        //#region BuyCount
        const _buyCount = stringToNumber(_parameterUtilForOne.getVT().getBuyCount(), 10)
        _parameterUtilForOne.setBuyCountAtObject(this.assignWillUpdateVt(), _buyCount + 1)
        //#endregion
        callback(undefined, innerResult)
      }
    })
  }

  public didWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined): void {
    super.didWork(callback)
    ACELog.d(APIForBuy._TAG, 'didWork')
  }

  public completed(response: AxiosResponse) {
    super.completed(response)
    ACELog.d(APIForBuy._TAG, 'completed')
  }

  public failed(err: any) {
    super.failed(err)
    ACELog.d(APIForBuy._TAG, 'failed')
  }

  public doneWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doneWork(callback)
    ACELog.d(APIForBuy._TAG, 'doneWork')
    const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
    //#region clear
    _parameterUtilForOne.clearBuyMode()
    _parameterUtilForOne.clearMemberKey()
    _parameterUtilForOne.clearPayMethod()
    _parameterUtilForOne.clearOrderNumber()
    _parameterUtilForOne.clearProduct()
    //#endregion
  }
}
