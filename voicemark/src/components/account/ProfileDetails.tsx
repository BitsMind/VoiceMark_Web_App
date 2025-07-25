import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/profile";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useSignOutDialog } from "../alert/SignOutAlert";
import { LogOut, Pencil } from "lucide-react";

export function ProfileDetails({ profile }: { profile: UserProfile }) {
  const { show, Dialog } = useSignOutDialog();

  return (
    <Card className="flex items-center space-x-4 p-6 bg-background">
      <Avatar className="w-24 h-24">
        {/* {profile.avatarUrl ? (
          <AvatarImage src={profile.avatarUrl} alt="Avatar" />
         ) : ( */}
        <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
        {/* )}  */}
      </Avatar>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{profile.name}</h2>
        <p className="text-muted-foreground text-sm">{profile.email}</p>
      </div>

      <div className="flex flex-col space-y-3">
        <Button>
          <Pencil /> Edit Profile
        </Button>

        <Button onClick={show} className="text-red-400" variant="outline">
          <LogOut /> Log Out
        </Button>
      </div>
      {Dialog}
    </Card>
  );
}
