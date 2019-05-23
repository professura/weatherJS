import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as weatherActions from '../actions/WeatherActions';
import Weather from "../components/Weather"
import '../styles/weather.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class AppContainer extends Component {
    render() {
        const { weatherData } = this.props;
        const { changeLocation, getWeather, closeAlert } = this.props.weatherActions;
        return (
            <div className="container">
                <Weather cityFromUrl={this.props.match.params.city} weatherData={weatherData} changeLocation={changeLocation} getWeather={getWeather} closeAlert={closeAlert} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        weatherData: state.weatherData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        weatherActions: bindActionCreators(weatherActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)