import {isEmpty, encode} from '../common/util/TextUtils'
import ACEofAPIForOne from './constant/ACEofAPIForOne'

export default class ACProduct {
  constructor(
    private name: string,
    private category: string,
    private price: string,
    private quantify: number,
    private productId?: string,
    private optionCodeName?: string,
  ) {}

  //#region getter
  private getName(): string {
    if (isEmpty(this.name)) {
      this.name = ''
    }

    return this.name
  }
  private getCategory(): string {
    if (isEmpty(this.category)) {
      this.category = ''
    }

    return this.category
  }
  private getPrice(): string {
    if (isEmpty(this.price)) {
      this.price = ''
    }

    return this.price
  }
  private getQuantify(): number {
    return this.quantify
  }
  private getProductId(): string {
    if (isEmpty(this.productId)) {
      this.productId = ''
    }

    return this.productId ?? ''
  }
  private getOptionCodeName(): string {
    if (isEmpty(this.optionCodeName)) {
      this.optionCodeName = ''
    }

    return this.optionCodeName ?? ''
  }
  //#endregion

  //#region getter for encode
  private encodedName(): string {
    return encode(this.getName())
  }
  private encodedCategory(): string {
    return encode(this.getCategory())
  }
  private encodedPrice(): string {
    return encode(this.getPrice())
  }
  private encodedProductId(): string {
    return encode(this.getProductId())
  }
  private encodedOptionCodeName(): string {
    return encode(this.getOptionCodeName())
  }
  //#endregion

  public toStringForOne(logSource: number): string {
    if (logSource === ACEofAPIForOne.BuyCancel || logSource === ACEofAPIForOne.BuyDone) {
      return `${this.encodedCategory()}@${this.encodedName()}@${this.encodedPrice()}@${this.getQuantify()}@${this.encodedProductId()}@${this.encodedOptionCodeName()}`
    } else {
      return `${this.encodedCategory()}@${this.encodedName()}@${this.encodedPrice()}@${this.getQuantify()}`
    }
  }
}
