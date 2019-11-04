export interface ConfigurationModel {
  appEmailName: string;
  appEmailUser: string;
  appEmailPassword: string;
  appSMTPAddress: string;
  appSMTPPort: number;
  appSMTPSecure: boolean;
  appEmailFrom: string;
  appEmailSubject: string;
  appEmailText: string;
  appEmailHtml: string;
  appServerHost: string;
  appServerPort: number;
  appCronPattern: string;
  appCronTimezone: string;
}
