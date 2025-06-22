import { AppDispatch } from "@/lib/store/store";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import * as crypto from "crypto";
import { ZodError } from "zod";

import { redirect } from "next/navigation";
import {
  invokeMakeBackendRequest,
  invokeTransferWithJSON,
} from "./misc.server";

export class PWBError {
  code: number;
  message: string;
  pwbErrorTest: boolean = true;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}

export function unauthorized(): PWBError {
  return new PWBError(401, "Unauthorized!");
}

export function forbidden(): PWBError {
  return new PWBError(403, "Forbidden!");
}

export function badData(reason?: string) {
  return new PWBError(400, `Bad data!${reason ? " - " + reason : ""}`);
}

export function internalServerError() {
  return new PWBError(500, "Internal server error!");
}

export function badDataFromZodError(error: ZodError) {
  return badData(error.issues.map((issue) => issue.message).join(", "));
}

export function throwParsedZodError(error: ZodError, dispatch?: AppDispatch) {
  const poliError = badDataFromZodError(error);
  const message = `PWB_ERROR;${poliError.code};${poliError.message}`;
  if (dispatch) dispatch(addSnackbar({ message: message, type: "error" }));
  throw new Error(message);
}

export async function makeBackendRequest<RetType>(
  endpoint: string,
  method: "GET" | "POST" | "DEL" | "PUT" | "PATCH",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestData?: any,
  dispatch?: AppDispatch
) {
  const { ok, status, data } = await invokeMakeBackendRequest(
    endpoint,
    method,
    method !== "GET" ? JSON.stringify(requestData) : undefined
  );

  if (ok) {
    return data as RetType;
  } else {
    const message = `PWB_ERROR;${status};${JSON.stringify(data)}`;
    if (dispatch) dispatch(addSnackbar({ message: message, type: "error" }));
    redirect(`/error?message=${encodeURIComponent(message)}`);
    // throw new Error(message);
  }
}

export async function makeRequest<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Func extends (...args: any[]) => Promise<any>
>(
  func: Func,
  args: Parameters<Func>,
  dispatch?: AppDispatch
): Promise<Exclude<Awaited<ReturnType<Func>>, PWBError>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (await transferWithJSON(func, args)) as any;
  if (result && result.pwbErrorTest) {
    const error = `PWB_ERROR;${result.code};${result.message}`;
    if (dispatch) dispatch(addSnackbar({ message: error, type: "error" }));
    throw new Error(error);
  }
  return result;
}

export async function transferWithJSON<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Func extends (...args: any[]) => Promise<any>
>(func: Func, args: Parameters<Func>) {
  return JSON.parse(
    await invokeTransferWithJSON(func, JSON.stringify(args))
  ) as ReturnType<Func>;
}

const config = {
  iterations: 10000,
  saltBytes: 32,
  hashBytes: 64,
  digest: "sha512",
};

export function hashPassword(password: string) {
  return new Promise((resolve: (value: Buffer) => void, reject) => {
    // generate a salt for pbkdf2
    crypto.randomBytes(config.saltBytes, (err, salt) => {
      if (err) {
        return reject(err);
      }

      // hash password
      crypto.pbkdf2(
        password,
        salt,
        config.iterations,
        config.hashBytes,
        config.digest,
        (err, hash) => {
          if (err) {
            return reject(err);
          }

          const combined = Buffer.alloc(hash.length + salt.length + 8);
          combined.writeUInt32BE(salt.length, 0);
          combined.writeUInt32BE(config.iterations, 4);
          salt.copy(combined, 8);
          hash.copy(combined, salt.length + 8);
          resolve(combined);
        }
      );
    });
  });
}

export function verifyPassword(password: string, combined: Buffer) {
  return new Promise((resolve: (value: boolean) => void) => {
    // extract the salt and hash from the combined buffer
    const saltBytes = combined.readUInt32BE(0);
    const hashBytes = combined.length - saltBytes - 8;
    const iterations = combined.readUInt32BE(4);
    const salt = combined.subarray(8, saltBytes + 8);
    const hash = combined.toString("binary", saltBytes + 8);

    // verify the salt and hash against the password
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      hashBytes,
      config.digest,
      (err, verify) => {
        if (err) {
          return resolve(false);
        }
        resolve(verify.toString("binary") === hash);
      }
    );
  });
}

const weekdays = [
  "Niedziela",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
];

export function getWeekdayArray() {
  const currentDate = new Date();
  const weekday = currentDate.getDay();
  const arr = [];
  for (let i = weekday + 6; i >= weekday; i--) {
    arr.push(weekdays[i % 7]);
  }
  return arr;
}

export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions[],
  separator: string
) {
  function format(option: Intl.DateTimeFormatOptions) {
    const formatter = new Intl.DateTimeFormat("en", option);
    return formatter.format(date);
  }
  return options.map(format).join(separator);
}
