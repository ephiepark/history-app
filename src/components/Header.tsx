import { Button, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { WithFirebaseApiProps, withFirebaseApi } from "../Firebase";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { Link } from 'react-router-dom';

const HeaderBase = (
  props: WithFirebaseApiProps
) => {
  const currentUserId = useAppSelector((state: RootState) => state.user.userId);
  const loginWithGoogleButton = (
    <Button color="inherit" onClick={props.firebaseApi.signInWithGoogleRedirect}>Login with Google</Button>
  );
  const logoutButton = (
    <Button color="inherit" onClick={props.firebaseApi.signOut}>Log out</Button>
  );
  const button = currentUserId == null ? loginWithGoogleButton : logoutButton;
  const profileButton = currentUserId == null ? null : <Button color="inherit" component={Link} to={'/profile'}>Profile</Button>

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div">
          <Button component={Link} to={'/'} color="inherit">역사민수</Button>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button component={Link} to={'/event/new'} color="inherit">Add New Event</Button>
        {profileButton}
        {button}
      </Toolbar>
    </AppBar>
  );
};

export default withFirebaseApi(HeaderBase);
