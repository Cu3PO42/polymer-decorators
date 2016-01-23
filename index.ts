import "reflect-metadata";

declare class PolymerBase extends HTMLElement implements Element {
   $: any;
   $$: any;

   root:HTMLElement;
   shadyRoot:HTMLElement;
   style:CSSStyleDeclaration;
   customStyle:{[property:string]:string;};

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
   splice(path: string, start: number, deleteCount: number, ...items):any;
   toggleAttribute(name: string, bool: boolean, node?: HTMLElement):void;
   toggleClass(name: string, bool: boolean, node?: HTMLElement):void;
   transform(transform: string, node?: HTMLElement):void;
   translate3d(x, y, z, node?: HTMLElement):void;
   unlinkPaths(path: string):void;
   unshift(path: string, value: any):any;
   updateStyles(): void;
}

export var PolymerElement: typeof PolymerBase = <any>class {};

interface dom
{
  (node: HTMLElement): HTMLElement;
  (node: PolymerBase): HTMLElement;
  flush();
}

// options for the fire method
interface FireOptions
{
  node?: HTMLElement|PolymerBase;
  bubbles?: boolean;
  cancelable?: boolean;
}

// members that can be optionally implemented in an element
interface Element {
  properties?: Object;
  listeners?: Object;
  behaviors?: Object[];
  observers?: String[];

  // lifecycle
  factoryImpl?(...args): void;
  ready?(): void;
  created?(): void;
  attached?(): void;
  detached?(): void;
  attributeChanged?(attrName: string, oldVal: any, newVal: any): void;

  //
  prototype?: Object;
}

interface Property {
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

function extend(dest, src) {
    for (let prop of src) {
        if (src.hasOwnProperty(prop)) {
            dest[prop] = src[prop];
        }
    }
    return dest;
}

export function component(name: string, extendsTag?: string): ClassDecorator {
    return (klass) => {
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
        return klass;
    }
}

export function property(args: Property): PropertyDecorator {
    return (target, key: string) => {
        args = args || {};
        if (Reflect.hasMetadata("design:type", target, key))
            args.type = Reflect.getMetadata("design:type", target,key);
        target.properties = target.properties || {};
        target.properties[key] = extend(args, target.properties[key]);
    };
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
         target.properties = target.properties || {};
         target.properties[observedProps] = target.properties[observedProps] || {};
         target.properties[observedProps].observer = observerName;
      }
   }
}

export function listen(eventName: string) {
	return (target: Element, propertyKey: string) => {
		target.listeners = target.listeners || {};
		target.listeners[eventName] = propertyKey;
	}
}
