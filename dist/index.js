"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.PolymerElement = (function () {
    function class_1() {
    }
    return class_1;
}());
function component(name, extendsTag, register) {
    if (register === undefined) {
        register = true;
    }
    return function (klass) {
        if (extendsTag === undefined) {
            extendsTag = klass.extends;
        }
        if (klass.extends !== undefined) {
            delete klass.extends;
        }
        if (klass.prototype.beforeRegister !== undefined) {
            var beforeRegister = klass.prototype.beforeRegister;
            klass.prototype.beforeRegister = function () {
                this.is = name;
                this.extends = extendsTag;
                beforeRegister.apply(this, arguments);
            };
        }
        else {
            klass.prototype.beforeRegister = function () {
                this.is = name;
                this.extends = extendsTag;
            };
        }
        var behaviors = klass.behaviors;
        if (behaviors !== undefined) {
            delete klass.behaviors;
            Object.defineProperty(klass.prototype, "behaviors", { get: function () {
                    return behaviors;
                } });
        }
        if (register) {
            customElements.define(name, klass);
        }
        return klass;
    };
}
exports.component = component;
function extend(tagName) {
    return function (klass) {
        klass.extends = tagName;
        return klass;
    };
}
exports.extend = extend;
function behavior(behavior) {
    return function (klass) {
        klass.behaviors = klass.behaviors || [];
        klass.behaviors.push(behavior);
    };
}
exports.behavior = behavior;
function property(first, second) {
    var args;
    var isGenerator = false;
    if (second === undefined) {
        args = first || {};
        isGenerator = true;
    }
    else {
        args = {};
    }
    function decorate(target, key) {
        if (Reflect.hasMetadata("design:type", target, key))
            args.type = Reflect.getMetadata("design:type", target, key);
        target.constructor.properties = target.constructor.properties || {};
        target.constructor.properties[key] = Object.assign(args, target.constructor.properties[key] || {});
    }
    ;
    if (isGenerator) {
        return decorate;
    }
    else {
        return decorate(first, second);
    }
}
exports.property = property;
function observe(observedProps) {
    if (observedProps.indexOf(",") > 0 || observedProps.indexOf(".") > 0) {
        return function (target, observerFuncName) {
            target.observers = target.observers || [];
            target.observers.push(observerFuncName + "(" + observedProps + ")");
        };
    }
    else {
        return function (target, observerName) {
            var c = target.constructor;
            c.properties = c.properties || {};
            c.properties[observedProps] = c.properties[observedProps] || {};
            c.properties[observedProps].observer = observerName;
        };
    }
}
exports.observe = observe;
function listen(eventName) {
    return function (target, propertyKey) {
        var c = target.constructor;
        c.listeners = c.listeners || {};
        c.listeners[eventName] = propertyKey;
    };
}
exports.listen = listen;
function computed(first, second) {
    var args;
    var isGenerator = false;
    if (second === undefined) {
        args = first;
        isGenerator = true;
    }
    function decorate(target, computedFuncName) {
        var c = target.constructor;
        c.properties = c.properties || {};
        args = args || {};
        if (Reflect.hasMetadata("design:returntype", target, computedFuncName))
            args.type = Reflect.getMetadata("design:returntype", target, computedFuncName);
        var getterName = "get_computed_" + computedFuncName;
        var funcText = target[computedFuncName].toString();
        var start = funcText.indexOf("(");
        var end = funcText.indexOf(")");
        var propertiesList = funcText.substring(start + 1, end);
        args["computed"] = getterName + "(" + propertiesList + ")";
        c.properties[computedFuncName] = args;
        target[getterName] = target[computedFuncName];
    }
    if (isGenerator) {
        return decorate;
    }
    else {
        return decorate(first, second);
    }
}
exports.computed = computed;
//# sourceMappingURL=index.js.map