"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserProfile } from "@/api/profile";
import { UserProfile } from "@/types/profile";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Loader2, UserCircle } from "lucide-react";

const avatarOptions = [
  "https://assets.opeeps.fun/avatar-illustration-system-example.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwloa2kklfvpul3m88mzIsaCadGir5GXSd-Q&s",
  "https://miro.medium.com/v2/resize:fit:2400/1*PkrwrLwaq68CaqLPn7jBIw.png",
  "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp",
];

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  avatar: z.string().url("Invalid avatar URL"),
});

type FormData = z.infer<typeof schema>;

export function EditProfileModal({
  open,
  onClose,
  currentProfile,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onUpdate: (updated: UserProfile) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: currentProfile.name,
      avatar: currentProfile.avatar,
    },
  });

  const selectedAvatar = watch("avatar");

  const onSubmit = async (data: FormData) => {
    const updated = await updateUserProfile(data);
    onUpdate(updated);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" /> Edit Profile
          </DialogTitle>
          <DialogDescription>Update your name and avatar.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Select an Avatar
            </label>
            <div className="grid grid-cols-5 gap-2">
              {avatarOptions.map((url) => (
                <button
                  type="button"
                  key={url}
                  onClick={() => setValue("avatar", url)}
                  className={`w-20 h-20 rounded-full overflow-hidden border-2 transition ${
                    selectedAvatar === url
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={url}
                      className="w-full h-full object-cover"
                    />
                  </Avatar>
                </button>
              ))}
            </div>
            {errors.avatar && (
              <p className="text-sm text-red-500 mt-1">
                {errors.avatar.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
