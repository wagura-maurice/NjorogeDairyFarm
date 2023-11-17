// src/components/common/Profile.tsx
import React from 'react';
import { SafeAreaView, View, Text, Pressable } from 'react-native';
import Avatar from './Avatar';
import tailwind from 'tailwind-rn';
import { IoMdHelpBuoy } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";

const Profile = () => {
  return (
    <SafeAreaView style={tailwind('flex-1 w-full bg-gray-950')}>
      <View style={tailwind('flex-1 items-center justify-center gap-8')}>
        <Avatar source={{ uri: "https://source.unsplash.com/random" }} />
        <View style={tailwind('gap-2 items-center')}>
          <Text style={tailwind('text-gray-50 text-3xl font-bold')}>
            Joe Bloggs
          </Text>
          <Text style={tailwind('text-gray-50 text-lg')}>joe@bloggs.com</Text>
        </View>
      </View>
      <View style={tailwind('flex-1 justify-center gap-8')}>
        <Pressable style={tailwind('flex-row items-center gap-2 px-8')}>
          <IoSettingsOutline name="settings-outline" size={24} color="#fff" />
          <Text style={tailwind('text-gray-50 text-lg')}>Settings</Text>
        </Pressable>
        <Pressable style={tailwind('flex-row items-center gap-2 px-8')}>
          <IoMdHelpBuoy name="help-buoy-outline" size={24} color="#fff" />
          <Text style={tailwind('text-gray-50 text-lg')}>Help</Text>
        </Pressable>
        <Pressable style={tailwind('flex-row items-center gap-2 px-8')}>
          <TbLogout name="logout" size={24} color="#fff" />
          <Text style={tailwind('text-gray-50 text-lg')}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
