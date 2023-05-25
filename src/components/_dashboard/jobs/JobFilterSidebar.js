import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Form, FormikProvider } from 'formik';
import closeFill from '@iconify/icons-eva/close-fill';
import roundClearAll from '@iconify/icons-ic/round-clear-all';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem
} from '@mui/material';
//
import Scrollbar from '../../Scrollbar';
import ColorManyPicker from '../../ColorManyPicker';

import axios from "axios";
import { useSnackbar } from "notistack";
import { apiInstance } from "src/utils/apiAuth";

// ----------------------------------------------------------------------

export const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' }
];
export const FILTER_GENDER_OPTIONS = ['Men', 'Women', 'Kids'];
export const FILTER_CATEGORY_OPTIONS = ['All', 'Shose', 'Apparel', 'Accessories'];
export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' }
];
export const FILTER_COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107'
];

// ----------------------------------------------------------------------

JobFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  formik: PropTypes.object
};

// const apiInstance = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/v1/",
//   timeout: 10000 
// });


export default function JobFilterSidebar({
  isOpenFilter,
  onResetFilter,
  onOpenFilter,
  onCloseFilter,
  formik
}) {
  
  const { values, getFieldProps, handleChange } = formik;
  const [locData, setlocData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getLocationsList()
  }, [])

  const getLocationsList = () => {

    apiInstance({
      method: "get",
      url: "office-locations/",
      headers: {
        Authorization: "token " + localStorage.getItem('candidateToken'),
      }
    })
      .then(function (response) {
          const locData = getDataArray(response.data.data)
          setlocData(locData)          
      })
      .catch(function (error) {
        enqueueSnackbar('Something went wrong. Please try after sometime.', {
          anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
            variant: 'error',
            autoHideDuration: 2000,  
          });
  
      });

  }

  const getDataArray = (locData) =>
  locData.map((locObj) => ({
      pk: locObj.id,
      office_loc: locObj.office_location,
      loc_status: locObj.is_active,
    }));


  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Icon icon={roundFilterList} />}
        onClick={onOpenFilter}
      >
        Filters &nbsp;
      </Button>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <Drawer
            anchor="right"
            open={isOpenFilter}
            onClose={onCloseFilter}
            PaperProps={{
              sx: { width: 280, border: 'none', overflow: 'hidden' }
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 1, py: 2 }}
            >
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                Add Data
              </Typography>
              <IconButton onClick={onCloseFilter}>
                <Icon icon={closeFill} width={20} height={20} />
              </IconButton>
            </Stack>

            <Divider />

            <Scrollbar>
              <Stack spacing={3} sx={{ p: 3 }}>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Technology
                  </Typography>
                  <FormGroup>

                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={""}
                    label="Age"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Python</MenuItem>
                    <MenuItem value={20}>Java</MenuItem>
                    <MenuItem value={30}>.NET</MenuItem>
                  </Select>

                    {/* {FILTER_GENDER_OPTIONS.map((item) => (
                      <FormControlLabel
                        key={item}
                        control={
                          <Checkbox
                            {...getFieldProps('gender')}
                            value={item}
                            checked={values.gender.includes(item)}
                          />
                        }
                        label={item}
                      />
                    ))} */}
                  </FormGroup>
                </div>

                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Location
                  </Typography>

                  <Select
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Location"
                    onChange={handleChange}
                  >
  
                    {/* <MenuItem value={10}>Python</MenuItem>
                    <MenuItem value={20}>Java</MenuItem>
                    <MenuItem value={30}>.NET</MenuItem> */}

                {locData.map((option) => (
                                <MenuItem key={option.pk} value={option.pk}>
                                  {option.office_loc}
                                </MenuItem>
                              ))}

                  </Select>
                  {/* <RadioGroup {...getFieldProps('category')}>
                    {FILTER_CATEGORY_OPTIONS.map((item) => (
                      <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
                    ))}
                  </RadioGroup> */}
                </div>

                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Category
                  </Typography>

                  <Select
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={""}
                    label="Age"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Python</MenuItem>
                    <MenuItem value={20}>Java</MenuItem>
                    <MenuItem value={30}>.NET</MenuItem>
                  </Select>
                  {/* <ColorManyPicker
                    name="colors"
                    colors={FILTER_COLOR_OPTIONS}
                    onChange={handleChange}
                    onChecked={(color) => values.colors.includes(color)}
                    sx={{ maxWidth: 36 * 4 }}
                  /> */}
                </div>

                <div>
                  {/* <Typography variant="subtitle1" gutterBottom>
                    Price
                  </Typography>
                  <RadioGroup {...getFieldProps('priceRange')}>
                    {FILTER_PRICE_OPTIONS.map((item) => (
                      <FormControlLabel
                        key={item.value}
                        value={item.value}
                        control={<Radio />}
                        label={item.label}
                      />
                    ))}
                  </RadioGroup> */}
                </div>

                <div>
                  {/* <Typography variant="subtitle1" gutterBottom>
                    Rating
                  </Typography>
                  <RadioGroup {...getFieldProps('rating')}>
                    {FILTER_RATING_OPTIONS.map((item, index) => (
                      <FormControlLabel
                        key={item}
                        value={item}
                        control={
                          <Radio
                            disableRipple
                            color="default"
                            icon={<Rating readOnly value={4 - index} />}
                            checkedIcon={<Rating readOnly value={4 - index} />}
                          />
                        }
                        label="& Up"
                        sx={{
                          my: 0.5,
                          borderRadius: 1,
                          '& > :first-of-type': { py: 0.5 },
                          '&:hover': {
                            opacity: 0.48,
                            '& > *': { bgcolor: 'transparent' }
                          },
                          ...(values.rating.includes(item) && {
                            bgcolor: 'background.neutral'
                          })
                        }}
                      />
                    ))}
                  </RadioGroup> */}
                </div>
              </Stack>
            </Scrollbar>

            <Box sx={{ p: 3 }}>
            <Button
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="outlined"
                onClick={onResetFilter}
                startIcon={<Icon icon={roundClearAll} />}
              >
                Apply Filters
              </Button>

              <Button
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="outlined"
                onClick={onResetFilter}
                startIcon={<Icon icon={roundClearAll} />}
              >
                Clear All
              </Button>
            </Box>
          </Drawer>
        </Form>
      </FormikProvider>
    </>
  );
}
