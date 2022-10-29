import { Autocomplete, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { EventWithId, getTagsFromIds, TagWithId } from "../../types";
import EventCard from "../Event/EventCard";

const TimelineBase = (props: WithFirebaseApiProps) => {
  const currentUserId = useAppSelector((state: RootState) => state.user.userId!);
  const tags = useAppSelector((state: RootState) => state.tag.tags.value!);
  const [events, setEvents] = useState<null | Array<EventWithId>>(null);
  const [filterTags, setFilterTags] = useState<Array<TagWithId> | null>(null);
  const params = useParams();

  useEffect(() => {
    if (params.savedFilterTagIdsId == null) {
      setFilterTags(tags);
      return;
    }
    props.firebaseApi.asyncGetSavedFilterTagIds(params.savedFilterTagIdsId).then((savedFilterTagIds) => {
      if (savedFilterTagIds == null) {
        return;
      }
      setFilterTags(getTagsFromIds(tags, savedFilterTagIds.tagIds));
    })
  }, [params.savedFilterTagIdsId]);
  useEffect(() => {
    setEvents(null);
    if (filterTags == null) {
      return;
    }
    if (filterTags.length > 0) {
      props.firebaseApi.asyncGetTimeline(filterTags.map((tag) => tag.id)).then((events) => setEvents(events));
    }
  }, [filterTags]);
  let body = null;
  if (filterTags == null) {
    return <CircularProgress />;
  }
  if (events === null) {
    body = <CircularProgress />;
  } else {
    body = events.map((event) => <EventCard key={event.id} event={event} />);
  }
  return <Stack spacing={2}>
    <Stack direction={'row'}>
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
        getOptionLabel={(option) => option.tagName}
      />
      <Button onClick={async () => {
        await props.firebaseApi.asyncCreateSavedFilterTagIds({
          tagIds: filterTags.map((tag) => tag.id),
          userId: currentUserId,
          createdTime: Math.floor(Date.now() / 1000),
        });
      }}>Save Filter</Button>
    </Stack>
    {body}
  </Stack>;
};

export default withFirebaseApi(TimelineBase);
