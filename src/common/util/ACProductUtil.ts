import ACProduct from '../../acone/acproduct'

export function acproductToURLForOne(products: ACProduct[], logSoruce: number): string {
  if (products.length < 1) {
    return ''
  } else {
    return `${products.map(product => product.toStringForOne(logSoruce)).join('^')}^`
  }
}
