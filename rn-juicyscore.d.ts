declare module 'rn-juicy-score' {
  type Config = {
    debug: boolean;
    collectGeoInfo: boolean;
    scanPorts: boolean;
    collectMacAddress: boolean;
  };

  interface IRNJuicyScoreSDK {
    create(config: Config): Promise<void>;
    getToken(): Promise<string>;
    getJuicyScoreVersion(): Promise<string>;
  }

  const RNJuicyScoreSDK: IRNJuicyScoreSDK;

  export {
    RNJuicyScoreSDK
  };
}
