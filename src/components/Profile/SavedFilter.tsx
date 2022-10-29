import { Autocomplete, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { getTagsFromIds, SavedFilterTagIdsWithId } from "../../types";
import { Link } from 'react-router-dom';

const SavedFilterBase = (props: WithFirebaseApiProps) => {
  const tags = useAppSelector((state: RootState) => state.tag.tags.value!);
  const userId = useAppSelector((state: RootState) => state.user.userId!);
  const [savedFilterTagIdsList, setSavedFilterTagIdsList] = useState<Array<SavedFilterTagIdsWithId> | null>(null);

  useEffect(() => {
    props.firebaseApi.asyncGetAllSavedFilterTagIds(userId)
      .then((savedFilterTagIdsList) => setSavedFilterTagIdsList(savedFilterTagIdsList));
  }, [userId]);

  if (savedFilterTagIdsList == null) {
    return (<CircularProgress />);
  }
  return <>
    <Typography>Saved Filter</Typography>
    <Stack>
      {savedFilterTagIdsList.map((savedFilterTagIds) => {
        return <Stack direction="row">
          <Autocomplete
            multiple
            key={savedFilterTagIds.id}
            filterSelectedOptions
            options={tags}
            value={getTagsFromIds(tags, savedFilterTagIds.tagIds)}
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
          <Button component={Link} to={`/savedFilterTagIds/${savedFilterTagIds.id}`} color="inherit">검색</Button>
        </Stack>
      })}
    </Stack>
  </>;
};

export default withFirebaseApi(SavedFilterBase);
