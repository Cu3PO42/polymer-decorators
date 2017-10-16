import "reflect-metadata";
export declare class PolymerBase extends HTMLElement implements Element {
    $: any;
    $$: any;
    root: HTMLElement;
    shadyRoot: HTMLElement;
    style: CSSStyleDeclaration;
    customStyle: {
        [property: string]: string;
    };
    extends?: Object[];
    behaviors?: Object[];
    arrayDelete(path: string, item: string | any): any;
    async(callback: Function, waitTime?: number): any;
    attachedCallback(): void;
    attributeFollows(name: string, toElement: HTMLElement, fromElement: HTMLElement): void;
    cancelAsync(handle: number): void;
    cancelDebouncer(jobName: string): void;
    classFollows(name: string, toElement: HTMLElement, fromElement: HTMLElement): void;
    create(tag: string, props: Object): any;
    debounce(jobName: string, callback: Function, wait?: number): void;
    deserialize(value: string, type: any): any;
    distributeContent(): void;
    domHost(): void;
    elementMatches(selector: string, node: Element): any;
    fire(type: string, detail?: Object, options?: FireOptions): any;
    flushDebouncer(jobName: string): void;
    get(path: string | Array<string | number>): any;
    getContentChildNodes(slctr: string): any;
    getContentChildren(slctr: string): any;
    getNativePrototype(tag: string): any;
    getPropertyInfo(property: string): any;
    importHref(href: string, onload?: Function, onerror?: Function): any;
    instanceTemplate(template: any): any;
    isDebouncerActive(jobName: string): any;
    linkPaths(to: string, from: string): void;
    listen(node: Element, eventName: string, methodName: string): void;
    mixin(target: Object, source: Object): void;
    notifyPath(path: string, value: any, fromAbove?: any): void;
    pop(path: string): any;
    push(path: string, value: any): any;
    reflectPropertyToAttribute(name: string): void;
    resolveUrl(url: string): any;
    scopeSubtree(container: Element, shouldObserve: boolean): void;
    serialize(value: string): any;
    serializeValueToAttribute(value: any, attribute: string, node: Element): void;
    set(path: string, value: any, root?: Object): any;
    setScrollDirection(direction: string, node: HTMLElement): void;
    shift(path: string, value: any): any;
    splice(path: string, start: number, deleteCount: number, ...items: any[]): any;
    toggleAttribute(name: string, bool: boolean, node?: HTMLElement): void;
    toggleClass(name: string, bool: boolean, node?: HTMLElement): void;
    transform(transform: string, node?: HTMLElement): void;
    translate3d(x: any, y: any, z: any, node?: HTMLElement): void;
    unlinkPaths(path: string): void;
    unshift(path: string, value: any): any;
    updateStyles(): void;
}
export declare var PolymerElement: typeof PolymerBase;
export interface dom {
    (node: HTMLElement): HTMLElement;
    (node: PolymerBase): HTMLElement;
    flush(): any;
}
export interface FireOptions {
    node?: HTMLElement | PolymerBase;
    bubbles?: boolean;
    cancelable?: boolean;
}
export interface Element {
    properties?: Object;
    listeners?: Object;
    behaviors?: Object[];
    observers?: String[];
    factoryImpl?(...args: any[]): void;
    ready?(): void;
    created?(): void;
    attached?(): void;
    detached?(): void;
    attributeChanged?(attrName: string, oldVal: any, newVal: any): void;
    prototype?: Object;
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
export declare function component(name: string, extendsTag?: string, register?: boolean): ClassDecorator;
export declare function extend(tagName: string): ClassDecorator;
export declare function behavior(behavior: any): ClassDecorator;
export declare function property(args?: Property): PropertyDecorator;
export declare function property(target: Object, key: string | symbol): void;
export declare function observe(observedProps: string): (target: Element, observerFuncName: string) => void;
export declare function listen(eventName: string): (target: Element, propertyKey: string) => void;
export declare function computed(args?: Property): MethodDecorator;
export declare function computed(target: Element, computedFuncName: string): void;
