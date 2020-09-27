import React from 'react';

import {
  BrowserRouter as Router,
  useHistory,
  Switch as RouteSwitch,
  Route,
} from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ListAltIcon from '@material-ui/icons/ListAlt';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import Drawer from '@material-ui/core/Drawer';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import './App.less';
import Copyright from './Copyright';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import HomePage from './pages/Home';
import SigninPage from './pages/Signin';
import SignupPage from './pages/Signup';

import { observer } from 'mobx-react-lite';
import { useStores } from './stores/useStores';
import { Menu, MenuItem, Backdrop, CircularProgress, Avatar, TextField, InputAdornment, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main:props=>({
    flexGrow: 1,
    display:'flex',
    position:"relative",
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  }),
  mainShift:props=>({
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: props.drawerWidth,
  }),
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: props=>({
    width: `calc(100% - ${props.drawerWidth}px)`,
    marginLeft: props.drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  drawer: props=>({
    width: props.leftDrawerWidth,
    flexShrink: 0,
  }),
  drawerPaper: props=>({
    width: props.leftDrawerWidth,
  }),
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },

  rightDrawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },

  rightDrawer: props=>({
    width: props.rightDrawerWidth,
    flexShrink: 0,
  }),
  rightDrawerPaper: props=>({
    width: props.rightDrawerWidth,
    zIndex: theme.zIndex.appBar - 1,
  }),
  icon: {
    marginRight: theme.spacing(2),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
    alignSelf: 'center',
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    //padding: theme.spacing(1, 1),
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop: 'auto',
    zIndex:theme.zIndex.appBar,
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const LoginMenu = observer(()=>{
  const classes = useStyles();
  const {session} = useStores();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  let history = useHistory();
  const gotoLoginPage = ()=>{
    history.push('/signin');
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleSignout = () => {
    handleMenuClose();
    session.logout();
  }
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleSignout}>Sign out</MenuItem>
    </Menu>
  );
  return <div>
    {session.isAuthenticated ? <IconButton
      edge="end"
      aria-label="account of current user"
      aria-controls={menuId}
      aria-haspopup="true"
      onClick={handleProfileMenuOpen}
      color="inherit"
    >
      <Avatar alt={session.user.email} src={session.user.photoURL} className={classes.small}/>
    </IconButton>:<Button color="inherit" onClick={gotoLoginPage}>Login</Button>}
    {renderMenu}
  </div>
})

const App = observer(()=>{
  const {session, preferences, doc} = useStores();
  const classes = useStyles(preferences);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openRight, setOpenRight] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleRightDrawerOpen = () => {
    setOpenRight(true);
  };

  const handleRightDrawerClose = () => {
    setOpenRight(false);
  };
  return (
    <Router>
      <div className={classes.root}>
        <AppBar position='relative'
        className={`${classes.appBar} ${open?classes.appBarShift:''}`}>
          <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={`${classes.menuButton} ${open?classes.hide:''}`}
          >
            <MenuIcon />
          </IconButton>
            <Typography variant="h6" color="inherit" noWrap className={classes.title}>
              Octo
            </Typography>
            <LoginMenu/>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <LeftPanel/>
        </Drawer>

        <main className={`${classes.main} ${open?classes.mainShift:''}`}>
          <RouteSwitch>
            <Route path="/signin">
              <SigninPage/>
            </Route>
            <Route path="/signup">
              <SignupPage/>
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </RouteSwitch>
        </main>
        <Drawer
          className={classes.rightDrawer}
          variant="persistent"
          anchor="right"
          open={openRight}
          classes={{
            paper: classes.rightDrawerPaper,
          }}
        >
          <div className={classes.rightDrawerHeader}></div>
          <div className={classes.rightDrawerHeader}>
            <IconButton onClick={handleRightDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            <span>Output</span>
          </div>
          <Divider />
          <RightPanel/>
        </Drawer>
        <Backdrop className={classes.backdrop} open={session.connectionState!=='online'}>
          <div>
          <Typography variant="h3" align="center" gutterBottom>
            {session.connectionState}
          </Typography>
          <Typography variant="body1" component="div" align="center" gutterBottom>
            {session.connectionState!=='online'?<CircularProgress color="inherit" size={40} />:null}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            {'trying to reconnect...'}
          </Typography>
          </div>
        </Backdrop>

        {/* Footer */}
        <footer className={classes.footer}>
          <div className={'centeredrow'}>
          <Box mx={1}>
            <div>Experiment:</div>
          </Box>
          <Box>
            <Pagination count={doc.variationsCount} size='small' color="primary" showFirstButton showLastButton />
          </Box>
          </div>
          <Grid container spacing={1} style={{maxWidth:400}}>
            <Grid item>
              <ToggleButton 
                selected={openRight}
                value={openRight?'open':'closed'}
                onChange={() => {
                  setOpenRight(!openRight);
                }}>
                <ListAltIcon fontSize="small" />
              </ToggleButton>
            </Grid>
            <Grid item >
              <IconButton onClick={()=>(preferences.canvasScale-=0.1)}>
                <ZoomOutIcon />
              </IconButton>
            </Grid>
            <Grid item xs style={{alignSelf:'center'}}>
              <Slider value={preferences.canvasScale} 
                min={0} max={200}
                step={5}
                value={preferences.canvasScale*100}
                onChange={(e,v)=>{preferences.canvasScale=v/100.0}} 
                aria-labelledby="continuous-slider" />
            </Grid>
            <Grid item>
              <IconButton onClick={()=>(preferences.canvasScale+=0.1)}>
                <ZoomInIcon />
              </IconButton>
            </Grid>
          </Grid>
          {/* <Typography variant="h6" align="center" gutterBottom>
            
          </Typography> 
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            Handle with care! Still in development.
          </Typography> 
          <Copyright />*/}
        </footer>
        {/* End footer */}
      </div>
    </Router>
  );
});

export default App;
