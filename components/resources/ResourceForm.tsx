'use client';

import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createResource } from '@/app/actions/resources';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Building = {
    id: number;
    name: string;
};

type ResourceType = {
    id: number;
    name: string;
};

type State = {
    success: boolean;
    error?: string;
    message?: string;
}

const initialState: State = {
    success: false,
    message: '',
    error: '',
};

export function ResourceForm({ buildings, types }: { buildings: Building[], types: ResourceType[] }) {
    const [state, action, isPending] = useActionState<State, FormData>(createResource, initialState);

    useEffect(() => {
        if (state.success && state.message) {
            toast.success(state.message);
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form action={action} className="space-y-4">
            <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Resource Name</label>
                <Input type="text" name="name" placeholder="e.g., Lab 204" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <label htmlFor="typeId" className="text-sm font-medium">Type</label>
                    <select
                        name="typeId"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">-- Select Type --</option>
                        {types.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
                <div className="grid gap-2">
                    <label htmlFor="buildingId" className="text-sm font-medium">Building</label>
                    <select
                        name="buildingId"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">-- Select Building --</option>
                        {buildings.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <label htmlFor="floorNumber" className="text-sm font-medium">Floor Number</label>
                    <Input type="number" name="floorNumber" placeholder="2" required />
                </div>
                <div className="grid gap-2">
                    <label htmlFor="capacity" className="text-sm font-medium">Capacity</label>
                    <Input type="number" name="capacity" placeholder="30" required />
                </div>
            </div>

            <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input type="text" name="description" placeholder="Projector available, AC..." />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Add Resource
            </Button>
        </form>
    );
}
