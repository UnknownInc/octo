import { deepPurple, purple } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: purple,
  },
});

export default theme;