# Rootrex V2

## Technology Stack

* [Angular](https://angular.com/)
* [Material](https://material.angular.io/)
* [Ngxs](https://www.gitbook.com/book/ngxs/ngxs/)
* [BigNumber](https://github.com/MikeMcl/bignumber.js/)
* [Web3](https://github.com/ethereum/web3.js/)

## How to run

1. Use `npm i` to install dependencies.

2. Then run `npm start` to launch the development server on localhost:4200.

## Folder structure

In this project, the main code folder is `app`, and there're some functional folder in it:

`components`: global and reusable component

`controller`: link ionic, I put some controller and you can use them to create dialog or popup easily

`interface`: in this folder, I collect all interface file to manage them 

`page`: main folder and storage all page file

`pipe`: angular's pipe folder, use them in `.html`

`service`: angular's service file, like 'DAO' or 'Service' in Java

`util`: in this folder I manage all api list for current project

## Code specification

A independence component has it own folder in `components` or `pages`, usually it's same name as the component.
There's some file in folder such as `module` `.html` `.scss` `.ts`.

`module`: includes all depends of the component

`.ts`: most important file,in `class` there're several parts:

* Data Part: declare your parameters, Input() or Output() here

* Constructor Part: angular's constructor

* Lifecycle Part: reserve angular's lifecycle hook function whatever you use or not,such as ngOnInit()

* Methods Part: write your functions here, the function's name follow the rules as far as possible:

1. start with `get`,`set`,`on` and so on.

2. end with `click`,`change` or other verb when beginning is `on`.

3. for example: `onButtonClick()`,`setCurrentNavigationIndex()`

4. and I hope you can write a function names `init()` at the beginning of this Methods Part like `components/header/header.component.ts` :)
