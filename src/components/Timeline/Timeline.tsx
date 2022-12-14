import { Autocomplete, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { EventWithId, Filter, getTagsFromIds, TagWithId } from "../../types";
import EventCard from "../Event/EventCard";

export interface EventWithTimelineMetadata {
  event: EventWithId;
  timelineMetadata: {
    timelineKey: string;
    index: number;
  };
};

export const TimelineViewer = (props: {
  spacing: number,
  columnSize: number,
  events: Array<EventWithTimelineMetadata>
  numTimeline: number,
}) => {
  return <>
    {props.events.map((event) => {
      const row = [];
      for (let i = 0; i < props.numTimeline; i++) {
        if (i !== event.timelineMetadata.index) {
          row.push(<Grid item key={i} xs={props.columnSize}></Grid>);
        } else {
          row.push(<Grid item key={i} xs={props.columnSize}>
            <EventCard event={event.event} />
          </Grid>);
        }
      }
      return (<Grid container spacing={props.spacing} key={`${event.timelineMetadata.timelineKey}-${event.event.id}`}>
        {row}
      </Grid>);
    })}
  </>;
};

const TimelineFilterBase = (props: {
  timelineKey: string,
  filter: Filter,
  setFilter: (timelineKey: string, filter: Filter) => void,
  setEvents: (timelineKey: string, events: null | Array<EventWithId>) => void,
} & WithFirebaseApiProps) => {
  const tags = useAppSelector((state: RootState) => state.tag.tags.value!);
  // const [filterTags, setFilterTags] = useState<Array<TagWithId>>(tags);

  useEffect(() => {
    props.setEvents(props.timelineKey, null);
    const filterTagIds = props.filter.tagIds.length == 0 ? tags.map((tag) => tag.id) : props.filter.tagIds;
    props.firebaseApi.asyncGetTimeline(filterTagIds).then((events) => {
      props.setEvents(props.timelineKey, events)
    });
  }, [props.filter]);

  return (
    <Autocomplete
      multiple
      options={tags}
      filterSelectedOptions
      value={getTagsFromIds(tags, props.filter.tagIds)}
      onChange={(_e, v) => {
        props.setFilter(props.timelineKey, {
          tagIds: v.map((tag) => tag.id),
        });
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
