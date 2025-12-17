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
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Favorite,
  FavoriteBorder,
  Delete,
} from "@mui/icons-material";
import { NAME_TYPES } from "./utils";
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
      numSyllables: 2,
      numWords: 1,
      hyphenated: false,
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
            value.hyphenated
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
          Make A Name For Yourself
        </Typography>
        <IconButton onClick={toggleColorMode} color="inherit">
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
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

          <form.Field
            name="numSyllables"
            children={(field) => (
              <Box>
                <Typography gutterBottom>
                  Syllables: {field.state.value}
                </Typography>
                <Slider
                  value={field.state.value}
                  min={1}
                  max={5}
                  marks
                  valueLabelDisplay="auto"
                  onChange={(_, value) => field.handleChange(value as number)}
                />
              </Box>
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
                        onChange={(e) => field.handleChange(e.target.checked)}
                        disabled={numWords === 1}
                      />
                    }
                    label="Hyphenated"
                  />
                )}
              />
            )}
          />

          <form.Field
            name="count"
            children={(field) => (
              <Box>
                <Typography gutterBottom>Count: {field.state.value}</Typography>
                <Slider
                  value={field.state.value}
                  min={1}
                  max={50}
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
      </Paper>

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
