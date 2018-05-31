import "reflect-metadata";

export declare class PolymerBase extends HTMLElement implements Element {
   $: any;
   $$: any;

   root:HTMLElement;
   shadyRoot:HTMLElement;
   style:CSSStyleDeclaration;
   customStyle:{[property:string]:string;};
   extends?:Object[];
   behaviors?:Object[];

   arrayDelete(path: string, item: string|any):any;
   async(callback: Function, waitTime?: number):any;
   attachedCallback():void;
   attributeFollows(name: string, toElement: HTMLElement, fromElement: HTMLElement):void;
   cancelAsync(handle: number):void;
   cancelDebouncer(jobName: string):void;
   classFollows(name: string, toElement: HTMLElement, fromElement: HTMLElement):void;
   create(tag: string, props: Object):any;
   debounce(jobName: string, callback: Function, wait?: number):void;
   deserialize(value: string, type: any):any;
   distributeContent():void;
   domHost():void;
   elementMatches(selector: string, node: Element):any;
   fire(type: string, detail?: Object, options?: FireOptions):any;
   flushDebouncer(jobName: string):void;
   get(path: string|Array<string|number>):any;
   getContentChildNodes(slctr: string):any;
   getContentChildren(slctr: string):any;
   getNativePrototype(tag: string):any;
   getPropertyInfo(property: string):any;
   importHref(href: string, onload?: Function, onerror?: Function):any;
   instanceTemplate(template: any):any;
   isDebouncerActive(jobName: string):any;
   linkPaths(to: string, from: string):void;
   listen(node: Element, eventName: string, methodName: string):void;
   mixin(target: Object, source: Object):void;
   notifyPath(path: string, value: any, fromAbove?: any):void;
   pop(path: string):any;
   push(path: string, value: any):any;
   reflectPropertyToAttribute(name: string):void;
   resolveUrl(url: string):any;
   scopeSubtree(container: Element, shouldObserve: boolean):void;
   serialize(value: string):any;
   serializeValueToAttribute(value: any, attribute: string, node: Element):void;
   set(path: string, value: any, root?: Object):any;
   setScrollDirection(direction: string, node: HTMLElement):void;
   shift(path: string, value: any):any;
   splice(path: string, start: number, deleteCount: number, ...items: any[]):any;
   toggleAttribute(name: string, bool: boolean, node?: HTMLElement):void;
   toggleClass(name: string, bool: boolean, node?: HTMLElement):void;
   transform(transform: string, node?: HTMLElement):void;
   translate3d(x: string, y: string, z: string, node?: HTMLElement):void;
   unlinkPaths(path: string):void;
   unshift(path: string, value: any):any;
   updateStyles(): void;
}

export var PolymerElement: typeof PolymerBase = <any>class {};

export interface dom
{
  (node: HTMLElement): HTMLElement;
  (node: PolymerBase): HTMLElement;
  flush(): any;
}

// options for the fire method
export interface FireOptions
{
  node?: HTMLElement|PolymerBase;
  bubbles?: boolean;
  cancelable?: boolean;
}

// members that can be optionally implemented in an element
export interface Element {
  properties?: {[key:string]: Property};
    listeners?: {[key: string]: any};
  behaviors?: Object[];
  observers?: String[];

  // lifecycle
  factoryImpl?(...args: any[]): void;
  ready?(): void;
  created?(): void;
  attached?(): void;
  detached?(): void;
  attributeChanged?(attrName: string, oldVal: any, newVal: any): void;

  //
  prototype?: Object;
  [key: string]: any;
}

export interface Property {
  name?: string;
  type?: any;
  value?: any;
  reflectToAttribute?: boolean;
  readOnly?: boolean;
  notify?: boolean;
  computed?: string;
  observer?: string;
}

// Polymer object
declare var Polymer: {
   (prototype: Element): FunctionConstructor;
   Class(prototype: Element): Function;
   dom: dom;
   appendChild(node: HTMLElement): HTMLElement;
   insertBefore(node: HTMLElement, beforeNode: HTMLElement): HTMLElement;
   removeChild(node: HTMLElement): HTMLElement;
   updateStyles(): void;

   Base: any;
}

export function component(name: string, extendsTag?: string, register?: boolean): ClassDecorator {
    if (register === undefined) {
        register = true;
    }

    return function (klass) {
        if (extendsTag === undefined) {
            extendsTag = (klass as any).extends;
        }
        if ((klass as any).extends !== undefined) {
            delete (klass as any).extends;
        }
        if (klass.prototype.beforeRegister !== undefined) {
            var beforeRegister = klass.prototype.beforeRegister;
            klass.prototype.beforeRegister = function() {
                this.is = name;
                this.extends = extendsTag;
                beforeRegister.apply(this, arguments);
            }
        } else {
            klass.prototype.beforeRegister = function() {
                this.is = name;
                this.extends = extendsTag;
            }
        }
        var behaviors = (klass as any).behaviors;
        if (behaviors !== undefined) {
            delete (klass as any).behaviors;
            Object.defineProperty(klass.prototype, "behaviors", { get: function() {
                return behaviors;
            } });

        }
        if (register) {
            customElements.define(name, klass);
        }
        return klass;
    }
}

export function extend(tagName: string): ClassDecorator {
    return function(klass) {
        (klass as any).extends = tagName;
        return klass;
    }
}

export function behavior(behavior: string): ClassDecorator {
    return (klass) => {
        (klass as any).behaviors = (klass as any).behaviors || [];
        (klass as any).behaviors.push(behavior);
    }
}

export function property(args?: Property): PropertyDecorator;
export function property(target: Object, key: string | symbol): void;
export function property(first?: any, second?: any): any {
    var args: {[key: string]: any};
    var isGenerator = false;

    if (second === undefined) {
        args = first || {};
        isGenerator = true;
    } else {
        args = {};
    }

    function decorate(target: any, key: string): void {
        if (Reflect.hasMetadata("design:type", target, key))
            args.type = Reflect.getMetadata("design:type", target,key);
        target.constructor.properties = target.constructor.properties || {};
        target.constructor.properties[key] = (Object as any).assign(args, target.constructor.properties[key] || {});
    };

    if (isGenerator) {
        return decorate;
    } else {
        return decorate(first, second);
    }
}

export function observe(observedProps: string) {
   if (observedProps.indexOf(",") > 0 || observedProps.indexOf(".") > 0) {
      // observing multiple properties or path
      return (target: Element, observerFuncName: string) => {
         target.observers = target.observers || [];
         target.observers.push(observerFuncName + "(" + observedProps + ")");
      }
   }
   else {
      // observing single property
      return (target: Element, observerName: string) => {
         const c = target.constructor as Element;
         c.properties = c.properties || {};
         c.properties[observedProps] = c.properties[observedProps] || {};
         c.properties[observedProps].observer = observerName;
      }
   }
}

export function listen(eventName: string) {
    return (target: Element, propertyKey: string) => {
        const c = target.constructor as Element;
        c.listeners = c.listeners || {};
        c.listeners[eventName] = propertyKey;
    }
}

export function computed(args?: Property): MethodDecorator;
export function computed(target: Element, computedFuncName: string): void;
export function computed(first?: any, second?: any): any {
    var args: {[key: string]: any};

    var isGenerator = false;

    if (second === undefined) {
        args = first;
        isGenerator = true;
    }

    function decorate(target: Element, computedFuncName: string) {
        const c = target.constructor as Element
        c.properties = c.properties || {};
        args = args || {};
        if (Reflect.hasMetadata("design:returntype", target, computedFuncName))
            args.type = Reflect.getMetadata("design:returntype", target, computedFuncName);
        var getterName = "get_computed_" + computedFuncName;
        var funcText: string = target[computedFuncName].toString();
        var start = funcText.indexOf("(");
        var end = funcText.indexOf(")");
        var propertiesList = funcText.substring(start+1,end);
        args["computed"] = getterName + "(" + propertiesList + ")";
        c.properties[computedFuncName] = args;
        target[getterName] = target[computedFuncName];
   }

   if (isGenerator) {
       return decorate;
   } else {
       return decorate(first as Element, second);
   }
}
