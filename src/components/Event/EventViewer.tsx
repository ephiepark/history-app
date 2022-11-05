import { WithFirebaseApiProps, withFirebaseApi } from "../../Firebase";
import { Box, Stack, TextField, Button, CircularProgress, Typography, Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import { getTagsFromIds, UserInfo } from "../../types";
import { useNavigate, useParams } from "react-router-dom";
import { EventWithId } from "../../types";
import EventEditor, { EventEditMode } from "./EventEditor";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";

const EventViewModeBase = (props: {
  eventId: string,
} & WithFirebaseApiProps) => {
  const currentUserInfo = useAppSelector((state: RootState) => state.user.userInfo.value!);
  const tags = useAppSelector((state: RootState) => state.tag.tags.value!);
  const [event, setEvent] = useState<EventWithId | null>(null);
  const [author, setAuthor] = useState<UserInfo | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    props.firebaseApi.asyncGetEvent(props.eventId).then((event: EventWithId | null) => {
      setEvent(event);
    });
  }, [props.eventId]);
  useEffect(() => {
    if (event?.userId == null) {
      return;
    }
    props.firebaseApi.asyncGetUserInfo(event!.userId).then((userInfo: UserInfo | null) => {
      setAuthor(userInfo);
    });
  }, [event?.userId]);
  useEffect(() => {
    if (event == null) {
      return;
    }
    if (event.imageHandle === null) {
      setImageUrl(null);
      return;
    }
    props.firebaseApi.asyncGetURLFromHandle(event.imageHandle).then((url) => {
      setImageUrl(url);
    });
  }, [event?.imageHandle]);

  if (props.eventId == null) {
    return <Typography>Something went wrong...</Typography>;
  }
  if (event === null || author === null || imageUrl === undefined) {
    return <CircularProgress />;
  }
  let image = null;
  if (imageUrl) {
    image = <img src={imageUrl} width={200} />;
  }
  const deleteEventButton = <Button onClick={async () => {
    await props.firebaseApi.asyncDeleteEvent(props.eventId);
    navigate(`/`);
  }}>Delete Event</Button>;
  return (<Stack>
    {image}
    <Typography>{`Title: ${event.title}`}</Typography>
    <Typography>{`Author: ${author.username}`}</Typography>
    <Typography>{`Created Time: ${event.createdTime}`}</Typography>
    <Autocomplete
      multiple
      id="tags-outlined"
      filterSelectedOptions
      options={getTagsFromIds(tags, event.tags)}
      value={getTagsFromIds(tags, event.tags)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="tags"
          placeholder="Tags"
        />
      )}
      getOptionLabel={(option) => option.tagName}
      readOnly
    />
    <Typography>{`Event Time: ${event.eventTime}`}</Typography>
    <Typography>{`Description: ${event.description}`}</Typography>
    {currentUserInfo.isEditor ? deleteEventButton : null}
  </Stack>);
};

const EventViewMode = withFirebaseApi(EventViewModeBase);

const EventViewerBase = (props: WithFirebaseApiProps) => {
  const currentUserInfo = useAppSelector((state: RootState) => state.user.userInfo.value!);
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
    {currentUserInfo.isEditor ? button : null}
  </Stack>);
}

export default withFirebaseApi(EventViewerBase);
