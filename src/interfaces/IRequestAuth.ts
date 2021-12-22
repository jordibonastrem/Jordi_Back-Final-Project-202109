import { Request } from "express";

interface IRequestAuth extends Request {
  params: any;
  userId?: string;
  userName?: string;
  file?: any;
  headers: any;
}

export default IRequestAuth;
