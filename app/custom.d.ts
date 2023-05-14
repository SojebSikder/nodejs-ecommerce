declare namespace Express {
  export interface Response {
    /**
     * Redirect to back
     */
    back?: (data=null) => void;
  }
}
