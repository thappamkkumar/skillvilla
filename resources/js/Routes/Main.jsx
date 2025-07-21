import React from 'react';
import ReactDOM from 'react-dom/client';   
import {Provider} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; 

import {  BrowserRouter as Router } from 'react-router-dom';
 
 
import Store from '../StoreWrapper/Store/Store'; ;
 
import AppRoutes from './AppRoutes'; ;




const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
			<>
				{/*I remove strictmmode for developement purpose.after production add it for production*/}
				{/*<React.StrictMode>*/} 
					<Provider store = {Store}>
						<Router>
							<AppRoutes />
						</Router>
					</Provider> 
				{/*</React.StrictMode>*/}
			</>
    );
