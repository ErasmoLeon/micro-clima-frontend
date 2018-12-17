import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import axios from 'axios';

import './App.css';
import { LineChart } from './LineChart';
import TemperatureCard from './TemperatureCard';
import HumidityCard from './HumidityCard';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: '20px',
  },
});

const TIME_TO_UPDATE = 60000;
let globalInterval;

const defaultChartData = (name) => ({
  labels: [],
  data: [],
  name,
});

class App extends Component {

  state = {
    average: {
      temperature: 0,
      humidity: 0,
    },
    charts: {
      temperature: {
        labels: [],
        data: [],
        name: 'Temperature',
      },
      humidity: {
        labels: [],
        data: [],
        name: 'Humidity',
      },
    }
  }

  updateData() {
    console.log("updating...");
    axios.get('http://localhost:3002/environment/global/today').then(({ data }) => {
      const newState = {
        charts: {},
      };
      if (data.lastRecords) {
        newState.charts.temperature = defaultChartData('Temperature');
        newState.charts.humidity = defaultChartData('Humidity');
        newState.average = data.average;
        data.lastRecords.forEach(({ time, temperature, humidity }) => {
          newState.charts.temperature.labels.push(time);
          newState.charts.humidity.labels.push(time);
          newState.charts.temperature.data.push(temperature);
          newState.charts.humidity.data.push(humidity);
        });
        this.setState(newState);
      }
    });
  }

  componentDidMount() {
    globalInterval = setInterval(() => this.updateData(), TIME_TO_UPDATE);
    this.updateData();
  }

  componentWillUnmount() {
    clearInterval(globalInterval);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              MicroClima
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.root}>
          <Grid container direction="row" justify="center" alignItems="center" spacing={24}>
            <Grid item xs={6}>
              <TemperatureCard value={this.state.average.temperature} />
            </Grid>
            <Grid item xs={6}>
              <HumidityCard value={this.state.average.humidity} />
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <LineChart chartData={this.state.charts.temperature} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <LineChart chartData={this.state.charts.humidity} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
