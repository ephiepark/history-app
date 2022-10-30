import { Button, Grid, Stack } from "@mui/material";
import { useState } from "react";
import Timeline from "./Timeline";

export default () => {
  const [timelineKeys, setTimelineKeys] = useState<Array<string>>(['main']);
  const addTimelineButton = timelineKeys.length >= 3 ? null : <Button onClick={() => {
    setTimelineKeys([...timelineKeys, `${Math.floor(Date.now() / 1000)}`]);
  }}>Add Timeline</Button>;
  return <Stack>
    {addTimelineButton}
    <Grid container spacing={2}>
      {timelineKeys.map((timelineKey) => {
        return <Grid key={timelineKey} item xs={Math.floor(12 / timelineKeys.length)}>
          <Stack>
            <Button onClick={() => {
              setTimelineKeys(timelineKeys.filter((timelineKeyIt) => timelineKeyIt !== timelineKey))
            }}>Remove</Button>
            <Timeline />
          </Stack>
        </Grid>;
      })}
    </Grid>
  </Stack>;
};
