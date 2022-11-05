import { Autocomplete, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { getTagsFromIds, SavedFilterWithId } from "../../types";
import { Link } from 'react-router-dom';

const SavedFilterBase = (props: WithFirebaseApiProps) => {
  const tags = useAppSelector((state: RootState) => state.tag.tags.value!);
  const userId = useAppSelector((state: RootState) => state.user.userId!);
  const [savedFilterList, setSavedFilterList] = useState<Array<SavedFilterWithId> | null>(null);

  useEffect(() => {
    props.firebaseApi.asyncGetAllSavedFilters(userId)
      .then((savedFilters) => setSavedFilterList(savedFilters));
  }, [userId]);

  if (savedFilterList == null) {
    return (<CircularProgress />);
  }
  return <>
    <Typography>Saved Filter</Typography>
    <Stack>
      {savedFilterList.map((savedFilter) => {
        return (<Stack direction="row" key={savedFilter.id}>
          {savedFilter.savedFilters.map((filter, index) => {
            return (
              <Autocomplete
                multiple
                key={index}
                filterSelectedOptions
                options={tags}
                value={getTagsFromIds(tags, filter.tagIds)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="tags"
                    placeholder="Tags"
                  />
                )}
                getOptionLabel={(option) => option.tagName}
                readOnly
              />);
          })}
          <Button component={Link} to={`/savedFilter/${savedFilter.id}`} color="inherit">검색</Button>
        </Stack>);
      })}
    </Stack>
  </>;
};

export default withFirebaseApi(SavedFilterBase);
