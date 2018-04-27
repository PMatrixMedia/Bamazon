// JavaScript source code
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import mysql2 from 'mysql2';
import App from './src/app.js';
import inquirer from 'inquirer';
import store from './store.js';

const serverRender = () =>
