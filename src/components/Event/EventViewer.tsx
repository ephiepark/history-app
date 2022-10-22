import { WithFirebaseApiProps, withFirebaseApi } from "../../Firebase";
import { Box, Stack, TextField, Button, CircularProgress, Typography, Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import { UserInfo } from "../../types";
import { useParams } from "react-router-dom";
import { EventWithId } from "../../types";
import EventEditor, { EventEditMode } from "./EventEditor";

const EventViewModeBase = (props: {
  eventId: string,
} & WithFirebaseApiProps) => {
  const [event, setEvent] = useState<EventWithId | null>(null);
  const [author, setAuthor] = useState<UserInfo | null>(null);

  useEffect(() => {
    props.firebaseApi.asyncGetEvent(props.eventId!).then((event: EventWithId | null) => {
      setEvent(event);
    });
  }, []);
  useEffect(() => {
    if (event?.userId == null) {
      return;
    }
    props.firebaseApi.asyncGetUserInfo(event!.userId).then((userInfo: UserInfo | null) => {
      setAuthor(userInfo);
    });
  }, [event?.userId]);

  if (props.eventId == null) {
    return <Typography>Something went wrong...</Typography>;
  }
  if (event === null || author === null) {
    return <CircularProgress />;
  }
  return (<Stack>
    <Typography>{`Title: ${event.title}`}</Typography>
    <Typography>{`Author: ${author.username}`}</Typography>
    <Typography>{`Created Time: ${event.createdTime}`}</Typography>
    <Autocomplete
      multiple
      id="tags-outlined"
      filterSelectedOptions
      options={event.tags}
      value={event.tags}
      renderInput={(params) => (
        <TextField
          {...params}
          label="tags"
          placeholder="Tags"
        />
      )}
      readOnly
    />
    <Typography>{`Event Time: ${event.eventTime}`}</Typography>
    <Typography>{`Description: ${event.description}`}</Typography>
  </Stack>);
};

const EventViewMode = withFirebaseApi(EventViewModeBase);

const EventViewerBase = (props: WithFirebaseApiProps) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const params = useParams();

  if (params.eventId == null) {
    return <Typography>Invalid Event Id...</Typography>;
  }
  const body = isEditMode ? <EventEditMode
    eventId={params.eventId}
    onClick={() => {
      setIsEditMode(false);
    }}
  /> : <EventViewMode eventId={params.eventId}/>;
  const button = isEditMode ? <Button variant="contained" onClick={() => { setIsEditMode(false) }}>Cancel Edit</Button> : <Button variant="contained" onClick={() => { setIsEditMode(true) }}>Edit</Button>;
  return (<Stack>
    {body}
    {button}
  </Stack>);
}

export default withFirebaseApi(EventViewerBase);
