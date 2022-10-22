import { Typography, TextField, Autocomplete, Button, Stack, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { eventTags, EventWithId, Event } from "../../types";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useNavigate } from 'react-router-dom';

const ImageSelector = (props: {
  onImageSelect: (file: File | null) => void,
}) => {
  return (<>
    <Button variant="contained" component="label">
      Select Image
      <input hidden accept="image/*" onChange={(e) => {
        const files = e.target.files;
        if (files == null || files.length === 0) {
          props.onImageSelect(null);
        } else {
          props.onImageSelect(files[0]);
        }
      }} type="file" />
    </Button>
  </>);
};

const EventEditModeBase = (props: {
  eventId: string | null,
  onClick: (eventId: string) => void,
} & WithFirebaseApiProps) => {
  const userId = useAppSelector((state: RootState) => state.user.userId);
  const [event, setEvent] = useState<EventWithId | null>(null);
  const [title, setTitle] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('');
  const [tags, setTags] = useState<Array<string>>([]);
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (props.eventId === null) {
      return;
    }
    props.firebaseApi.asyncGetEvent(props.eventId).then((event: EventWithId | null) => {
      setEvent(event);
      setTitle(event?.title ?? '');
      setEventTime(event?.eventTime ?? '');
      setTags(event?.tags ?? []);
      setDescription(event?.description ?? '');
    });
  }, [props.eventId]);

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

  if (props.eventId !== null && (event === null || imageUrl === undefined)) {
    return <CircularProgress />;
  }

  const content = props.eventId === null ? 'Add new event' : 'Edit event';
  const handleSubmit = async () => {
    console.log(description);
    let imageHandle = null;
    if (file !== null) {
      imageHandle = await props.firebaseApi.asyncUploadImage(userId!, file);
    }
    if (props.eventId === null) {
      const event = await props.firebaseApi.asyncCreateEvent({
        title,
        description,
        eventTime,
        tags,
        userId: userId!,
        createdTime: Math.floor(Date.now() / 1000),
        imageHandle: imageHandle,
      });
      props.onClick(event.id);
    } else {
      let editedEvent: Partial<Event> = {
        title,
        description,
        eventTime,
        tags,
        userId: userId!,
      };
      if (imageHandle !== null) {
        editedEvent.imageHandle = imageHandle;
      }
      const event = await props.firebaseApi.asyncUpdateEvent(props.eventId, editedEvent);
      props.onClick(props.eventId);
    }
  };

  let image = null;
  if (imageUrl) {
    image = <img src={imageUrl} width={200} />;
  }
  return (
    <Stack spacing={2}>
      <Typography>{content}</Typography>
      {image}
      <TextField
        id="title"
        label="Title"
        variant="outlined"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="date"
        label="Event Date"
        type="date"
        sx={{ width: 220 }}
        InputLabelProps={{
          shrink: true,
        }}
        value={eventTime}
        onChange={(e) => {
          setEventTime(e.target.value);
        }}
      />
      <Autocomplete
        multiple
        id="tags-outlined"
        options={eventTags}
        filterSelectedOptions
        value={tags}
        onChange={(_e, v) => {
          setTags(v);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="tags"
            placeholder="Tags"
          />
        )}
      />
      <TextField
        id="outlined-textarea"
        label="Event Description"
        placeholder="Event Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        multiline
      />
      <ImageSelector onImageSelect={(file) => {
        setFile(file);
        if (file === null) {
          // TODO set it back to original event image
        } else {
          setImageUrl(URL.createObjectURL(file));
        }
      }} />
      <Button variant="contained" onClick={handleSubmit}>Submit</Button>
    </Stack>
  );
};

export const EventEditMode = withFirebaseApi(EventEditModeBase);

const EventEditorBase = (props: {
}) => {
  const navigate = useNavigate();

  return (<>
    <EventEditMode eventId={null} onClick={(eventId: string) => navigate(`/event/${eventId}`)} />
  </>);
};

export default withFirebaseApi(EventEditorBase);
