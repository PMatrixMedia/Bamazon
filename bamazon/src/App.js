import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import mysql from 'mysql2';
import bamazoninv from 'bamazoninv';


class App extends Component {
    state = {
        inventory: []
        inventory: {
            name: '',
            price: 0
        }
    }



    componentDidMount() {
        this.getinventory();
    }

        getInventory = _ => {
            fetch('webapp-mysqldbserver-abfbb289-34681.mysql.database.azure.com')
                .then(response => response.json())
                .then(response => this.setstate({ inventory: response.data }))
                .catch(err => console.error(err))
        }

    addInventory = _ => {
        const { inventory } = this.state;
        fetch('webapp-mysqldbserver-abfbb289-34681.mysql.database.azure.com')
        then(this.getinventorys)
        .catch(err => console.error(err))
    }




      renderInventory = ({ inventory_id, name }) => <div key={inventory_id}>{name}</div>



      render() {
        const { inventory } = this.state;
         return (
          <div className="App">
              {inventory.map(this.renderInventory)}
              <div>
                  <input
                      value={inventory.name}
                      onChange={e => this.setState({ inventory: { ...inventory, name: e.target.value } })} />
                  < input
                      value={inventory.price}
                      onChange={e => this.setState({ inventory: { ...inventory, price: e.target.value } })} />
                  />
              </div>
          </div>
        );
      }
}

export default App;
