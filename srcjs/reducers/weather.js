import {
  CHANGE_LOCATION,
  GET_WEATHER_REQUEST,
  GET_WEATHER_SUCCESS,
  GET_WEATHER_ERROR,
  CLOSE_ALERT
} from '../constants/WeatherConsts'

const initialState = {
  location: "",
  temperature: 0,
  uv: 0,
  wind: 0,
  condition: {},
  labelLocation: "",
  error: 0,
  isNoMatchLocation: false
}

export default function weatherOptions(state = initialState, action) {

  switch (action.type) {
    case CLOSE_ALERT:
      return { ...state, isNoMatchLocation: action.payload }

    case CHANGE_LOCATION:
      return { ...state, location: action.payload }

    case GET_WEATHER_REQUEST:
      return state

    case GET_WEATHER_SUCCESS:
      return {
        ...state, 
        temperature: action.payload.current.temp_c, wind: action.payload.current.wind_kph,
        uv: action.payload.current.uv,
        labelLocation: action.payload.location.name,
        condition: action.payload.current.condition,
        isNoMatchLocation: false
      }

    case GET_WEATHER_ERROR:
      return { ...state, isNoMatchLocation: action.payload.code === 1006 }

    default:
      return state;
  }

}