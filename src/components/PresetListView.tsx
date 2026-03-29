import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PresetItem } from '@/types/mixer';

interface PresetListViewProps {
  onSelectPreset: (trackIds: string[]) => void;
  presetItems: PresetItem[];
}

export default function PresetListView({ onSelectPreset, presetItems }: PresetListViewProps) {
  return (
    <section>
      <Card className="preset-shelf-card gap-0 py-0">
        <CardHeader className="preset-shelf-header">
          <CardTitle>Reddit Community Presets</CardTitle>
          <CardDescription>Start from a community mix, then tweak the layers below.</CardDescription>
        </CardHeader>

        <div className="preset-shelf-content">
          <ul className="preset-shelf-scroll">
            {presetItems.map((preset: PresetItem) => (
              <li key={preset.id} className="preset-shelf-item">
                <Button
                  aria-label={preset.name}
                  aria-pressed={preset.active}
                  className={preset.active ? 'preset-chip preset-chip-active' : 'preset-chip'}
                  onClick={() => onSelectPreset(preset.trackIds)}
                  type="button"
                  variant={preset.active ? 'default' : 'outline'}
                >
                  <span>{preset.name}</span>
                  <Badge aria-hidden="true" className="preset-chip-meta" variant={preset.active ? 'default' : 'secondary'}>
                    {preset.trackIds.length} tracks
                  </Badge>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </section>
  );
}
