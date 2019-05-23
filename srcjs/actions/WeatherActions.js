import {
  CHANGE_LOCATION,
  GET_WEATHER_REQUEST,
  GET_WEATHER_SUCCESS,
  GET_WEATHER_ERROR,
  CLOSE_ALERT
} from '../constants/WeatherConsts'

export function getWeather(location) {
  return (dispatch, getState) => {
    ajaxGraph(getState);
    async function ajaxGraph(getState) { 
      try {
        dispatch({
          type: GET_WEATHER_REQUEST,
          payload: null
        })
        const response = await fetch("https://api.apixu.com/v1/current.json?lang=ru&key=d03a08c0332c43fea8394630192305&q=" + location, {
          method: "GET"
        });

        const data = await response.json();
        if (data.current) {
          dispatch({
            type: GET_WEATHER_SUCCESS,
            payload: data
          });
        } else if (data.error) {
          dispatch({
            type: GET_WEATHER_ERROR,
            payload: data.error
          });
        }
        console.log(data);
        

      } catch (err) {
        console.log("err", err);
      }
    }
  }
}

export function changeLocation(location) {
  return (dispatch) => {
    dispatch({
      type: CHANGE_LOCATION,
      payload: location
    })
  }
}

export function closeAlert() {
  return (dispatch) => {
    dispatch({
      type: CLOSE_ALERT,
      payload: false
    })
  }
}
