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
5. Call `Polymer(MyClass)` to register the class with Polymer.

Please enable the compiler option emitDecoratorMetadata to enable type inference for properties if using TypeScript.

### `@component`

Declares a class a component. It can take up to two parameters, the first being the name of the component and the second being the element it extends. Both are **optional**. If the second parameter isn't present, the component will not inherit any other component, if the first is not present, the name will be inferred from the class name. If you don't specify any option, you can use `component` as a decorator directly and not as a factory.

The following are all valid:

```javascript
@component("my-element")
class MyElement extends PolymerElement {
     /* ... */
}

@component("my-link", "a")
class MyLink extends PolymerElement {
     /* ... */
}

@component()
class MyElement extends PolymerElement {
     /* ... */
}

@component
class MyElement extends PolymerElement {
     /* ... */
}
```

### `@extends`

Makes a component inherit another component - at the time of writing Polymer only supports extending native elements. Must always be used after the `@component` decorator.

```javascript
@component
@extends("a")
class MyLink extends PolymerElement {
     /* ... */
}
```

### `@behavior`

Add a behavior to your class. Must always be used after the `@component` decorator. Do note that this will not add the proper type definitions to your class. Methods and properties defined through the behavior will not be known to the TypeScript compiler. This will presumably resolved when mixins are available in a standardized way, implemented by the TypeScript compiler and supported by Polymer.

```javascript
@component
@behavior(MyBehavior)
class MyElement extends PolymerElement {
     /* ... */
}
```

### `@property`

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

### `@observe`

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

### `@listen`

Make a function listen to an event on your element. This decorator takes the event name as a parameter. Your function will not receive any arguments.

```javascript
@component
class MyElement extends PolymerElement {
     @listen("my-event")
     handleMyEvent() { /* ... */ }
}
```