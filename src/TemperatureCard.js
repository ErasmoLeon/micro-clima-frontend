import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';

const styles = theme => ({
  headerCardData: {
    fontSize: '40px'
  },
  avatarTemperature: {
    backgroundColor: red[500],
  },
});

const TemperatureCard = ({ classes, value }) => {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar aria-label="Recipe" className={classes.avatarTemperature}>
            T
          </Avatar>
        }
        title="Temperature average"
        subheader={<Typography variant="h3" color="inherit">{value}℃</Typography>}
      />
    </Card>
  );
}

export default withStyles(styles)(TemperatureCard);
