import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert, 
  ScrollView 
} from 'react-native';
import { 
  X, 
  Cigarette, 
  Dumbbell, 
  Apple, 
  Sparkles, 
  Users 
} from 'lucide-react-native';
import { ActivityType } from '../../api/activities';

interface ActivityModalProps {
  visible: boolean;
  onClose: () => void;
  onActivityCreate: (type: ActivityType, metadata?: any) => void;
  isLoading?: boolean;
}

const ACTIVITY_OPTIONS = [
  {
    type: 'cigarette_consumed' as ActivityType,
    label: 'I Smoked',
    icon: Cigarette,
    color: '#dc2626',
    bgColor: '#fef2f2',
    points: -10,
    description: 'Log a cigarette consumed'
  },
  {
    type: 'gym_workout' as ActivityType,
    label: 'Gym Workout',
    icon: Dumbbell,
    color: '#059669',
    bgColor: '#ecfdf5',
    points: +5,
    description: 'Physical exercise session'
  },
  {
    type: 'healthy_meal' as ActivityType,
    label: 'Healthy Meal',
    icon: Apple,
    color: '#dc2626',
    bgColor: '#fef2f2',
    points: +3,
    description: 'Nutritious food choice'
  },
  {
    type: 'skin_care' as ActivityType,
    label: 'Skin Care',
    icon: Sparkles,
    color: '#7c3aed',
    bgColor: '#faf5ff',
    points: +2,
    description: 'Self-care routine'
  },
  {
    type: 'social_event' as ActivityType,
    label: 'Social Event',
    icon: Users,
    color: '#2563eb',
    bgColor: '#eff6ff',
    points: +1,
    description: 'Social interaction'
  }
];

const ActivityModal: React.FC<ActivityModalProps> = ({ 
  visible, 
  onClose, 
  onActivityCreate, 
  isLoading = false 
}) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [note, setNote] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');

  const handleActivitySelect = (activityType: ActivityType) => {
    // Always show the details form for activities from the modal
    // This allows users to add notes and metadata for any activity
    setSelectedActivity(activityType);
  };

  const handleCreateActivity = (activityType: ActivityType) => {
    const metadata: any = {};
    
    if (note.trim()) {
      metadata.note = note.trim();
    }
    
    if (duration.trim() && !isNaN(Number(duration))) {
      metadata.duration = Number(duration);
    }
    
    if (activityType === 'gym_workout') {
      metadata.intensity = intensity;
    }

    // Show confirmation for negative activities
    if (activityType === 'cigarette_consumed') {
      Alert.alert(
        'Confirm Smoking',
        'Are you sure you want to log smoking a cigarette? This will reduce your aura score by 10 points.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Yes, I Smoked', 
            style: 'destructive',
            onPress: () => {
              onActivityCreate(activityType, Object.keys(metadata).length > 0 ? metadata : undefined);
            }
          }
        ]
      );
    } else {
      // For positive activities, create immediately
      onActivityCreate(activityType, Object.keys(metadata).length > 0 ? metadata : undefined);
    }
  };

  const handleClose = () => {
    setSelectedActivity(null);
    setNote('');
    setDuration('');
    setIntensity('medium');
    onClose();
  };

  const getActivityOption = (type: ActivityType) => {
    return ACTIVITY_OPTIONS.find(option => option.type === type);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-900">
              {selectedActivity ? 'Activity Details' : 'Log Activity'}
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
            >
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {!selectedActivity ? (
            /* Activity Selection */
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-gray-600 mb-4">Choose an activity to log:</Text>
              
              {ACTIVITY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.type}
                  onPress={() => handleActivitySelect(option.type)}
                  className="flex-row items-center p-4 rounded-2xl mb-3 border border-gray-200"
                  style={{ backgroundColor: option.bgColor }}
                >
                  <View 
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                    style={{ backgroundColor: option.color + '20' }}
                  >
                    <option.icon size={24} color={option.color} />
                  </View>
                  
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-bold text-gray-900">{option.label}</Text>
                      <Text className={`font-bold ${option.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {option.points > 0 ? '+' : ''}{option.points} pts
                      </Text>
                    </View>
                    <Text className="text-gray-600 text-sm">{option.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            /* Activity Details Form */
            <ScrollView showsVerticalScrollIndicator={false}>
              {(() => {
                const option = getActivityOption(selectedActivity);
                return (
                  <View>
                    {/* Selected Activity Header */}
                    <View 
                      className="flex-row items-center p-4 rounded-2xl mb-6"
                      style={{ backgroundColor: option?.bgColor }}
                    >
                      <View 
                        className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                        style={{ backgroundColor: option?.color + '20' }}
                      >
                        {option?.icon && <option.icon size={24} color={option.color} />}
                      </View>
                      <View className="flex-1">
                        <Text className="font-bold text-gray-900 text-lg">{option?.label}</Text>
                        <Text className={`font-bold ${option && option.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {option && option.points > 0 ? '+' : ''}{option?.points} points
                        </Text>
                      </View>
                    </View>

                    {/* Note Input */}
                    <View className="mb-4">
                      <Text className="text-gray-700 font-medium mb-2">Note (optional)</Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                        placeholder="Add a note about this activity..."
                        placeholderTextColor="#9CA3AF"
                        value={note}
                        onChangeText={setNote}
                        multiline
                        numberOfLines={3}
                      />
                    </View>

                    {/* Duration Input for applicable activities */}
                    {(selectedActivity === 'gym_workout' || selectedActivity === 'social_event') && (
                      <View className="mb-4">
                        <Text className="text-gray-700 font-medium mb-2">Duration (minutes)</Text>
                        <TextInput
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                          placeholder="e.g., 30"
                          placeholderTextColor="#9CA3AF"
                          value={duration}
                          onChangeText={setDuration}
                          keyboardType="numeric"
                        />
                      </View>
                    )}

                    {/* Intensity for gym workouts */}
                    {selectedActivity === 'gym_workout' && (
                      <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-2">Intensity</Text>
                        <View className="flex-row space-x-3">
                          {(['low', 'medium', 'high'] as const).map((level) => (
                            <TouchableOpacity
                              key={level}
                              onPress={() => setIntensity(level)}
                              className={`flex-1 py-3 rounded-xl border-2 ${
                                intensity === level 
                                  ? 'bg-green-50 border-green-400' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <Text className={`text-center font-medium capitalize ${
                                intensity === level ? 'text-green-700' : 'text-gray-600'
                              }`}>
                                {level}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Action Buttons */}
                    <View className="flex-row space-x-3">
                      <TouchableOpacity
                        onPress={() => setSelectedActivity(null)}
                        className="flex-1 py-4 bg-gray-100 rounded-2xl"
                      >
                        <Text className="text-center font-bold text-gray-700">Back</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={() => handleCreateActivity(selectedActivity)}
                        disabled={isLoading}
                        className={`flex-1 py-4 rounded-2xl ${
                          isLoading ? 'bg-gray-400' : 'bg-red-500'
                        }`}
                      >
                        <Text className="text-center font-bold text-white">
                          {isLoading ? 'Logging...' : 'Log Activity'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })()}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ActivityModal;
