# Contact2.0

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### Clone this project
```
git clone http://repository2.luxbase.int/Contact-2.0/front-end.git
cd front-end-prototype
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master
```

## Production build

### Prerequisites
* install node.js engine >= v6.9
* install git bash
* clone this repository

### Building
 * cd to this repository
 * run `npm install`, ensure there are no errors in the console
 * run `npm run build -- --prod --aot` (this will output the compiled bundle to `/dist`)

### Running
* cd to the `/dist` folder
* serve the folder contents with any http server, i.e. `python -m SimpleHTTPServer 9000 .`
