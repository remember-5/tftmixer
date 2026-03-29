import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PresetItem } from '@/types/mixer';

interface PresetListViewProps {
  onSelectPreset: (trackIds: string[]) => void;
  presetItems: PresetItem[];
}

export default function PresetListView({ onSelectPreset, presetItems }: PresetListViewProps) {
  return (
    <ul aria-label="Community presets" className="preset-quick-list">
      {presetItems.map((preset: PresetItem) => (
        <li key={preset.id} className="preset-quick-item">
          <Button
            aria-label={preset.name}
            aria-pressed={preset.active}
            className={cn('preset-quick-button', preset.active && 'preset-quick-button-active')}
            onClick={() => onSelectPreset(preset.trackIds)}
            type="button"
            variant="outline"
          >
            <span className="preset-quick-copy">
              <span className="preset-quick-name">{preset.name}</span>
              <Badge aria-hidden="true" className="preset-quick-meta" variant="secondary">
                {preset.trackIds.length}
              </Badge>
            </span>
          </Button>
        </li>
      ))}
    </ul>
  );
}
