export interface IJwt {
  secret: string;
  exp: string;
  refSecret: string;
  refExp: string;
}
