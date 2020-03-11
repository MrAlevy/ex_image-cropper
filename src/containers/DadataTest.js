import React from 'react';
import axios from 'axios';
import '../index.css';

/**
    country	Страна
    region	Регион
    area	Район
    city	Город
    settlement	Населенный пункт
    street	Улица
    house	Дом
 */

export default class DadataTest extends React.Component {
  state = {
    cityInput: '',
    suggestionsCity: [],
    chosenCityObject: {},
    addressInput: '',
    suggestionsAddress: [],
    chosenAddressObject: {}
  };

  handleChangeCityInput(e) {
    const city = e.target.value;

    this.setState({
      cityInput: city,
      suggestionsCity: []
    });

    if (city.length < 3) return;

    axios
      .post(
        'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
        {
          query: city,
          count: 6,
          from_bound: { value: 'city' },
          to_bound: { value: 'settlement' },
          locations: [
            {
              city_type_full: 'город'
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Token fda819a48857108c48a19732c41ed70f8fc62588'
          }
        }
      )
      .then(response => {
        console.log('city: ', response);
        this.setState({
          suggestionsCity: response.data.suggestions
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleChangeAddressInput(e) {
    const address = e.target.value;

    this.setState({
      addressInput: address,
      suggestionsAddress: []
    });

    if (address.length < 3) return;

    axios
      .post(
        'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
        {
          query: address,
          count: 6,
          from_bound: { value: 'street' },
          to_bound: { value: 'house' },
          locations: [
            {
              city_fias_id: this.state.chosenCityObject.data.fias_id // only for city (settlement_fias_id - for settlement)
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Token fda819a48857108c48a19732c41ed70f8fc62588'
          }
        }
      )
      .then(response => {
        console.log('address: ', response);
        this.setState({
          suggestionsAddress: response.data.suggestions
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleCityClick(city) {
    this.setState({
      cityInput: city.value,
      suggestionsCity: [],
      chosenCityObject: city
    });
  }

  handleAddressClick(address) {
    this.setState({
      addressInput: address.value,
      suggestionsAddress: [],
      chosenAddressObject: address
    });
  }

  render() {
    return (
      <div className='main_block'>
        <div className='input_block'>
          <label htmlFor='city'>city:</label>
          <input
            className='input'
            id='city'
            value={this.state.cityInput}
            onChange={e => this.handleChangeCityInput(e)}
          />
        </div>

        {this.state.suggestionsCity.length > 0 && (
          <div className='suggestions_block'>
            {this.state.suggestionsCity.map((city, i) => (
              <div
                className='suggestion'
                key={i}
                onClick={() => this.handleCityClick(city)}
              >
                {city.value}
              </div>
            ))}
          </div>
        )}

        <div className='input_block'>
          <label htmlFor='address'>address:</label>
          <input
            className='input'
            id='address'
            value={this.state.addressInput}
            onChange={e => this.handleChangeAddressInput(e)}
          />
        </div>

        {this.state.suggestionsAddress.length > 0 && (
          <div className='suggestions_block'>
            {this.state.suggestionsAddress.map((address, i) => (
              <div
                className='suggestion'
                key={i}
                onClick={() => this.handleAddressClick(address)}
              >
                {address.value}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
