'use client';

import { projectColors } from '@/lib/mock-data';

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {projectColors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={`h-8 w-8 rounded-lg transition-all duration-150 hover:scale-110 ${
            value === color
              ? 'ring-2 ring-offset-2 ring-primary ring-offset-background scale-110'
              : 'ring-1 ring-border'
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
}
