# TFT Mixer Layout Refresh Design

## Summary

This design refresh keeps the current single-page mixer workflow and Zustand-backed behavior, but reorganizes the interface into a clearer "command deck + work surface" layout.

Chosen direction:

- Layout: `A2 / Command Deck`
- Visual style: `S1 / Studio Pulse`

The page should feel like a dark music workstation rather than a generic dashboard or a marketing landing page. The main design goal is to make the trait grid the primary workspace while keeping playback controls continuously reachable.

## Design Goals

- Make the page hierarchy obvious within the first screenful.
- Keep playback and session controls visible while users scroll through traits.
- Reduce visual competition between controls, presets, and trait cards.
- Preserve the current feature set and interaction model.
- Improve responsiveness without introducing horizontal scroll or cramped mobile controls.

## Layout

### Overall page structure

The page is divided into four vertical layers:

1. Compact hero
2. Main work area
3. Credits
4. Ambient background treatment

The hero remains at the top, but it should be visually tighter than the current version. Its job is to establish theme and explain the mixer in one short sentence, not to dominate the page.

### Main work area

Desktop uses a two-column `Command Deck` layout:

- Left column: sticky control deck
- Right column: preset shelf on top, trait grid below

The right column becomes the primary work surface. The left column remains visible during selection changes and scrolling so that volume, realtime mode, repeat mode, and playback actions are always within reach.

### Preset shelf

Presets move out of a tall sidebar rail and become a horizontal shelf above the trait grid. This changes their role from "secondary panel competing for equal weight" to "quick-start row".

Preset presentation rules:

- Compact horizontal chips or small cards
- Clearly tappable but visually lighter than primary playback actions
- One visible active state when the current selection comes from a preset
- Horizontal overflow allowed on narrow screens

### Trait grid

The trait grid is the largest visual area on the page and the primary focus of the interface.

Grid behavior:

- Desktop: fixed, stable card rhythm rather than purely fluid `auto-fit`
- Tablet: fewer columns with consistent spacing
- Mobile: single-column or comfortable two-column layout only when cards remain readable

Trait card behavior:

- Neutral default state
- Mild hover elevation and border brightening
- Strong selected state when any track inside the card is active
- Track-level selected states must affect checkbox, label, and phase badge together

## Component Design

### Hero

The hero should contain:

- Small label overline
- Page title
- One-line usage guidance
- One small supporting badge or contextual note

The hero should not contain dense controls, multiple CTAs, or large decorative copy blocks.

### Control deck

The left control deck is a sticky vertical stack of grouped sections:

1. `Playback`
   - Play selected tracks
   - Stop all music
2. `Session`
   - Volume
   - Realtime toggle
   - Repeat toggle
3. `Utilities`
   - Random select all
   - Random early
   - Random late
   - Clear selection
   - Copy share link
   - Tweet mix

Grouping rules:

- Primary actions are visually stronger than utility actions
- Buttons must not all share the same emphasis
- Loading and success notices live inside the control deck rather than floating elsewhere on the page

### Preset shelf

Each preset item should show:

- Preset name
- Optional small supporting metadata line if space allows

Preset shelf should visually read as a fast-access strip, not a second control panel.

### Trait cards

Each trait card should contain:

- Trait icon
- Trait name
- Small section label
- Track rows

Track rows should be easy to scan and should not rely only on the checkbox to communicate state.

## Visual System

### Chosen style: Studio Pulse

The visual language is a dark, polished music workstation.

Core mood:

- Controlled
- Atmospheric
- Nighttime studio
- Energetic without neon overload

### Color direction

Primary palette:

- Background: dark indigo / deep night blue
- Surface: slightly lighter blue-violet panels
- Accent: waveform green for key actions and active states
- Secondary accent: cool violet-blue for borders, focus, and structure

Rules:

- Green is reserved for the most important affirmative actions and live active states
- Violet-blue is structural, not dominant
- Decorative glow should be subtle and limited
- Contrast must remain comfortably readable in all primary panels

### Typography

Typography should feel musical and modern but remain readable in a dense tool context.

Rules:

- Display typography with more character for hero and section headers
- Clean, readable body type for controls and track labels
- Labels and metadata can use tighter uppercase styling, but body content should not
- No techno monospace body treatment

### Shape and elevation

- Rounded panels with disciplined radius scale
- Soft glass/studio-surface feel rather than glossy sci-fi chrome
- Elevation used to separate sections, not to create spectacle

## Responsive Behavior

### Desktop

- Sticky left control deck
- Right column contains preset shelf and trait grid
- Trait grid uses stable card widths

### Tablet

- Same information order
- Narrower left deck
- Preset shelf remains above trait grid
- Cards keep readable spacing and label length

### Mobile

Vertical order becomes:

1. Hero
2. Control deck
3. Preset shelf
4. Trait grid
5. Credits

Mobile rules:

- Main playback buttons appear before utility actions
- Presets remain horizontally scrollable
- No horizontal page scroll
- Touch targets remain comfortable for repeated tapping

## Interaction Rules

- Playback controls must remain easier to find than random/share utilities.
- Trait selection must create immediate visual feedback at both row and card level.
- Copy/share success state appears inline within the control deck.
- Loading state appears within the playback area, not detached from the triggering action.
- Motion should stay light and meaningful: hover, active, and state transitions only.

## Acceptance Criteria

- First-screen hierarchy clearly separates hero, control deck, preset shelf, and trait workspace.
- Desktop users can scroll the trait grid while keeping control deck actions visible.
- Presets feel like quick-start shortcuts, not a competing sidebar.
- Selected tracks are visually obvious without inspecting individual checkboxes.
- The page remains readable and touch-friendly on mobile and tablet.
- No horizontal overflow appears at standard breakpoints.

## Out of Scope

- No change to mixer feature behavior or store architecture.
- No new gameplay/music features.
- No multi-page navigation redesign.
- No full brand overhaul beyond this page-level visual refresh.
