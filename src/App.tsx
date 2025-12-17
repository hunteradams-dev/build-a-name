import { useState, useEffect, useMemo } from "react";
import { SyllableGenerator } from "./generators/SyllableGenerator";
import type { NameType } from "./generators/SyllableGenerator";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
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
} from "@mui/material";
import type { PaletteMode } from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Favorite,
  FavoriteBorder,
  Delete,
} from "@mui/icons-material";

function App() {
  const [nameType, setNameType] = useState<NameType>("place");
  const [numSyllables, setNumSyllables] = useState<number>(2);
  const [count, setCount] = useState<number>(10);
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [savedNames, setSavedNames] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedNames");
    return saved ? JSON.parse(saved) : [];
  });

  const [mode, setMode] = useState<PaletteMode>("dark");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    localStorage.setItem("savedNames", JSON.stringify(savedNames));
  }, [savedNames]);

  const handleGenerate = () => {
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(SyllableGenerator.generate(nameType, numSyllables));
    }
    setGeneratedNames(names);
  };

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Random Name Generator
          </Typography>
          <IconButton onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={nameType}
                label="Type"
                onChange={(e) => setNameType(e.target.value as NameType)}
              >
                <MenuItem value="place">Place</MenuItem>
                <MenuItem value="person">Person</MenuItem>
                <MenuItem value="creature">Creature</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography gutterBottom>Syllables: {numSyllables}</Typography>
              <Slider
                value={numSyllables}
                min={1}
                max={5}
                marks
                valueLabelDisplay="auto"
                onChange={(_, value) => setNumSyllables(value as number)}
              />
            </Box>

            <Box>
              <Typography gutterBottom>Count: {count}</Typography>
              <Slider
                value={count}
                min={1}
                max={50}
                valueLabelDisplay="auto"
                onChange={(_, value) => setCount(value as number)}
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={handleGenerate}
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
                          color={
                            savedNames.includes(name) ? "error" : "default"
                          }
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
    </ThemeProvider>
  );
}

export default App;
