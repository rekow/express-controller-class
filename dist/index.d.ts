import 'reflect-metadata';
import express from 'express';
interface ControllerClass extends NewableFunction {
    route: string;
    new (...args: any[]): any;
}
export declare function get(path?: string): (target: ControllerClass['prototype'], propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function post(path?: string): (target: ControllerClass['prototype'], propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function put(path?: string): (target: ControllerClass['prototype'], propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function patch(path?: string): (target: ControllerClass['prototype'], propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function del(path?: string): (target: ControllerClass['prototype'], propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function controller(): <T extends ControllerClass>(constructor: T) => T;
export declare function initAppControllers(app: express.Application, controllers: ControllerClass[]): express.Application;
export {};
