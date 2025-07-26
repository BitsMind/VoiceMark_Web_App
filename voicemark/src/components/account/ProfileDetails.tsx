import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/profile";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useSignOutDialog } from "../alert/SignOutAlert";
import { LogOut, Pencil } from "lucide-react";
import { EditProfileModal } from "./EditProfileModal";
import { fetchUserProfile } from "@/api/profile";

export function ProfileDetails({ profile, onUpdate }: { profile: UserProfile, onUpdate: (update: UserProfile)=> void}) {
  const { show, Dialog } = useSignOutDialog();
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<UserProfile>(profile);


  return (
    <Card className="flex items-center space-x-4 p-6 bg-background">
      <Avatar className="w-24 h-24">
        {profile.avatar ? (
          <AvatarImage src={profile.avatar} alt="Avatar" />
         ) : (
        <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
        )}  
      </Avatar>
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-semibold" >{profile.name}</h2>
        <p className="text-muted-foreground text-sm">{profile.email}</p>
      </div>

      <div className="flex flex-col space-y-3">
        <Button onClick={() => setOpen(true)} >
          <Pencil /> Edit Profile
        </Button>

        <Button onClick={show} className="text-red-400" variant="outline">
          <LogOut /> Log Out
        </Button>
      </div>

      {Dialog}

      <EditProfileModal
        open={open}
        onClose={() => setOpen(false)}
        currentProfile={userData}
        onUpdate={async () => {
          setOpen(false);
          const updated = await fetchUserProfile();
          onUpdate(updated);
        }}
      />
    </Card>
  );
}
