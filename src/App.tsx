import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { SyllableGenerator } from "./generators/SyllableGenerator";
import type { NameType } from "./generators/SyllableGenerator";
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Grid,
  Divider,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Favorite,
  FavoriteBorder,
  Delete,
  ExpandMore,
  InfoOutlined,
} from "@mui/icons-material";
import { APP_TITLE, DEMONYM_EXPLAINER, NAME_TYPES } from "./utils";
import { useColorMode } from "./context/ThemeContext";

function App() {
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [savedNames, setSavedNames] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedNames");
    return saved ? JSON.parse(saved) : [];
  });

  const form = useForm({
    defaultValues: {
      nameType: "place" as NameType,
      numSyllables: [2],
      numWords: 1,
      hyphenated: false,
      demonym: false,
      includeNatural: true,
      includeManMade: true,
      includeGeneric: true,
      includeContinent: false,
      includePrepositions: false,
      gender: "any" as "masculine" | "feminine" | "neutral" | "any",
      count: 10,
    },
    onSubmit: async ({ value }) => {
      const names: string[] = [];
      for (let i = 0; i < value.count; i++) {
        names.push(
          SyllableGenerator.generate(
            value.nameType,
            value.numSyllables,
            value.numWords,
            value.hyphenated,
            value.demonym,
            {
              includeNatural: value.includeNatural,
              includeArtificial: value.includeManMade,
              includeGeneric: value.includeGeneric,
              includeContinent: value.includeContinent,
              includePrepositions: value.includePrepositions,
              gender: value.gender,
            }
          )
        );
      }
      setGeneratedNames(names);
    },
  });

  const { mode, toggleColorMode } = useColorMode();

  useEffect(() => {
    localStorage.setItem("savedNames", JSON.stringify(savedNames));
  }, [savedNames]);

  const toggleSave = (name: string) => {
    if (savedNames.includes(name)) {
      setSavedNames(savedNames.filter((n) => n !== name));
    } else {
      setSavedNames([...savedNames, name]);
    }
  };

  const clearSaved = () => {
    setSavedNames([]);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ fontFamily: "Prata" }}
        >
          {APP_TITLE}
        </Typography>
        <IconButton onClick={toggleColorMode} color="inherit">
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>

      <Accordion defaultExpanded sx={{ mb: 4 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Generator Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            <form.Field
              name="nameType"
              children={(field) => (
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={field.state.value}
                    label="Type"
                    onChange={(e) =>
                      field.handleChange(e.target.value as NameType)
                    }
                  >
                    {NAME_TYPES.map((n, i) => (
                      <MenuItem key={`${n}_at_${i}`} value={n.toLowerCase()}>
                        {n}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <form.Subscribe
              selector={(state) => state.values.nameType}
              children={(nameType) =>
                nameType === "place" || nameType === "all" ? (
                  <Accordion variant="outlined" sx={{ mt: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Suffix Options</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(130px, 1fr))",
                          gap: 1,
                        }}
                      >
                        <form.Field
                          name="includeNatural"
                          children={(field) => (
                            <Tooltip
                              title="Includes nature-based endings like -land, -wood, -dale, -river"
                              arrow
                              placement="top"
                            >
                              <FormControlLabel
                                sx={{ whiteSpace: "nowrap" }}
                                control={
                                  <Switch
                                    checked={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.checked)
                                    }
                                  />
                                }
                                label="Natural"
                              />
                            </Tooltip>
                          )}
                        />
                        <form.Field
                          name="includeManMade"
                          children={(field) => (
                            <Tooltip
                              title="Includes constructed endings like -burg, -town, -ford, -port"
                              arrow
                              placement="top"
                            >
                              <FormControlLabel
                                sx={{ whiteSpace: "nowrap" }}
                                control={
                                  <Switch
                                    checked={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.checked)
                                    }
                                  />
                                }
                                label="Man-Made"
                              />
                            </Tooltip>
                          )}
                        />
                        <form.Field
                          name="includeGeneric"
                          children={(field) => (
                            <Tooltip
                              title="Includes abstract endings like -ia, -on, -us, -um"
                              arrow
                              placement="top"
                            >
                              <FormControlLabel
                                sx={{ whiteSpace: "nowrap" }}
                                control={
                                  <Switch
                                    checked={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.checked)
                                    }
                                  />
                                }
                                label="Generic"
                              />
                            </Tooltip>
                          )}
                        />
                        <form.Field
                          name="includeContinent"
                          children={(field) => (
                            <Tooltip
                              title="Includes continent-style endings like -ica, -ea, -ope"
                              arrow
                              placement="top"
                            >
                              <FormControlLabel
                                sx={{ whiteSpace: "nowrap" }}
                                control={
                                  <Switch
                                    checked={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.checked)
                                    }
                                  />
                                }
                                label="Continent"
                              />
                            </Tooltip>
                          )}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ) : null
              }
            />

            <form.Subscribe
              selector={(state) => state.values.numWords}
              children={(numWords) => (
                <form.Field
                  name="numSyllables"
                  children={(field) => {
                    const values = Array.isArray(field.state.value)
                      ? field.state.value
                      : [field.state.value as number];

                    return (
                      <Box>
                        {Array.from({ length: numWords }).map((_, index) => {
                          const val =
                            values[index] ?? values[values.length - 1] ?? 2;
                          return (
                            <Box key={index} sx={{ mb: numWords > 1 ? 2 : 0 }}>
                              <Typography gutterBottom>
                                {numWords > 1
                                  ? `Word ${index + 1} Syllables`
                                  : "Syllables"}
                                : {val}
                              </Typography>
                              <Slider
                                value={val}
                                min={1}
                                max={5}
                                marks
                                valueLabelDisplay="auto"
                                onChange={(_, newValue) => {
                                  const newValues = [...values];
                                  // Ensure array is long enough
                                  while (newValues.length <= index) {
                                    newValues.push(
                                      newValues[newValues.length - 1] ?? 2
                                    );
                                  }
                                  newValues[index] = newValue as number;
                                  field.handleChange(newValues);
                                }}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    );
                  }}
                />
              )}
            />

            <form.Field
              name="numWords"
              children={(field) => (
                <Box>
                  <Typography gutterBottom>
                    Words per Name: {field.state.value}
                  </Typography>
                  <Slider
                    value={field.state.value}
                    min={1}
                    max={3}
                    marks
                    valueLabelDisplay="auto"
                    onChange={(_, value) => field.handleChange(value as number)}
                  />
                </Box>
              )}
            />

            <Accordion variant="outlined" sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Additional Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <form.Subscribe
                    selector={(state) => state.values.numWords}
                    children={(numWords) => (
                      <form.Field
                        name="hyphenated"
                        children={(field) => (
                          <FormControlLabel
                            control={
                              <Switch
                                checked={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.checked)
                                }
                                disabled={numWords === 1}
                              />
                            }
                            label="Hyphenated"
                          />
                        )}
                      />
                    )}
                  />

                  <form.Subscribe
                    selector={(state) => state.values.nameType}
                    children={(nameType) =>
                      nameType === "person" ? (
                        <form.Field
                          name="gender"
                          children={(field) => (
                            <FormControl fullWidth>
                              <InputLabel>Gender Association</InputLabel>
                              <Select
                                value={field.state.value}
                                label="Gender Association"
                                onChange={(e) =>
                                  field.handleChange(e.target.value as any)
                                }
                              >
                                <MenuItem value="any">Any</MenuItem>
                                <MenuItem value="masculine">Masculine</MenuItem>
                                <MenuItem value="feminine">Feminine</MenuItem>
                                <MenuItem value="neutral">Neutral</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      ) : null
                    }
                  />

                  <form.Subscribe
                    selector={(state) => state.values.nameType}
                    children={(nameType) =>
                      nameType === "place" || nameType === "all" ? (
                        <>
                          <form.Subscribe
                            selector={(state) => state.values.numWords}
                            children={(numWords) => (
                              <form.Field
                                name="includePrepositions"
                                children={(field) => (
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={field.state.value}
                                        onChange={(e) =>
                                          field.handleChange(e.target.checked)
                                        }
                                        disabled={numWords === 1}
                                      />
                                    }
                                    label="Include Prepositions"
                                  />
                                )}
                              />
                            )}
                          />

                          <form.Field
                            name="demonym"
                            children={(field) => (
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.checked)
                                    }
                                  />
                                }
                                label={
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    Convert to Demonym
                                    <Tooltip title={DEMONYM_EXPLAINER}>
                                      <InfoOutlined
                                        fontSize="small"
                                        sx={{ ml: 1, opacity: 0.6 }}
                                      />
                                    </Tooltip>
                                  </Box>
                                }
                              />
                            )}
                          />
                        </>
                      ) : null
                    }
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>

            <form.Field
              name="count"
              children={(field) => (
                <Box>
                  <Typography gutterBottom>
                    Count: {field.state.value}
                  </Typography>
                  <Slider
                    value={field.state.value}
                    min={1}
                    max={100}
                    valueLabelDisplay="auto"
                    onChange={(_, value) => field.handleChange(value as number)}
                  />
                </Box>
              )}
            />

            <Button
              variant="contained"
              size="large"
              onClick={form.handleSubmit}
              fullWidth
            >
              Generate Names
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Generated Names
            </Typography>
            {generatedNames.length > 0 ? (
              <List dense>
                {generatedNames.map((name, index) => (
                  <ListItem
                    key={`${name}-${index}`}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => toggleSave(name)}
                        color={savedNames.includes(name) ? "error" : "default"}
                      >
                        {savedNames.includes(name) ? (
                          <Favorite />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>
                    }
                  >
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Click generate to see names
              </Typography>
            )}
          </Paper>
        </Grid>

        {savedNames.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6">
                  Saved Names ({savedNames.length})
                </Typography>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={clearSaved}
                >
                  Clear
                </Button>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <List dense>
                {savedNames.map((name, index) => (
                  <ListItem
                    key={`${name}-${index}`}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => toggleSave(name)}
                        color="error"
                      >
                        <Favorite />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default App;
