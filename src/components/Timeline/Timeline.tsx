import { Autocomplete, CircularProgress, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { EventWithId, TagWithId } from "../../types";
import EventCard from "../Event/EventCard";

const TimelineBase = (props: WithFirebaseApiProps) => {
  const tags = useAppSelector((state: RootState) => state.tag.tags.value!);
  const [events, setEvents] = useState<null | Array<EventWithId>>(null);
  const [filterTags, setFilterTags] = useState<Array<TagWithId>>(tags);
  useEffect(() => {
    setEvents(null);
    if (tags.length > 0) {
      props.firebaseApi.asyncGetTimeline(tags.map((tag) => tag.id)).then((events) => setEvents(events));
    }
  }, [tags]);
  let body = null;
  if (tags.length === 0) {
    body = <Typography>There needs to be at least one tag</Typography>;
  } else if (events === null) {
    body = <CircularProgress />;
  } else {
    body = events.map((event) => <EventCard key={event.id} event={event} />);
  }
  return <Stack spacing={2}>
    <Autocomplete
      multiple
      id="tags-outlined"
      options={tags}
      filterSelectedOptions
      value={filterTags}
      onChange={(_e, v) => {
        setFilterTags(v);
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
