import React from 'react';
import { View, Text } from 'react-native';

const Dashboard: React.FC = () => {
  return (
    <View className="flex-1 bg-gray-50 justify-center items-center p-6">
      <Text className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to AuraShift
      </Text>
      <Text className="text-lg text-gray-600 text-center">
        Your journey to a smoke-free life starts here!
      </Text>
      <View className="mt-8 p-4 bg-white rounded-lg shadow-md">
        <Text className="text-base text-gray-700">
          Dashboard content will be implemented here
        </Text>
      </View>
    </View>
  );
};

export default Dashboard;
