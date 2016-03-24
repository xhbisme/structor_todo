require("babel-polyfill");

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import { Router, Route, Link, useRouterHistory } from 'react-router';

import storeManager from '../../src/client/store/storeManager.js';
import PageForDesk from './PageForDesk.js';
import PageNoRoute from './PageNoRoute.js';


window.pageReadyState = 'ready';

window.__createPageDesk = function(model){

    window.pageReadyState = 'initialized';
    window.__model = model;

    const history = useRouterHistory(createHistory)({
        basename: '/deskpage'
    });

    window.__switchToPath = function(pagePath){
        history.push(pagePath);
    };

    const store = storeManager();

    let childRoutes = [];
    if(model && model.pages && model.pages.length > 0){
        childRoutes = model.pages.map( (page, idex) => {
            return { path: page.pagePath, component: PageForDesk }
        });
        childRoutes.push({ path: '*', component: PageNoRoute });
    } else {
        console.warn('Please check project model, pages were not found.');
    }

    let routeConfig = [
        { path: '/',
            component: 'div',
            indexRoute: { component: PageForDesk },
            childRoutes: childRoutes
        }
    ];

    ReactDOM.render(
        <Provider store={store}>
            <Router history={history} routes={routeConfig} />
        </Provider>,
        document.getElementById('content')
    );

};

