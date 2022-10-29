import { Typography, Stack, TextField, Button, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect } from "react";
import { WithFirebaseApiProps, withFirebaseApi } from "../../Firebase";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { asyncUpdateUserInfo } from "../../redux/userSlice";
import { UserInfo } from "../../types";

const EditProfilePicViewModeBase = (props: WithFirebaseApiProps & {
  userInfo: UserInfo
  onEditClick: () => void,
}) => {
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  useEffect(() => {
    if (props.userInfo.profilePicHandle == null) {
      return;
    }
    props.firebaseApi.asyncGetURLFromHandle(props.userInfo.profilePicHandle).then((url) => {
      setProfilePicUrl(url);
    });
  }, [props.userInfo.profilePicHandle]);
  let profilePic = null;
  if (profilePicUrl) {
    profilePic = <img src={profilePicUrl} width={200} />;
  }

  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="body1" align="left" sx={{ marginTop: "auto", marginBottom: "auto" }}>
        Profile Pic:
      </Typography>
      {profilePic}
      <IconButton onClick={() => props.onEditClick()}>
        <EditIcon />
      </IconButton>
    </Stack>
  )
};

const EditProfilePicViewMode = withFirebaseApi(EditProfilePicViewModeBase);

const EditProfilePicEditModeBase = (props: WithFirebaseApiProps & {
  userId: string,
  userInfo: UserInfo,
  onSubmitClick: () => void,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (props.userInfo.profilePicHandle == null) {
      return;
    }
    props.firebaseApi.asyncGetURLFromHandle(props.userInfo.profilePicHandle).then((url) => {
      setProfilePicUrl(url);
    });
  }, [props.userInfo.profilePicHandle]);
  let profilePic = null;
  if (profilePicUrl) {
    profilePic = <img src={profilePicUrl} width={200} />;
  }
  if (file !== null) {
    profilePic = <img src={URL.createObjectURL(file!)} width={200} />;
  }

  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="body1" align="left" sx={{ marginTop: "auto", marginBottom: "auto" }}>
        Profile Pic:
      </Typography>
      {profilePic}
      <Button variant="contained" component="label">
        Select Image
        <input hidden accept="image/*" onChange={(e) => {
          const files = e.target.files;
          if (files == null || files.length === 0) {
            setFile(null);
          } else {
            setFile(files[0]);
          }
        }} type="file" />
      </Button>
      <Button
        variant="contained"
        sx={{ marginTop: 2 }}
        onClick={async () => {
          const handle = await props.firebaseApi.asyncUploadImage(props.userId, file!);
          dispatch(asyncUpdateUserInfo({
            firebaseApi: props.firebaseApi,
            userId: props.userId,
            userInfo: { profilePicHandle: handle },
          }))
        }}
      >SUBMIT</Button>
    </Stack>
  )
};

const EditProfilePicEditMode = withFirebaseApi(EditProfilePicEditModeBase);

const EditProfilePicBase = (props: WithFirebaseApiProps & {
  userId: string,
  userInfo: UserInfo
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  return isEditMode ? <EditProfilePicEditMode
    userId={props.userId}
    userInfo={props.userInfo}
    onSubmitClick={() => { setIsEditMode(false) }}
  /> : <EditProfilePicViewMode
    userInfo={props.userInfo}
    onEditClick={() => { setIsEditMode(true) }}
  />;
}

const EditProfilePic = withFirebaseApi(EditProfilePicBase);

const EditUsernameViewMode = (props: {
  userInfo: UserInfo,
  onEditClick: () => void,
}) => {
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="body1" align="left" sx={{ marginTop: "auto", marginBottom: "auto" }}>
        Username: {props.userInfo.username}
      </Typography>
      <IconButton onClick={() => props.onEditClick()}>
        <EditIcon />
      </IconButton>
    </Stack>
  );
};

const EditUsernameEditModeBase = (props: WithFirebaseApiProps & {
  userId: string,
  userInfo: UserInfo,
  onSubmitClick: () => void,
}) => {
  const [username, setUsername] = useState<string>(props.userInfo.username);
  const dispatch = useAppDispatch();

  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="body1" align="left" sx={{ marginTop: "auto", marginBottom: "auto" }}>
        Username:
      </Typography>
      <TextField
        value={username}
        label="Edit Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button
        variant="contained"
        sx={{ marginTop: 2 }}
        onClick={async () => {
          dispatch(asyncUpdateUserInfo({
            firebaseApi: props.firebaseApi,
            userId: props.userId,
            userInfo: { username: username },
          }))
        }}
      >SUBMIT</Button>
    </Stack>
  )
};

const EditUsernameEditMode = withFirebaseApi(EditUsernameEditModeBase);

const EditUsername = (props: {
  userId: string,
  userInfo: UserInfo,
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  return isEditMode ? <EditUsernameEditMode
    userId={props.userId}
    userInfo={props.userInfo}
    onSubmitClick={() => setIsEditMode(false)}
  /> : <EditUsernameViewMode
    userInfo={props.userInfo}
    onEditClick={() => setIsEditMode(true)}
  />;
};

const EditProfileBase = (props: WithFirebaseApiProps) => {
  const userId = useAppSelector((state: RootState) => state.user.userId);
  const userInfo = useAppSelector((state: RootState) => state.user.userInfo.value);

  return (<>
    <Typography variant="h2" component="div" align="left">
      Edit Profile
    </Typography>
    <EditUsername userId={userId!} userInfo={userInfo!} />
    <EditProfilePic userId={userId!} userInfo={userInfo!} />
  </>);
}

export default withFirebaseApi(EditProfileBase);
