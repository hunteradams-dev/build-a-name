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
import { THEME_MODES, useColorMode } from "./context/ThemeContext";

function App() {
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [savedNames, setSavedNames] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedNames");
    return saved ? JSON.parse(saved) : [];
  });
  const [announcement, setAnnouncement] = useState<string>("");

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
      startingLetters: [""] as string[],
    },
    onSubmit: async ({ value }) => {
      const names: string[] = [];
      const validStartingLetters = value.startingLetters.filter(
        (l) => l.trim().length > 0
      );
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
              startingLetters:
                validStartingLetters.length > 0
                  ? validStartingLetters
                  : undefined,
            }
          )
        );
      }
      setGeneratedNames(names);
      setAnnouncement(`Generated ${names.length} new ${value.nameType} names`);
    },
  });

  const { mode, toggleColorMode } = useColorMode();

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to generate names
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        form.handleSubmit();
      }
      // Ctrl/Cmd + K to toggle theme
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        toggleColorMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [form, toggleColorMode]);

  // useEffect(() => {
  //   localStorage.setItem("savedNames", JSON.stringify(savedNames));
  // }, [savedNames]);

  const toggleSave = (name: string) => {
    const isSaved = savedNames.includes(name);
    const updatedNames = isSaved
      ? savedNames.filter((n) => n !== name)
      : [...savedNames, name];
    setSavedNames(updatedNames);
    setAnnouncement(
      isSaved
        ? `Removed ${name} from saved names`
        : `Saved ${name} to favorites`
    );
  };

  const clearSaved = () => {
    const count = savedNames.length;
    setSavedNames([]);
    setAnnouncement(`Cleared ${count} saved names`);
  };

  const maxNameLength = generatedNames.reduce(
    (max, name) => Math.max(max, name.length),
    0
  );
  // Calculate min width based on char count (approx 1ch = 8-10px) + padding/icon
  const minColumnWidth = Math.max(140, maxNameLength * 10 + 80);

  return (
    <>
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          left: "-10000px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        {announcement}
      </div>

      <Container
        maxWidth="md"
        sx={{ py: 4 }}
        component="main"
        role="main"
        aria-label="Name Generator Application"
        id="main-content"
      >
        {" "}
        <Box
          component="header"
          role="banner"
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
          <Tooltip
            title={`Switch to ${
              mode === THEME_MODES.dark ? "light" : "dark"
            } mode (Ctrl+K or Cmd+K)`}
            arrow
          >
            <IconButton
              onClick={toggleColorMode}
              color="inherit"
              aria-label={`Switch to ${
                mode === THEME_MODES.dark ? "light" : "dark"
              } mode. Keyboard shortcut: Ctrl+K or Cmd+K`}
            >
              {mode === THEME_MODES.dark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
        </Box>
        <Accordion
          defaultExpanded
          sx={{ mb: 4 }}
          aria-label="Name generator configuration settings"
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-label="Expand or collapse generator settings"
          >
            <Typography variant="h6">Generator Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              <form.Field
                name="nameType"
                children={(field) => (
                  <FormControl fullWidth>
                    <InputLabel id="name-type-label">Type</InputLabel>
                    <Select
                      value={field.state.value}
                      label="Type"
                      labelId="name-type-label"
                      aria-label="Select the type of name to generate"
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
                    <Accordion
                      variant="outlined"
                      sx={{ mt: 2 }}
                      aria-label="Place name suffix options"
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-label="Expand or collapse suffix options"
                      >
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
                                      inputProps={{
                                        "aria-label":
                                          "Include natural suffixes like -land, -wood, -dale, -river",
                                      }}
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
                                      inputProps={{
                                        "aria-label":
                                          "Include man-made suffixes like -burg, -town, -ford, -port",
                                      }}
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
                                      inputProps={{
                                        "aria-label":
                                          "Include generic suffixes like -ia, -on, -us, -um",
                                      }}
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
                                      inputProps={{
                                        "aria-label":
                                          "Include continent-style suffixes like -ica, -ea, -ope",
                                      }}
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
                              <Box
                                key={index}
                                sx={{ mb: numWords > 1 ? 2 : 0 }}
                              >
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
                                  aria-label={
                                    numWords > 1
                                      ? `Number of syllables for word ${
                                          index + 1
                                        }`
                                      : "Number of syllables"
                                  }
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
                      aria-label="Number of words per generated name"
                      onChange={(_, value) =>
                        field.handleChange(value as number)
                      }
                    />
                  </Box>
                )}
              />

              <Accordion
                variant="outlined"
                sx={{ mt: 2 }}
                aria-label="Additional name generation options"
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-label="Expand or collapse additional settings"
                >
                  <Typography>Additional Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <form.Subscribe
                      selector={(state) => state.values.numWords}
                      children={(numWords) => (
                        <form.Field
                          name="startingLetters"
                          children={(field) => {
                            const values = Array.isArray(field.state.value)
                              ? field.state.value
                              : [field.state.value as string];

                            return (
                              <Box>
                                <Typography gutterBottom>
                                  Starting Letters (optional)
                                  <Tooltip
                                    title="Specify the first letter for each word. Leave blank for any letter."
                                    arrow
                                  >
                                    <InfoOutlined
                                      fontSize="small"
                                      sx={{
                                        ml: 0.5,
                                        opacity: 0.6,
                                        verticalAlign: "middle",
                                      }}
                                      aria-label="Information about starting letters"
                                      role="img"
                                    />
                                  </Tooltip>
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {Array.from({ length: numWords }).map(
                                    (_, index) => {
                                      const val = values[index] ?? "";
                                      return (
                                        <FormControl
                                          key={index}
                                          sx={{ minWidth: 100 }}
                                        >
                                          <InputLabel size="small">
                                            {numWords > 1
                                              ? `Word ${index + 1}`
                                              : "Letter"}
                                          </InputLabel>
                                          <Select
                                            size="small"
                                            value={val}
                                            label={
                                              numWords > 1
                                                ? `Word ${index + 1}`
                                                : "Letter"
                                            }
                                            aria-label={
                                              numWords > 1
                                                ? `Starting letter for word ${
                                                    index + 1
                                                  }`
                                                : "Starting letter"
                                            }
                                            onChange={(e) => {
                                              const newValues = [...values];
                                              while (
                                                newValues.length <= index
                                              ) {
                                                newValues.push("");
                                              }
                                              newValues[index] = e.target.value;
                                              field.handleChange(newValues);
                                            }}
                                          >
                                            <MenuItem value="">Any</MenuItem>
                                            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                                              .split("")
                                              .map((letter) => (
                                                <MenuItem
                                                  key={letter}
                                                  value={letter}
                                                >
                                                  {letter}
                                                </MenuItem>
                                              ))}
                                          </Select>
                                        </FormControl>
                                      );
                                    }
                                  )}
                                </Box>
                              </Box>
                            );
                          }}
                        />
                      )}
                    />

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
                                  inputProps={{
                                    "aria-label":
                                      "Use hyphens between words in multi-word names",
                                  }}
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
                                <InputLabel id="gender-association-label">
                                  Gender Association
                                </InputLabel>
                                <Select
                                  value={field.state.value}
                                  label="Gender Association"
                                  labelId="gender-association-label"
                                  aria-label="Select gender association for person names"
                                  onChange={(e) =>
                                    field.handleChange(e.target.value as any)
                                  }
                                >
                                  <MenuItem value="any">Any</MenuItem>
                                  <MenuItem value="masculine">
                                    Masculine
                                  </MenuItem>
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
                                          inputProps={{
                                            "aria-label":
                                              'Include prepositions like "of" or "the" in multi-word place names',
                                          }}
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
                                      inputProps={{
                                        "aria-label":
                                          "Convert place names to demonyms (names for residents of a place)",
                                      }}
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
                                          aria-label="Information about demonyms"
                                          role="img"
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
                      aria-label="Number of names to generate"
                      onChange={(_, value) =>
                        field.handleChange(value as number)
                      }
                    />
                  </Box>
                )}
              />

              <Button
                variant="contained"
                size="large"
                onClick={form.handleSubmit}
                fullWidth
                aria-label="Generate names based on current settings. Keyboard shortcut: Ctrl+Enter or Cmd+Enter"
                title="Generate names (Ctrl+Enter or Cmd+Enter)"
              >
                Generate Names
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={2}
              sx={{ p: 2, height: "100%" }}
              component="section"
              role="region"
              aria-label="Generated names"
              aria-live="polite"
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${minColumnWidth}px), 1fr))`,
                  gap: 1,
                }}
                role="list"
                aria-label={`${generatedNames.length} generated names`}
              >
                {generatedNames.map((name, index) => (
                  <Paper
                    key={`${name}-${index}`}
                    variant="outlined"
                    sx={{
                      p: 1,
                      pl: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    role="listitem"
                  >
                    <Typography noWrap title={name} component="span">
                      {name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => toggleSave(name)}
                      color={savedNames.includes(name) ? "error" : "default"}
                      aria-label={
                        savedNames.includes(name)
                          ? `Remove ${name} from saved names`
                          : `Save ${name} to favorites`
                      }
                      title={
                        savedNames.includes(name)
                          ? `Remove ${name} from saved names`
                          : `Save ${name} to favorites`
                      }
                    >
                      {savedNames.includes(name) ? (
                        <Favorite fontSize="small" />
                      ) : (
                        <FavoriteBorder fontSize="small" />
                      )}
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            </Paper>
          </Grid>

          {savedNames.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper
                elevation={2}
                sx={{ p: 2, height: "100%" }}
                component="section"
                role="region"
                aria-label="Saved names"
                aria-live="polite"
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" component="h2">
                    Saved Names ({savedNames.length})
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={clearSaved}
                    aria-label={`Clear all ${savedNames.length} saved names`}
                  >
                    Clear
                  </Button>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <List dense aria-label="List of saved favorite names">
                  {savedNames.map((name, index) => (
                    <ListItem
                      key={`${name}-${index}`}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => toggleSave(name)}
                          color="error"
                          aria-label={`Remove ${name} from saved names`}
                          title={`Remove ${name} from saved names`}
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
    </>
  );
}

export default App;
