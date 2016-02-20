# Knockout component-loader
Knockout abstract components loader. RequireJS is required.

It's Knockout `components loader` which can be used to load any components. You can tell it how to map your paths to download your template, view model or factory and it will do it. Just include it to your knockout loaders.

### You will not use any other bindings, just default `component` knockout binding with `name` and `params` as usual.

Component-loader API:

You can set next object structure to your component `name` property. It will be like a name but object which will be used to create usual name of component :)
```
{
   app: {string}, - app name to get component from this app. You can start it with '/' then RequireJS will look after it from root domain name.
   vm: {string}, - use if you have a view model for your component (don't use 'factory' in this case)
   factory: {string}, - use if you have a factory for your component (don't use 'vm' in this case)
   componentsFolder: {string} - folder where to find components, default is 'components'
}
```

###Configuration

```javascript
require([
  'componentLoader', 'pathProvider', 'components.settings'
], function (componentLoader, pathProviderFactory, componentSettings) {

  /* You can provide root of your app.
   * It can contains '/' in start of path. Then path provider will know that you want to load js file from root of your domain.
   **/
  componentLoader.appName = 'example-app';

  /* 
   * Provide your components path formats if you want
   **/
  pathProviderFactory.useFormats(componentSettings.formats);
  
  /*
   * Setup of component loader. Get it know which path provider it should use.
   **/
  componentLoader.usePathProvider(pathProviderFactory.getProvider());
  
  /*
   * Register component loader in knockout loader list
   **/
  ko.components.loaders.unshift(componentLoader);
  
  // you should execute it after registering your component loader.
  ko.applyBindings(vm, document.getElementById('you-app-id'));
});

```
### Custom Formats
You can use default path formats:
```json
{
   "template": "{app}/{components}/{template}/{template}.template",
   "vm": "{app}/{components}/{vm}/{vm}.vm",
   "factory": "{app}/{components}/{factory}/{factory}.factory"
 }

```
OR You can use own formats to tell components loader which type of file from which way it should download.

### Custom Path Provider
If you want You can write own path provider. It should contains:

* useFormats {function} - use it to setup custom path formats to make component-loader understand where it can find templates, view models or factories. formats should be like this: 
```json
{
  "template": "you-template-path-format",
  "vm": "you-vm-path-format",
  "factory": "you-factory-path-format"
}
```

Use it in markup:

```html
<div data-bind="component: {name: {vm: 'example-component'}, params: {hello: 'world'}}"></div>

<div data-bind="component: {name: {factory: 'example-component'}, params: {hello: 'world'}}"></div>

<div data-bind="component: {name: {app: 'example-app-2', vm: 'example-component'}, params: {hello: 'world'}}"></div>
```

