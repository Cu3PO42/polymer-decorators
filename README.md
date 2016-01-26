# Polymer Decorators

Another way to write Polymer Elements in TypeScript.

## Justification

I know that there is the great [PolymerTS](https://github.com/nippur72/PolymerTS) that has served me well for quite some time, however when I started compiling to ES6 instead of ES5, it didn't work anymore - and I didn't know why. I thought that surely reimplementing it would be a good idea. And so I got to it, while adding the last feature I wanted, however, I suddenly found out why it broke. Overloading the constructor to `factoryImpl` doesn't seem possible when using ES6, oh well. However I was already mostly done, and I'd like to think some thing are better, so I decided to continue.

## Credits

It may be a bit unconventional to do the credits at the beginning, but I really wanted to thank nippur72 for the PolymerTS project for the idea, the type definitions I used and some of the decorator code.

## Usage

1. Import the decorators as needed. (Bundle with Browserify or Webpack).
2. Define your class.
3. Extend `PolymerElement` if you are using TypeScript. This will not provide any actual functionality, but provide type information about properties and methods provided by Polymer.
4. Use any decorators as required.

Please enable the compiler option emitDecoratorMetadata to enable type inference for properties if using TypeScript.

### `@component(name, extends, autoRegister)`

Declares a class a component. It can take up to three parameters, the first being the name of the component and the second being the element it extends, and a toggle to disable auto-registering the element. All but the first are are **optional**. If the second parameter isn't present, the component will not inherit any other component. The third parameter defaults to `true` and will disable auto-registering the element with Polymer if set to `false`. If you don't specify any option, you can use `component` as a decorator directly and not as a factory.

```javascript
@component("my-element")
class MyElement extends PolymerElement {
     /* ... */
}

@component("my-link", "a")
class MyLink extends PolymerElement {
     /* ... */
}

@component("my-element", undefined, false)
class MyElement extends PolymerElement {
     /* ... */
}
```

### `@extends(tagName)`

Makes a component inherit another component - at the time of writing Polymer only supports extending native elements. Must always be used after the `@component` decorator.

```javascript
@component
@extends("a")
class MyLink extends PolymerElement {
     /* ... */
}
```

### `@behavior(behavior)`

Add a behavior to your class. Must always be used after the `@component` decorator. Do note that this will not add the proper type definitions to your class. Methods and properties defined through the behavior will not be known to the TypeScript compiler. This will presumably resolved when mixins are available in a standardized way, implemented by the TypeScript compiler and supported by Polymer.

```javascript
@component
@behavior(MyBehavior)
class MyElement extends PolymerElement {
     /* ... */
}
```

### `@property({ /* properties */ })`

Declares a class member as a property. It accepts an options object identical to the one that you pass to Polymer in the `properties` section when defining an element in standard Polymer-style. If using TypeScript you can however omit the type, it will be automatically inferred (given that you enabled `emitDecoratorMetadata`). If the object is empty, you may omit it - and in fact omit the calling parenthesis.

```javascript
@component
class MyElement extends PolymerElement {
     @property({type: String})
     firstname: string;

     @property
     lastname: string;
}
```

### `@observe(properties)`

This decorator lets a function observe changes to properties. Simply specify all properties you want to observe as a string, seperated by commas. If you only specify a single property (that is not a path), your function will receive two values: the value the property was changed to and the value it has previously. If specifying more or a property with a path, your function will receive the new values of all of the properties. Note: this handler will be called once when the element is created.

```javascript
@component
class MyElement extends PolymerElement {
     @property
     firstname: string;

     @property
     lastname: string;

     @observe("firstname")
     firstnameChanged(newValue, oldValue) {}

     @observe("firstname, lastname")
     nameChanged(firstname, lastname) {}
}
```

### `@computed`

This decorator will change a function into a computed property. It takes almost the same options argument as the `@property` decorator. The single difference is that when specifyinv the `computed` property, it will not take a "function call" in string form, but only the arguments to that call, i.e. the names of the properties your function takes as arguments. The options may also be omitted, in that case the properties to pass in will be inferred from your function signature. You may want to specify the arguments manually if you plan to minify your code.

```javascript
@component
class MyElement extends PolymerElement {
     @property
     firstname: string;

     @property
     lastname: string;

     @computed
     fullname(firstname, lastname) {
          return `{firstname} {lastname}`
     }
}
```

### `@listen(event)`

Make a function listen to an event on your element. This decorator takes the event name as a parameter. Your function will not receive any arguments.

```javascript
@component
class MyElement extends PolymerElement {
     @listen("my-event")
     handleMyEvent() { /* ... */ }
}
```

## Differences to PolymerTS

There are a couple of minor differences to PolymerTS. Firstly, types are inferred if possible, so that you don't need to do this:

```javascript
@property({type: String})
name: string;
```

I mean, really, why would you want to specify this twice? You can instead write:

```javascript
@property
name: string;
```

And it does the exact same thing.  
By default elements are also auto-registered. I think the cases where you want this are more common than those when you don't want that.  
Also nothing is exported to the global namespace - you can import everything as you want it.  
However there is also one feature that was removed: overloading of the constructor. Unfortunately this functionality cannot be provided with classes in ES6, so I removed it for consistency. Please remember that by default if you give instance variables default values, the TypeScript compiler will put theses into the constructor, so they will not be set in your Polymer elements. Instead define an `attached` method and do all your initialization work there.  
Generally this follows the Polymer guidelines for creating elements with ES6 classes a lot more closely.
