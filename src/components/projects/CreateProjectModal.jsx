'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ColorPicker from '@/components/shared/ColorPicker';
import { useState } from 'react';

const projectSchema = z.object({
  name: z.string().min(2, 'Project name is required'),
  description: z.string().optional(),
});

export default function CreateProjectModal({ open, onClose }) {
  const { addProject } = useApp();
  const [color, setColor] = useState('#4F46E5');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = (data) => {
    addProject({ ...data, color });
    reset();
    setColor('#4F46E5');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create Project</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add a new project to organize your tasks.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="e.g. Website Redesign"
              className="h-10 rounded-xl"
              {...register('name')}
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <p className="text-xs text-red-500" role="alert">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-desc">Description</Label>
            <textarea
              id="project-desc"
              placeholder="Brief description of the project..."
              className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              {...register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
