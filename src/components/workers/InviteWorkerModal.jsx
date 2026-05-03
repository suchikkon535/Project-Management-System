'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, User } from 'lucide-react';

const inviteSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
});

export default function InviteWorkerModal({ open, onClose }) {
  const { addWorker } = useApp();
  const [role, setRole] = useState('Member');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: '', email: '' },
  });

  const onSubmit = (data) => {
    addWorker({ ...data, role });
    reset();
    setRole('Member');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Invite Worker</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Send an invitation to a new team member.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="worker-name">Full Name</Label>
            <Input
              id="worker-name"
              placeholder="e.g. John Doe"
              className="h-10 rounded-xl"
              {...register('name')}
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <p className="text-xs text-red-500" role="alert">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="worker-email">Email Address</Label>
            <Input
              id="worker-email"
              type="email"
              placeholder="john@taskflow.io"
              className="h-10 rounded-xl"
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="text-xs text-red-500" role="alert">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Member">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    <div>
                      <span className="font-medium">Member</span>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="Admin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" />
                    <div>
                      <span className="font-medium">Admin</span>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {role === 'Admin'
                ? 'Full control over team and projects.'
                : 'Can view and complete assigned tasks.'}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
              Send Invitation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
