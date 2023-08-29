export enum BASE_URL {
  COMPANY_LOCAL_LOG = 'http://192.168.0.18:52274',
  COMPANY_LOCAL_POLICY = 'http://192.168.0.18:52274',
  // HOME_LOCAL_LOG = 'http://192.168.0.18:52274',
  HOME_LOCAL_LOG = 'https://gmb.acecounter.com',
  HOME_LOCAL_POLICY = 'http://192.168.0.18:52274',
  PRO_POLICY = 'https://policy.acecounter.com',
}

export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
}

export enum HTTP_URL {
  COMPANY_LOCAL_LOG = 'log',
  COMPANY_LOCAL_POLICY = 'policy',
  HOME_LOCAL_LOG = 'mac',
  HOME_LOCAL_POLICY = 'policy',
  PRO_LOG = '',
  PRO_POLICY = 'policy',
}

export type ACENetworkParams = {
  baseUrl: string
  requestHeaders: Map<string, string>
  url: string
  params: object
}

export enum HttpURLConnection {
  HTTP_OK = 200,
}
