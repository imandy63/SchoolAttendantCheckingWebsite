export type ClassType<T = any> = new (...args: any[]) => T;
export type StringObj = { [key: string]: string };
export type StringNumObj = { [key: string]: string | number };
export type Obj = { [key: string]: any };
