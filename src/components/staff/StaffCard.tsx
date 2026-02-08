import React from "react";
import { View, Text, Pressable } from "react-native";
import { Avatar } from "@/src/components/ui/Avatar";
import { Badge } from "@/src/components/ui/Badge";
import { Card } from "@/src/components/ui/Card";
import type { StaffMember } from "@/src/types";

interface StaffCardProps {
  staff: StaffMember;
  onPress?: () => void;
  selected?: boolean;
}

export function StaffCard({ staff, onPress, selected }: StaffCardProps) {
  const maxServices = 3;
  const visibleServices = staff.services?.slice(0, maxServices) || [];
  const remaining = (staff.services?.length || 0) - maxServices;

  return (
    <Pressable onPress={onPress}>
      <Card
        className={`flex-row items-center gap-3 ${selected ? "border-2 border-primary" : ""}`}
      >
        <Avatar
          source={staff.photoUrl}
          name={staff.name}
          size={56}
        />
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {staff.name}
          </Text>
          {staff.bio && (
            <Text
              className="mt-0.5 text-sm text-muted-foreground"
              numberOfLines={1}
            >
              {staff.bio}
            </Text>
          )}
          <View className="mt-1.5 flex-row flex-wrap gap-1">
            {visibleServices.map((s) => (
              <Badge key={s.id} variant="secondary">
                {s.name}
              </Badge>
            ))}
            {remaining > 0 && (
              <Badge variant="secondary">+{remaining}</Badge>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
