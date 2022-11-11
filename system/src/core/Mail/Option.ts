// Mail option
export type MailOption = {
  /**
   * Mail connection config
   */
  connection: {
    from?: { address: string };
    host?: string;
    username?: string;
    password?: string;
    port?: number;
    // encryption?: string;
    secure?: boolean;
  };
};
