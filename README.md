# component-loader
Knockout abstract components loader. RequireJS is required.

It's components loader which can be used to load any components. You can tell it how to map your paths to download your template, view model or factory and it will do it. Just include it to your knockout loaders.

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
   * 
   **/
  ko.components.loaders.unshift(componentLoader);
  
  // you should execute it after registering your component loader.
  ko.applyBindings(vm, document.getElementById('you-app-id'));
});

```

You can write own path provider, it should contains:

useFormats {function} - use it to setup your path formats to make component-loader understand where it can find templates, view models or factories.
formats {object} - just set object to it. It should be like 
```json
{
  template: 'you-template-path-format',
  vm: 'you-vm-path-format',
  factory: 'you-factory-path-format'
}
```

Use it in markup:

```html
<div data-bind="component: {name: {vm: 'example-component.vm'}, params: {hello: 'world'}}"></div>

<div data-bind="component: {name: {factory: 'example-component.factory'}, params: {hello: 'world'}}"></div>

<div data-bind="component: {name: {app: 'example-app-2', vm: 'example-component.vm'}, params: {hello: 'world'}}"></div>
```

It means that your 
