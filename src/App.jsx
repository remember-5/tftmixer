import Credits from './components/Credits.jsx';
import MixerControls from './components/MixerControls.jsx';
import PresetList from './components/PresetList.jsx';
import TraitGrid from './components/TraitGrid.jsx';
import { useMixerPageModel } from './hooks/useMixerPageModel.js';

export default function App({ player }) {
  const pageModel = useMixerPageModel({ player });

  return (
    <div className="app-shell">
      <div className="background-image" />
      <div className="background-darken" />
      <h1>TFT Remix Rumble Music Mixer</h1>
      <h2>Select tracks to play. Layer multiple tracks together to create unique combinations.</h2>
      <MixerControls actions={pageModel.controls.actions} state={pageModel.controls.state} />
      <hr />
      <div className="layout">
        <div className="main-content">
          <TraitGrid selection={pageModel.selection} traits={pageModel.traits} />
        </div>
        <PresetList onApplyPreset={pageModel.selection.applySelection} presets={pageModel.presets} />
      </div>
      <Credits />
    </div>
  );
}
