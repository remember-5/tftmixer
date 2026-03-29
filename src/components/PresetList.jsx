import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMixerStore } from '../store/MixerStoreContext.jsx';

export default function PresetList({ presets }) {
  const applySelection = useMixerStore((state) => state.applySelection);

  return (
    <aside className="community-presets">
      <Card className="border-white/12 bg-black/35 text-white shadow-2xl backdrop-blur-xl">
        <CardHeader className="gap-2">
          <CardTitle className="text-xl text-white">Reddit Community Presets</CardTitle>
          <CardDescription className="text-zinc-300">
            Start with a community mix, then fine tune the trait layers from the grid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
        {presets.map((preset) => (
            <li key={preset.id}>
              <Button className="w-full justify-start border-white/10 bg-white/6 text-left text-zinc-100 hover:bg-white/12" onClick={() => applySelection(preset.trackIds)} type="button" variant="outline">
              {preset.name}
              </Button>
            </li>
        ))}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}
