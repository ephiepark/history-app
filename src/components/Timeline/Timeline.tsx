import { Autocomplete, CircularProgress, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { eventTags, EventWithId } from "../../types";
import EventCard from "../Event/EventCard";

const TimelineBase = (props: WithFirebaseApiProps) => {
  const [events, setEvents] = useState<null | Array<EventWithId>>(null);
  const [tags, setTags] = useState<Array<string>>(eventTags);
  useEffect(() => {
    setEvents(null);
    if (tags.length > 0) {
      props.firebaseApi.asyncGetTimeline(tags).then((events) => setEvents(events));
    }
  }, [tags]);
  if (tags.length === 0) {
    return <Typography>There needs to be at least one tag</Typography>;
  }
  const body = events === null ? <CircularProgress /> : events.map((event) => <EventCard key={event.id} event={event} />);
  return <Stack spacing={2}>
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
    {body}
  </Stack>;
};

export default withFirebaseApi(TimelineBase);
