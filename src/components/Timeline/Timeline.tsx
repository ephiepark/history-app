import { Autocomplete, TextField} from "@mui/material";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { EventWithId, TagWithId } from "../../types";
import EventCard from "../Event/EventCard";

export interface EventWithTimelineMetadata {
  event: EventWithId;
  timelineMetadata: {
    timelineKey: string;
  };
};

export const TimelineViewer = (props: {
  events: Array<EventWithTimelineMetadata>
}) => {
  return <>
    {props.events.map((event) => <EventCard key={`${event.timelineMetadata.timelineKey}-${event.event.id}`} event={event.event} />)}
  </>;
};

const TimelineFilterBase = (props: {
  timelineKey: string,
  setEvents: (timelineKey: string, events: null | Array<EventWithId>) => void,
} & WithFirebaseApiProps) => {
  const tags = useAppSelector((state: RootState) => state.tag.tags.value!);
  const [filterTags, setFilterTags] = useState<Array<TagWithId>>(tags);

  useEffect(() => {
    console.log(filterTags);
    props.setEvents(props.timelineKey, null);
    if (filterTags == null) {
      return;
    }
    const filterTagIds = filterTags.length == 0 ? tags.map((tag) => tag.id) : filterTags.map((tag) => tag.id);
    props.firebaseApi.asyncGetTimeline(filterTagIds).then((events) => {
      props.setEvents(props.timelineKey, events)
    });
  }, [filterTags]);

  return (
    <Autocomplete
      multiple
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
  );
};

export const TimelineFilter = withFirebaseApi(TimelineFilterBase);
