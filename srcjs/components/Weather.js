import { Component } from 'react';
import { Button, Input, Card, CardHeader, CardBody, CardText, Alert } from 'reactstrap';

export default class AppContainer extends Component {
    changeInput = (e) => {
        const { changeLocation } = this.props;
        changeLocation(e.target.value);
    }

    onClick = (e) => {
        const { getWeather } = this.props;
        const { location } = this.props.weatherData;
        getWeather(location);
    }

    componentDidMount() {
        const { getWeather } = this.props;
        const { cityFromUrl } = this.props;
        getWeather(cityFromUrl || "Липецк");
    }

    toggleAlert = () => {
        const { closeAlert } = this.props;
        closeAlert();
    }

    render() {
        const { location, temperature, uv, wind, labelLocation, condition, isNoMatchLocation } = this.props.weatherData;
        return (
            <div className="weather-widget">
                <Alert color="warning" isOpen={isNoMatchLocation} toggle={this.toggleAlert}>
                    <div>Город не найден</div>
                </Alert>
                <Card>
                    <CardHeader>Погода {labelLocation}</CardHeader>
                    <CardBody>
                        <CardText>Температура: {temperature}</CardText>
                        <CardText>Ветер: {wind} км/ч</CardText>
                        <CardText>Индекс УФ: {uv} </CardText>
                        <CardText>{condition.text} <img src={condition.icon} alt={condition.text}></img></CardText>
                    </CardBody>
                </Card>
                <Input placeholder="Введите город" className="mt-1" onChange={this.changeInput} value={location} />
                <Button className="btn-width mt-1" color="primary" onClick={this.onClick}>Поиск</Button>
            </div>);
    }
}
