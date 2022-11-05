import { Button, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { WithFirebaseApiProps, withFirebaseApi } from "../Firebase";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { Link } from 'react-router-dom';

const LoggedInUserMenuBase = (props: WithFirebaseApiProps) => {
  const currentUserInfo = useAppSelector((state: RootState) => state.user.userInfo.value);

  const addEventButton = currentUserInfo != null && currentUserInfo.isEditor ? <Button component={Link} to={'/event/new'} color="inherit">Add Event</Button> : null;
  return <>
    {addEventButton}
    <Button color="inherit" component={Link} to={'/profile'}>Profile</Button>
    <Button color="inherit" onClick={props.firebaseApi.signOut}>Log out</Button>
  </>;
};

const LoggedInUserMenu = withFirebaseApi(LoggedInUserMenuBase);

const LoggedOutUserMenuBase = (props: WithFirebaseApiProps) => {
  return <>
    <Button color="inherit" onClick={props.firebaseApi.signInWithGoogleRedirect}>Login with Google</Button>
  </>;
};

const LoggedOutUserMenu = withFirebaseApi(LoggedOutUserMenuBase);

const HeaderBase = (
  props: WithFirebaseApiProps
) => {
  const currentUserId = useAppSelector((state: RootState) => state.user.userId);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div">
          <Button component={Link} to={'/'} color="inherit">역사민수</Button>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {currentUserId == null ? <LoggedOutUserMenu /> : <LoggedInUserMenu />}
      </Toolbar>
    </AppBar>
  );
};

export default withFirebaseApi(HeaderBase);
