'use client';

import { deleteProjectAction } from '@/actions/delete-project';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProjectDeleteButtonProps {
  projectId: string;
  projectTitle?: string | null;
}

export function ProjectDeleteButton({
  projectId,
  projectTitle,
}: ProjectDeleteButtonProps) {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShowConfirmation(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result: any = await deleteProjectAction({ projectId });
    setIsDeleting(false);
    setShowConfirmation(false);

    if (result?.serverError) {
      toast.error(result.serverError);
      return;
    }

    if (result?.validationErrors) {
      const first = Object.values(result.validationErrors)[0] as
        | string[]
        | undefined;
      toast.error(first?.[0] ?? 'Invalid input');
      return;
    }

    if (result?.data?.error) {
      toast.error(result.data.error);
      return;
    }

    toast.success('Project deleted');
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#d9dde1] bg-white/90 text-[#8b929b] shadow-[0_6px_14px_rgba(0,0,0,0.08)] transition hover:text-[#1f242c]"
        aria-label="Delete project"
        title="Delete project"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Delete project?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{' '}
              {projectTitle ? `"${projectTitle}"` : 'this project'} and its
              images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
